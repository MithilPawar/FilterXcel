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

const storage = multer.memoryStorage();
const allowedMimeTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only Excel or CSV files are allowed"));
    }
    cb(null, true);
  },
});

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

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "File too large. Max size is 10MB" });
  }
  if (err?.message === "Only Excel or CSV files are allowed") {
    return res.status(400).json({ success: false, message: err.message });
  }
  return next(err);
});

router.get("/files/:fileId", verifyToken, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }
    if (file.userId?.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, file });
  } catch (error) {
    console.error("File Retrieval Error:", error);
    res.status(500).json({ success: false, message: "Error retrieving file" });
  }
});

router.delete("/files/:fileId", verifyToken, async (req, res) => {
  try {
    const metadata = await File.findById(req.params.fileId);
    if (!metadata) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    if (metadata.userId?.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    try {
      await bucket.delete(metadata.fileId);
    } catch (error) {
      if (error?.message && !error.message.includes("FileNotFound")) {
        throw error;
      }
    }

    await File.findByIdAndDelete(req.params.fileId);

    return res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("File Deletion Error:", error);
    return res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

// ✅ Get File Metadata by ID
router.get("/metadata/:fileId", verifyToken, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId); 

    if (!file) {
      return res.status(404).json({ message: "File metadata not found" });
    }
    if (file.userId?.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// getting recent file of user
router.get("/recent", verifyToken, getRecentFilesByUser);


router.get("/files/download/:fileId", verifyToken, async (req, res) => {
  try {
    console.log("FileId requested:", req.params.fileId);
    const metadata = await File.findById(req.params.fileId);
    
    if (!metadata) return res.status(404).json({ message: "File not found" });
    if (metadata.userId?.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

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
