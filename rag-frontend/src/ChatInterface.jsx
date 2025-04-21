import React, { useState, useEffect, useRef } from "react";
const apiBaseUrl = import.meta.env.VITE_BASE_URL;

const ChatInterface = ({ fileUploaded }) => {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const conversationEndRef = useRef(null);

  const handleAsk = async () => {
    if (!question) return alert("Please enter a question.");

    const userTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setConversation((prev) => [
      ...prev,
      { type: "user", message: question, time: userTime },
    ]);
    setQuestion("");
    setBotTyping(true);
    setTypingMessage("");
    setIsTypingDone(false);

    try {
      const res = await fetch(`${apiBaseUrl}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      const answer = data?.answer || "No answer found.";
      const botTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      let i = 0;
      const interval = setInterval(() => {
        setTypingMessage(answer.slice(0, i + 1));
        i++;
        if (i === answer.length) {
          clearInterval(interval);
          setTypingMessage("");
          setBotTyping(false);
          setIsTypingDone(true);

          setConversation((prev) => [
            ...prev,
            { type: "bot", message: answer, time: botTime },
          ]);
        }
      }, 10);
    } catch (error) {
      console.error("Answer fetch error:", error);
      setBotTyping(false);
      setConversation((prev) => [
        ...prev,
        {
          type: "bot",
          message: "Error getting response.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAsk();
  };

  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation, typingMessage, isTypingDone]);

  return (
    <div className="w-3/4 p-6 flex flex-col justify-between ml-[25%]">
      <h1 className="text-2xl font-bold mb-6 text-center">AI Edu-Assistant</h1>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[calc(100vh-150px)]">
        {conversation.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-3xl px-4 py-2 rounded-xl shadow-lg ${
                msg.type === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-300 text-black rounded-bl-none"
              }`}
            >
              <div dangerouslySetInnerHTML={{ __html: msg.message }} />
              <div className="text-xs text-gray-200 mt-1 text-right">{msg.time}</div>
            </div>
          </div>
        ))}

        {botTyping && typingMessage && (
          <div className="flex justify-start">
            <div className="max-w-3xl px-4 py-2 rounded-xl shadow-lg bg-gray-300 text-black rounded-bl-none">
              <div dangerouslySetInnerHTML={{ __html: typingMessage }} />
              <div className="text-xs text-gray-400 mt-1 text-right">Typing...</div>
            </div>
          </div>
        )}

        <div ref={conversationEndRef} />
      </div>

      <div className="flex items-center bg-white p-4 rounded-lg shadow-lg border border-gray-200 mt-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border p-2 rounded-md w-full"
          placeholder="Ask a question..."
          disabled={!fileUploaded}
        />
        <button
          onClick={handleAsk}
          disabled={!fileUploaded}
          className={`ml-2 px-4 py-2 rounded-md text-white ${
            !fileUploaded ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-green-600"
          }`}
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;