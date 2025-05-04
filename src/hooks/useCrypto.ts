import crypto from "crypto";

export const useCrypto = () => {
  const encrypt = (text) => {
    const cipher = crypto.createCipheriv(
      process.env.CRYPTO_ALGORITHM || "",
      process.env.CRYPTO_SECRETKEY || "",
      process.env.CRYPTO_IV || ""
    );
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString("hex");
  };

  const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(
      process.env.CRYPTO_ALGORITHM || "",
      process.env.CRYPTO_SECRETKEY || "",
      process.env.CRYPTO_IV || ""
    );
    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(hash, "hex")),
      decipher.final(),
    ]);
    return decrpyted.toString();
  };
  return { encrypt, decrypt };
};
