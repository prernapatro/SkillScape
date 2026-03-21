function receiveUpload(req, res) {
  const resume = req.files?.resume?.[0] || null;

  if (!resume) {
    return res.status(400).json({ success: false, error: "Missing required file: resume" });
  }

  return res.json({
    success: true,
    filePath: resume.path,
    fileName: resume.originalname,
    message: "Resume uploaded successfully"
  });
}

 module.exports = {
   receiveUpload,
 };

