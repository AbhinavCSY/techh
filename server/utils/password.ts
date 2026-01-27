import crypto from "crypto";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const PASSWORD_FILE = path.join(DATA_DIR, "password.json");

// Fixed encryption key derived from a constant (in production, use env variable)
const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(process.env.APP_SECRET || "default-secret-key")
  .digest();

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function generateRandomPassword(length = 16): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
}

function encryptPassword(password: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    ENCRYPTION_KEY,
    iv
  );

  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

function decryptPassword(encryptedData: string): string {
  const [ivHex, encrypted] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    ENCRYPTION_KEY,
    iv
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export function initializePassword(): string | null {
  ensureDataDir();

  if (fs.existsSync(PASSWORD_FILE)) {
    return null; // Password already exists
  }

  const newPassword = generateRandomPassword();
  const encrypted = encryptPassword(newPassword);

  fs.writeFileSync(
    PASSWORD_FILE,
    JSON.stringify({ encrypted, createdAt: new Date().toISOString() }, null, 2)
  );

  console.log("\n=== APP PASSWORD INITIALIZED ===");
  console.log("Your app is now password protected.");
  console.log("This message is only shown on first startup.");
  console.log("=====================================\n");

  return newPassword;
}

export function verifyPassword(inputPassword: string): boolean {
  ensureDataDir();

  if (!fs.existsSync(PASSWORD_FILE)) {
    return false;
  }

  try {
    const data = JSON.parse(fs.readFileSync(PASSWORD_FILE, "utf-8"));
    const storedPassword = decryptPassword(data.encrypted);
    return inputPassword === storedPassword;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
