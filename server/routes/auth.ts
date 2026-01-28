import { RequestHandler } from "express";
import { verifyPassword, getDevPassword } from "../utils/password";

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

export const handleGetDevPassword: RequestHandler = (req, res) => {
  const devPassword = getDevPassword();

  if (devPassword) {
    res.json({ password: devPassword });
  } else {
    res.status(404).json({ password: null });
  }
};
