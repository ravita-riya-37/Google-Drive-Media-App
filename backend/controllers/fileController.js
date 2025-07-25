const { google } = require("googleapis");
const auth = require("../config/googleAuth"); // Google OAuth2 client

const drive = google.drive({ version: "v3", auth });

// GET: List media files from shared Drive folder
const getMediaFiles = async (req, res) => {
  try {
   
const folderId = req.query.folderId ; // fallback to default

    const response = await drive.files.list({
  q: `'${folderId}' in parents and trashed = false`,
  fields: "files(id, name, mimeType, createdTime, webViewLink)",
  orderBy: "createdTime desc",
});


    const files = response.data.files.map((file) => ({
  id: file.id,
  name: file.name,
  mimeType: file.mimeType,
  createdTime: file.createdTime,
  previewUrl: `http://localhost:5000/api/files/stream/${file.id}`,
  webViewLink: file.webViewLink,
}));


    res.status(200).json(files);
  } catch (error) {
    console.error("Failed to fetch files:", error.message);
    if (error.response && error.response.status === 403) {
  setError("❌ Folder is not public. Please make it public first.");
}

    res.status(500).json({ error: "Failed to fetch files" });
  }
};

// GET: Stream file by fileId
const streamFileById = async (req, res) => {
  const { fileId } = req.params;

  try {
    const fileMeta = await drive.files.get({
      fileId,
      fields: "mimeType, name",
    });

    const fileStream = await drive.files.get(
      {
        fileId,
        alt: "media",
      },
      { responseType: "stream" }
    );

    res.setHeader("Content-Type", fileMeta.data.mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${fileMeta.data.name}"`);

    fileStream.data
      .on("end", () => {
        console.log("File streamed successfully.");
      })
      .on("error", (err) => {
        console.error("Error streaming file:", err.message);
        res.status(500).send("Error streaming file");
      })
      .pipe(res);
  } catch (error) {
    console.error("Error fetching stream:", error.message);
    res.status(500).send("Failed to stream file");
  }
};

module.exports = {
  getMediaFiles,
  streamFileById,
};
