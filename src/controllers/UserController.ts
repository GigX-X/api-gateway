/**
 * Admin controllers
 */

import axios from "axios";
import { Request, Response } from "express";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      `${process.env.USER_SERVICE_URL}/admin/login`,
      req.body
    );
    res.cookie("token", response.data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.json({ message: "Login successful", token: response.data.token });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(401).json({ message: "Login failed" });
  }
};

export const adminLogout = async (req: Request, res: Response) => {
  console.log("inside logout fn in api gateway");
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    console.log("logging the server side cookie", req.cookies.token);
  } catch (error) {
    console.error("Error during logout", error);
    res.status(401).json({ message: "Logout failed !!" });
  }
};
