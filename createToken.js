import {
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
  PublicKey,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";
import { Buffer } from "buffer";

const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

function serializeString(value) {
  const buf = Buffer.from(value, "utf8");
  const len = Buffer.alloc(4);
  len.writeUInt32LE(buf.length);
  return Buffer.concat([len, buf]);
}

function createMetadataInstructionData({ name, symbol, uri }) {
  return Buffer.concat([
    Buffer.from([33]),
    serializeString(name),
    serializeString(symbol),
    serializeString(uri),
    Buffer.from([0, 0]),
    Buffer.from([0]),
    Buffer.from([0]),
    Buffer.from([0]),
    Buffer.from([1]),
    Buffer.from([0]),
  ]);
}

function createMetadataAccountV3({ metadata, mint, authority, payer, name, symbol, uri }) {
  return new TransactionInstruction({
    programId: METADATA_PROGRAM_ID,
    keys: [
      { pubkey: metadata, isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: authority, isSigner: true, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: authority, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ],
    data: createMetadataInstructionData({ name, symbol, uri }),
  });
}

export async function createTokenOnChain({
  wallet,
  connection,
  uri,
  name,
  symbol,
  decimals,
  supply,
}) {
  const payer = wallet.publicKey;
  const mintKeypair = Keypair.generate();

  const [metadata] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      mintKeypair.publicKey.toBuffer(),
    ],
    METADATA_PROGRAM_ID,
  );

  const ata = getAssociatedTokenAddressSync(mintKeypair.publicKey, payer);
  const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
  const amount = BigInt(supply) * 10n ** BigInt(decimals);

  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      payer,
      null,
      TOKEN_PROGRAM_ID,
    ),
    createMetadataAccountV3({
      metadata,
      mint: mintKeypair.publicKey,
      authority: payer,
      payer,
      name,
      symbol,
      uri,
    }),
    createAssociatedTokenAccountInstruction(
      payer,
      ata,
      payer,
      mintKeypair.publicKey,
    ),
    createMintToInstruction(mintKeypair.publicKey, ata, payer, amount),
  );

  const signature = await wallet.sendTransaction(tx, connection, {
    signers: [mintKeypair],
  });
  await connection.confirmTransaction(signature, "confirmed");

  return { mint: mintKeypair.publicKey.toBase58(), signature };
}
