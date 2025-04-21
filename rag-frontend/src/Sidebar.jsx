import React, { useRef, useState } from "react";
const apiBaseUrl = import.meta.env.VITE_BASE_URL;

const Sidebar = ({ file, setFile, fileUploaded, setFileUploaded }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFileUploaded(false);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please upload a PDF first!");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${apiBaseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("PDF uploaded and processed!");
        setFileUploaded(true);
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileUploaded(false);
    fileInputRef.current.value = null; // Clear the actual input
  };

  return (
    <div className="w-1/4 bg-gray-800 text-white p-6 flex flex-col items-center space-y-4 fixed top-0 left-0 h-full">
      <h2 className="text-xl font-bold">Upload PDF</h2>

      {/* Custom "Choose File" button */}
      <button
        onClick={() => fileInputRef.current.click()}
        className="bg-white text-black px-4 py-2 rounded-md w-full hover:bg-gray-200"
        disabled={loading}
      >
        {file ? "Change File" : "Choose PDF File"}
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Show file name only if file exists */}
      {file && (
        <p className="text-sm text-gray-300 truncate w-full text-center">
          {file.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        className={`px-4 py-2 rounded-md w-full text-white ${
          loading || !file
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={loading || !file}
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>

      {file && (
        <button
          onClick={handleRemoveFile}
          className="text-red-300 text-xs underline hover:text-red-500"
        >
          Remove File
        </button>
      )}
    </div>
  );
};

export default Sidebar;
