import { RequestHandler } from "express";
import { verifyPassword } from "../utils/password";

export const handleVerifyPassword: RequestHandler = (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== "string") {
    res.status(400).json({ success: false, message: "Password required" });
    return;
  }

  const isValid = verifyPassword(password);

  if (isValid) {
    res.json({ success: true, message: "Password verified" });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
};
