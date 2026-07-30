import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import adminRoutes from "./routes/admin.route.js";

import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { connectDB } from "./lib/db.js";
import { app, httpServer } from "./lib/socket.js";

dotenv.config();

// Convert __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: true, // Change to your Vercel URL after frontend deployment
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const distPath = join(__dirname, "../../frontend/dist");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(join(distPath, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);

  try {
    await connectDB();
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
  }
});