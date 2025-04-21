import React from "react";
import { jsPDF } from "jspdf";

const DownloadPage = ({ conversation }) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Edu-RAG Question Answering", 20, y);
    y += 10;

    conversation.forEach((msg) => {
      const isUser = msg.type === "user";
      let cleanMessage = msg.message.replace(/<\/?[^>]+(>|$)/g, "").replace(/\n/g, "\n\n");

      doc.setFont("helvetica", isUser ? "bold" : "normal");
      doc.setFontSize(12);
      let wrappedText = doc.splitTextToSize(cleanMessage, 180);
      doc.text(wrappedText, 20, y);
      y += wrappedText.length * 7;

      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("conversation.pdf");
  };

  return (
    <button
      onClick={downloadPDF}
      className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-orange-600"
    >
      Download Conversation
    </button>
  );
};

export default DownloadPage;