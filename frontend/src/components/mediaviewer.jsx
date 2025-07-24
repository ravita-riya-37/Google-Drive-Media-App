import React, { useEffect, useState } from "react";
import axios from "axios";

const MediaViewer = () => {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/files");
        setFiles(res.data);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    files.forEach((file) => {
      console.log(file.name, file.previewUrl);
    });
  }, [files]);

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
    <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800 tracking-wide">
      📁 Media Files
    </h1>
    <div className="flex gap-4 justify-center mb-6">
  <button
    onClick={() => setFilter("all")}
    className={`px-4 py-2 rounded-full text-white ${
      filter === "all" ? "bg-purple-600" : "bg-gray-400"
    }`}
  >
    All
  </button>
  <button
    onClick={() => setFilter("image")}
    className={`px-4 py-2 rounded-full text-white ${
      filter === "image" ? "bg-purple-600" : "bg-gray-400"
    }`}
  >
    Images
  </button>
  <button
    onClick={() => setFilter("audio")}
    className={`px-4 py-2 rounded-full text-white ${
      filter === "audio" ? "bg-purple-600" : "bg-gray-400"
    }`}
  >
    Audios
  </button>
</div>


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
            <audio controls className="w-full  mt-5 preload=metadata">
              <source
                src={`http://localhost:5000/api/files/stream/${file.id}`}
                type={file.mimeType}
              />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div className="text-red-400 italic mt-6">Unsupported file type</div>
          )}

          <p className="mt-4 text-sm text-center text-blue-800 break-words font-medium">
            {file.name}
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
  </div>
);

};

export default MediaViewer;
