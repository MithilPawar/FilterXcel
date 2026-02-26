import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import verifyToken from "../middleware/authMiddleware.js";
import { GridFSBucket } from "mongodb";
import crypto from "crypto";
import File from "../models/File.js";
import {getRecentFilesByUser} from "../controller/fileController.js"

dotenv.config();
const router = express.Router();

const conn = mongoose.connection;

// ✅ Use `multer` with `memoryStorage` (GridFS needs Buffer data)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload File Route (Manually Handling GridFS)
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // ✅ Create a GridFSBucket Instance
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "uploads",
    });

    // ✅ Generate Unique Filename (To Prevent Overwrites)
    const filename = `${crypto.randomUUID()}-${req.file.originalname}`;

    // ✅ Upload Stream
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
    });

    // ✅ Write File Data to GridFS
    uploadStream.end(req.file.buffer);

    // ✅ Handle Upload Finish Event
    uploadStream.on("finish", async () => {
      console.log("Upload Success:", uploadStream.id);

      // ✅ Save metadata in your `File` schema
      const newFile = new File({
        userId: req.user.userId,
        fileId: uploadStream.id,
        filename: filename,
        contentType: req.file.mimetype,
        size: req.file.size,
      });

      await newFile.save();

      res.json({
        success: true,
        message: "File uploaded successfully",
        fileId: newFile._id,
      });
    });

    uploadStream.on("error", (err) => {
      console.error("Upload Error:", err);
      res.status(500).json({ success: false, message: "File upload failed" });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/files/:fileId", async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }
    res.json({ success: true, file });
  } catch (error) {
    console.error("File Retrieval Error:", error);
    res.status(500).json({ success: false, message: "Error retrieving file" });
  }
});

// ✅ Get File Metadata by ID
router.get("/metadata/:fileId", async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId); 

    if (!file) {
      return res.status(404).json({ message: "File metadata not found" });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// getting recent file of user
router.get("/recent/:userId", getRecentFilesByUser);


router.get("/files/download/:fileId", async (req, res) => {
  try {
    console.log("FileId requested:", req.params.fileId);
    const metadata = await File.findById(req.params.fileId);
    
    if (!metadata) return res.status(404).json({ message: "File not found" });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    console.log("metadata.fileId:", metadata.fileId);
    const downloadStream = bucket.openDownloadStream(metadata.fileId);

    let data = [];
    downloadStream.on("data", (chunk) => data.push(chunk));
    downloadStream.on("error", () =>
      res.status(500).json({ message: "Error downloading file" })
    );
    downloadStream.on("end", () => {
      const buffer = Buffer.concat(data);
      res.json({
        success: true,
        file: {
          filename: metadata.filename,
          contentType: metadata.contentType,
          buffer: buffer.toString("base64"), 
        },
      });
    });
  } catch (err) {
    console.error("Download Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
