import React, { useState } from "react";
import Sidebar from './Sidebar'
import ChatInterface from "./ChatInterface";

const InputPage = () => {
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        file={file}
        setFile={setFile}
        fileUploaded={fileUploaded}
        setFileUploaded={setFileUploaded}
      />
      <ChatInterface fileUploaded={fileUploaded} />
    </div>
  );
};

export default InputPage;