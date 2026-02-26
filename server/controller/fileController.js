import File from "../models/File.js";

export const getRecentFilesByUser = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const recentFiles = await File.find({ userId })
        .sort({ uploadedAt: -1 })
        .limit(3); 
  
      res.status(200).json(recentFiles);
    } catch (err) {
      console.error("Error fetching recent files:", err);
      res.status(500).json({ message: "Failed to get recent files" });
    }
  };