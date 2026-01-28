import { Handler } from "@netlify/functions";
import crypto from "crypto";

const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(process.env.APP_SECRET || "default-secret-key")
  .digest();

function verifyPassword(inputPassword: string): boolean {
  const envPassword = process.env.APP_PASSWORD;
  if (envPassword) {
    return inputPassword === envPassword;
  }
  return false;
}

const handler: Handler = async (event) => {
  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body || "{}");
    const { password } = body;

    if (!password || typeof password !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Password required",
        }),
      };
    }

    const isValid = verifyPassword(password);

    if (isValid) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Password verified",
        }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: "Invalid password",
        }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};

export { handler };
