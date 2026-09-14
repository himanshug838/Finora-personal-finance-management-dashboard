import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ALGORITHM = "aes-256-gcm";

const rawKey =
  process.env.PLAID_ENCRYPTION_KEY ||
  crypto
    .createHash("sha256")
    .update(process.env.JWT_SECRET || "finora_default_secret_key_32_bytes_long")
    .digest("hex");

const KEY = Buffer.from(rawKey.slice(0, 64), "hex");


/*
|--------------------------------------------------------------------------
| ENCRYPT
|--------------------------------------------------------------------------
*/

const encryptPlaidToken = (plainText) => {

  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    KEY,
    iv
  );

  let encrypted =
    cipher.update(
      plainText,
      "utf8",
      "hex"
    );

  encrypted += cipher.final("hex");

  const authTag =
    cipher.getAuthTag().toString("hex");

  return [
    iv.toString("hex"),
    authTag,
    encrypted,
  ].join(":");
};


/*
|--------------------------------------------------------------------------
| DECRYPT
|--------------------------------------------------------------------------
*/

const decryptPlaidToken = (encryptedText) => {

  const [
    ivHex,
    authTagHex,
    encryptedHex,
  ] = encryptedText.split(":");

  const decipher =
    crypto.createDecipheriv(
      ALGORITHM,
      KEY,
      Buffer.from(ivHex, "hex")
    );

  decipher.setAuthTag(
    Buffer.from(authTagHex, "hex")
  );

  let decrypted =
    decipher.update(
      encryptedHex,
      "hex",
      "utf8"
    );

  decrypted += decipher.final("utf8");

  return decrypted;
};


export {
  encryptPlaidToken,
  decryptPlaidToken,
};