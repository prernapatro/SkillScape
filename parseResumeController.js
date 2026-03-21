const fs = require('fs');
const parseResumeService = require("../services/parseResumeService");

async function parseResume(req, res) {
  const { filePath } = req.body;
  
  if (!filePath) {
    return res.status(400).json({ success: false, error: "Missing required filePath" });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: "File not found on server" });
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = filePath.split('.').pop().toLowerCase();
    
    let mimeType = 'application/pdf';
    if (ext === 'docx') {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    const resumeText = await parseResumeService.parseBuffer({
      fileBuffer,
      originalName: filePath.split(/[\\/]/).pop(),
      mimeType: mimeType,
    });

    if (!resumeText || resumeText.replace(/\s+/g, '').length < 30) {
      return res.status(400).json({ 
        success: false, 
        error: "Resume could not be parsed correctly. Please upload a clearer PDF or DOCX." 
      });
    }

    return res.json({
      success: true,
      parsedText: resumeText
    });
  } catch (err) {
    console.error("Error in parseResume:", err);
    return res.status(500).json({ success: false, error: "Failed to parse resume." });
  }
}

module.exports = { parseResume };
