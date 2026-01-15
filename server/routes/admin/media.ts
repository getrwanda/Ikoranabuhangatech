import { Router } from "express";
import { requireAuth } from "../../auth";
import { storage } from "../../storage";
import { logActivity } from "../../utils";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for disk storage
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

const router = Router();

// Upload file
router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const url = `/uploads/${req.file.filename}`;

    // Save file metadata to database
    const mediaFile = await storage.createMedia({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url,
    });

    await logActivity(req, "Uploaded media file", "media", mediaFile.id);

    res.json({ success: true, url, data: mediaFile });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ success: false, message: "Failed to upload file" });
  }
});

// Get all media files
router.get("/", requireAuth, async (req, res) => {
  try {
    const files = await storage.getMediaFiles();
    res.json({ success: true, data: files });
  } catch (error) {
    console.error("Error fetching media files:", error);
    res.status(500).json({ success: false, message: "Failed to fetch media files" });
  }
});

// Delete media file
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get file info before deleting from DB
    const files = await storage.getMediaFiles();
    const file = files.find(f => f.id === id);

    if (file) {
      // Delete from database
      await storage.deleteMedia(id);

      // Delete physical file
      const filePath = path.join(process.cwd(), "uploads", file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await logActivity(req, "Deleted media file", "media", id);
    }

    res.json({ success: true, message: "Media file deleted" });
  } catch (error) {
    console.error("Error deleting media file:", error);
    res.status(500).json({ success: false, message: "Failed to delete media file" });
  }
});

export default router;
