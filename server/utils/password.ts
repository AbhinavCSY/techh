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
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

function encryptPassword(password: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

function decryptPassword(encryptedData: string): string {
  const [ivHex, encrypted] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export function initializePassword(): string | null {
  ensureDataDir();
  const isProduction = process.env.NODE_ENV === "production";

  // Check if APP_PASSWORD is set (works in both production and development)
  const envPassword = process.env.APP_PASSWORD;

  if (envPassword) {
    // Use environment variable password
    const encrypted = encryptPassword(envPassword);
    fs.writeFileSync(
      PASSWORD_FILE,
      JSON.stringify(
        { encrypted, createdAt: new Date().toISOString() },
        null,
        2,
      ),
    );

    const mode = isProduction ? "PRODUCTION" : "DEVELOPMENT";
    console.log(`\n=== APP PASSWORD INITIALIZED (${mode}) ===`);
    console.log("App secured with password from APP_PASSWORD env variable.");
    console.log("=====================================\n");

    return null;
  }

  // If no environment variable is set and we're in production, throw error
  if (isProduction) {
    throw new Error(
      "APP_PASSWORD environment variable is required in production",
    );
  }

  // In development without env var: generate a new random password on every server start
  const newPassword = generateRandomPassword();
  const encrypted = encryptPassword(newPassword);

  fs.writeFileSync(
    PASSWORD_FILE,
    JSON.stringify({ encrypted, createdAt: new Date().toISOString() }, null, 2),
  );

  // Create a file with the plaintext password for this session
  const setupFile = path.join(DATA_DIR, "SETUP_PASSWORD.txt");
  const setupMessage = `LOCAL PASSWORD - GENERATED ON SERVER START
=====================================
Your local development server is secured with a password.

PASSWORD: ${newPassword}

This password is regenerated every time the server restarts.
Use it to log in to the app locally.

File location: ${setupFile}
=====================================
`;

  fs.writeFileSync(setupFile, setupMessage);

  console.log("\n=== LOCAL PASSWORD GENERATED (DEVELOPMENT) ===");
  console.log(`Your local password: ${newPassword}`);
  console.log(`Password saved to: ${setupFile}`);
  console.log("This password will be regenerated on the next server restart.");
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
