import React, { useEffect, useState } from "react";
import axios from "axios";
import AudioCard from "./AudioCard";


const MediaViewer = () => {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState("all");
  const [folderId, setFolderId] = useState("");
  const [error, setError] = useState("");

  // ✅ Load folderId + filter from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const folderIdFromURL = params.get("folderId");
    const filterFromURL = params.get("filter");

    if (folderIdFromURL) {
      setFolderId(folderIdFromURL);
      fetchFiles(folderIdFromURL);
    }
    if (filterFromURL) {
      setFilter(filterFromURL);
    }
  }, []);

  // ✅ Update URL on filter/folderId change
  useEffect(() => {
    const params = new URLSearchParams();
    if (folderId) params.set("folderId", folderId);
    if (filter !== "all") params.set("filter", filter);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  }, [filter, folderId]);

  // ✅ Fetch files from backend
  const fetchFiles = async (id) => {
    try {
      setError("");
      const res = await axios.get(`https://google-drive-media-app-1.onrender.com/api/files?folderId=${id}`);
      setFiles(res.data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      if (!id || id.trim() === "") {
        setError("❗ Please enter a folder ID.");
      } else if (error.response?.status === 403) {
        setError("❌ Folder is not public. Please make it public.");
      } else {
        setError("⚠️ Failed to fetch files. Check Folder ID.");
      }
    }
  };

  // ✅ Share current URL
  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this Google Drive media viewer",
          text: "Here's the media viewer link 👇",
          url: shareUrl,
        });
        console.log("✅ Shared successfully");
      } catch (err) {
        console.error("Sharing failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("✅ Link copied to clipboard!");
      } catch (err) {
        console.error("Clipboard write failed:", err);
        alert("❌ Failed to copy link");
      }
    }
  };

  return (
    <div className="min-h-screen bg-rose-200  p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-rose-800 tracking-wide">
        Google Drive Media App
      </h1>

      {/* 📂 Folder Input */}
      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Enter Google Drive Folder ID"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          className="w-full max-w-xl px-5 py-3  bg-purple-200 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md placeholder-gray-500 transition duration-200"/>
        <button
          onClick={() => fetchFiles(folderId)}
          className="ml-4 px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600"
        >
          Load Folder
        </button>
        <p className="mt-2 text-sm text-yellow-700 font-bold">
          ⚠️ Make sure the folder is public before loading.
        </p>
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      </div>

      {/* 🔘 Filter Buttons */}
      <div className="flex gap-4 justify-center mb-6">
        {["all", "image", "audio"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full hover:bg-purple-600 text-white ${
              filter === type ? "bg-purple-500" : "bg-gray-400"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* 📸 Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {files
          .filter((file) => {
            if (filter === "all") return true;
            if (filter === "image") return file.mimeType.startsWith("image/");
            if (filter === "audio") return file.mimeType.startsWith("audio/");
            return false;
          })
          .map((file) => (
            <div
              key={file.id}
              className="bg-blue-200 border border-gray-200 rounded-2xl shadow-md p-5 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300"
            >
              {file.mimeType.startsWith("image/") && file.previewUrl ? (
                <img
                  src={`http://localhost:5000/api/files/stream/${file.id}`}
                  alt={file.name}
                  className="w-full h-30 object-contain rounded-lg"
                />
              ) : file.mimeType.startsWith("audio/") ? (
                <AudioCard file={file} />

              ) : file.mimeType === "application/vnd.google-apps.folder" ? (
                <div className="text-purple-700 text-center text-2xl mt-6">
                  <h1 className="font-bold text-5xl text-purple-600 mb-2">Folder</h1>
                  <p className="text-base italic text-green-800">
                    Please check the link below to view its contents.
                  </p>
                </div>
              ) : (
                <div className="text-yellow-500 text-center text-2xl mt-6">
                  <h1 className="font-bold text-3xl text-red-500 mb-2">Unsupported File</h1>
                  <p className="text-base italic text-green-800">
                    Please check the link below to view its contents.
                  </p>
                </div>
              )}

              <p className="mt-4 text-sm text-center text-blue-800 break-words font-medium">
                Name: {file.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Uploaded: {new Date(file.createdTime).toLocaleString()}
              </p>
              <a
                href={file.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-blue-600 text-sm underline hover:text-blue-800"
              >
                Open in Drive
              </a>
            </div>
          ))}
      </div>

      {/* 🔗 Share */}
      <div className="mt-6 text-center">
        <button
          onClick={handleShare}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-5 py-2 rounded shadow-md"
        >
          🔗 Share This Page
        </button>
      </div>
    </div>
  );
};

export default MediaViewer;
