import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa"; 

const AudioCard = ({ file }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `https://google-drive-media-app-1.onrender.com/api/files/stream/${file.id}`;
    link.download = file.name;
    link.click();
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="w-full p-3 bg-white rounded shadow">
      <p className="text-blue-800 font-semibold mb-2">{file.name}</p>
      <audio ref={audioRef} src={`https://google-drive-media-app-1.onrender.com/api/files/stream/${file.id}`} preload="metadata" />

      <div className="flex flex-col gap-2 mt-2">
        {/* Play / Pause and Download */}
        <div className="flex items-center gap-4">
          
         
        </div>

        {/* Seek bar and Time */}
        <div className="flex items-center gap-2">
         <button
  onClick={togglePlay}
  className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 ease-in-out
    ${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
    text-white text-xl`}
>
  {isPlaying ? <FaPause /> : <FaPlay />}
</button>

          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 accent-blue-600"
          />
          <span className="text-sm font-mono">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioCard;
