import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import ExportConversation from "./ExportConversation";

const Header = ({ modelNames, selectedModel, onClearChat }) => {
  const { model, chatHistory } = useContext(ChatContext);

  return (
    <div className="flex justify-between items-center p-6 bg-white/2 backdrop-blur-xl border-b border-white/10">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl font-bold">AI Playground</h1>
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-md text-xs font-medium text-blue-400">
            <span>🤖</span>
            <span>{modelNames[model]}</span>
          </div>
        </div>
        <p className="text-white/60 text-sm">
          Build, test, and deploy intelligent conversations
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClearChat}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 border border-red-500/30 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/30 transition-all duration-200"
          title="Clear session and start fresh"
        >
          <span>🧹</span>
           Clear Chat

        </button>

        {/* ✅ Correct Export */}
        <ExportConversation chatHistory={chatHistory} />

        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200">
          🚀 Deploy
        </button>
      </div>
    </div>
  );
};

export default Header;
