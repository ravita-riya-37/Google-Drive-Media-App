const axios = require("axios");

const getMediaFilesFromDrive = async (folderId, apiKey) => {
  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${apiKey}&fields=files(id,name,mimeType,createdTime)`;

  const res = await axios.get(url);
  const files = res.data.files;

  const mappedFiles = files.map((file) => {
    const { id, name, mimeType, createdTime } = file;
    let previewUrl = "";

    if (mimeType.startsWith("image/")) {
      previewUrl = `https://drive.google.com/uc?export=view&id=${id}`;
    } else if (mimeType.startsWith("audio/")) {
      previewUrl = `https://docs.google.com/uc?export=download&id=${id}`;
    } else {
      previewUrl = null; // unsupported file type
    }

    return { id, name, mimeType, previewUrl, createdTime };
  });

  return mappedFiles;
};

module.exports = { getMediaFilesFromDrive };
