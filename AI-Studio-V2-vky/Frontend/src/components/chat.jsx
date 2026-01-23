import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Paperclip,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ChatContext } from "../../context/ChatContext";

const Chat = ({
  inputValue,
  handleInputChange,
  handleKeyDown,
  activeTab,
  handleTabClick,
  isRecording,
  toggleRecording,
  fileInputRef,
  handleFileUpload,
  handleFileChange,
  textareaRef,
  messagesEndRef,
  showSystemStatus,
  systemStatus,
  sendMessage,
  isLoading = false,
  documentMode,
  setDocumentMode,
}) => {
  const { messages } = useContext(ChatContext);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [loadingTTS, setLoadingTTS] = useState(null);
  const [expandedSources, setExpandedSources] = useState({});
  const audioRefs = useRef({});

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendClick = (e) => {
    e.preventDefault();
    if (!isLoading && inputValue.trim()) {
      sendMessage(documentMode);
    }
  };

  // Text-to-Speech functionality
const handleTextToSpeech = async (text, messageIndex) => {
  try {
    setLoadingTTS(messageIndex);
 
    const VITE_BACKEND_URL =
      import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8077";
 
    console.log("Sending TTS text:", text);
 
    const response = await fetch(`${VITE_BACKEND_URL}/api/tts/text-to-speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
 
    console.log("TTS response status:", response.status);
 
    const rawText = await response.text();
    // console.log("Raw response:", rawText);
 
    if (!response.ok) {
      throw new Error(`Backend error ${response.status}: ${rawText}`);
    }
 
    const data = JSON.parse(rawText);
    console.log("Parsed TTS response:", data);
 
    if (!data.audio) {
      throw new Error("Audio data missing from backend");
    }
 
    const audioBlob = new Blob(
      [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
      { type: "audio/mpeg" }
    );
 
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
 
    audioRefs.current[messageIndex] = audio;
 
    audio.onplay = () => setPlayingAudio(messageIndex);
    audio.onended = () => {
      setPlayingAudio(null);
      URL.revokeObjectURL(audioUrl);
      delete audioRefs.current[messageIndex];
    };
 
    await audio.play();
  } catch (error) {
    console.error("TTS Error FULL:", error);
    alert(error.message);
  } finally {
    setLoadingTTS(null);
  }
};
 
  // Stop audio playback
  const stopAudio = (messageIndex) => {
    const audio = audioRefs.current[messageIndex];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setPlayingAudio(null);
    }
  };

  // Toggle sources dropdown
  const toggleSources = (messageIndex) => {
    setExpandedSources((prev) => ({
      ...prev,
      [messageIndex]: !prev[messageIndex],
    }));
  };

  // Cleanup audio refs on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
    };
  }, []);

  return (
    <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col min-w-0">
      {/* Chat Header */}
      <div className="flex justify-between items-center p-5 border-b border-white/10">
        <div className="text-lg font-semibold">Conversation</div>
        <div className="flex gap-2 items-center">
          {/* Document Mode Toggle Button */}
          <button
            onClick={() => setDocumentMode(!documentMode)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200 border ${
              documentMode
                ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                : "border-transparent hover:bg-white/5"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={
              documentMode
                ? "Document Mode: AI will use uploaded documents"
                : "LLM Only: AI will respond without documents"
            }
          >
            {documentMode ? "📄 Document Mode" : "🤖 LLM Only"}
          </button>

          {/* Existing Tab Buttons */}
          {["Chat", "Code", "Preview"].map((tab) => (
            <div
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200 border ${
                activeTab === tab
                  ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                  : "border-transparent hover:bg-white/5"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent">
        {showSystemStatus && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span>{systemStatus}</span>
          </div>
        )}

        {/* Document Mode Indicator */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              documentMode ? "bg-blue-400" : "bg-white/40"
            }`}
          ></div>
          <span className={documentMode ? "text-blue-400" : "text-white"}>
            {documentMode
              ? "📄 Document Mode - AI will use uploaded documents"
              : "🤖 LLM Only - AI will respond without documents"}
          </span>
        </div>

        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-white/40">
            <div className="text-center">
              <div className="text-lg mb-2">👋</div>
              <div>Start a conversation by typing a message below</div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className="mb-6 animate-in slide-in-from-bottom-4 duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                  message.sender === "user"
                    ? "bg-gradient-to-br from-orange-500 to-red-500"
                    : "bg-gradient-to-br from-blue-500 to-purple-600"
                }`}
              >
                {message.sender === "user" ? "U" : "AI"}
              </div>
              <span className="text-sm text-white/60">
                {message.sender === "user" ? "You" : "Assistant"}
              </span>
              {message.timestamp && (
                <span className="text-xs text-white/40 ml-auto">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
            <div
              className={`ml-11 p-4 rounded-xl border ${
                message.sender === "ai"
                  ? "bg-blue-500/10 border-blue-500/20"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="whitespace-pre-wrap break-words mb-3">
                {message.content}
              </div>

              {/* Sources Display for Document Mode */}
              {message.sender === "ai" &&
                message.sources &&
                message.sources.length > 0 &&
                message.documentMode && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => toggleSources(index)}
                      className="flex items-center gap-2 text-xs text-white/60 hover:text-white/80 transition-colors"
                    >
                      <span>Sources ({message.sources.length})</span>
                      {expandedSources[index] ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {expandedSources[index] && (
                      <div className="mt-2 bg-white/5 border border-white/10 rounded-lg p-3">
                        <ul className="space-y-1">
                          {message.sources.map((source, sourceIndex) => {
                            // Extract filename and page from source string
                            // Format: "filename p.page (similarity: score)"
                            const match = source.match(
                              /^(.+?)\s+p\.(.+?)\s+\(/
                            );
                            if (match) {
                              const [, filename, page] = match;
                              return (
                                <li
                                  key={sourceIndex}
                                  className="text-xs text-blue-300 flex items-center gap-2"
                                >
                                  <span className="text-blue-400">•</span>
                                  <span className="font-medium">
                                    {filename}
                                  </span>
                                  <span className="text-white/60">
                                    - Page {page}
                                  </span>
                                </li>
                              );
                            }
                            return null;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

              {/* TTS Controls for AI messages */}
              {message.sender === "ai" && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                  {loadingTTS === index ? (
                    <div className="flex items-center gap-2 text-blue-400 text-xs">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Generating speech...</span>
                    </div>
                  ) : playingAudio === index ? (
                    <button
                      onClick={() => stopAudio(index)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                    >
                      <VolumeX className="w-3 h-3" />
                      Stop Audio
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTextToSpeech(message.content, index)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
                    >
                      <Volume2 className="w-3 h-3" />
                      Listen
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="mb-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-semibold">
                AI
              </div>
              <span className="text-sm text-white/60">Assistant</span>
            </div>
            <div className="ml-11 p-4 rounded-xl border bg-blue-500/10 border-blue-500/20">
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 border-t border-white/10">
        <div className="flex gap-3 items-end">
          {/* File Upload Button */}
          <button
            onClick={handleFileUpload}
            disabled={isLoading}
            className="w-11 h-11 bg-white/5 border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upload file"
          >
            <Paperclip className="w-5 h-5 text-white/60 group-hover:text-white/80" />
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 pr-12 text-sm resize-none min-h-[44px] max-h-[120px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-white/40 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={
                isLoading ? "AI is responding..." : "Type your message here..."
              }
              rows={1}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>

          {/* Voice Recording Button */}
          <button
            onClick={toggleRecording}
            disabled={isLoading}
            className={`w-11 h-11 border rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isRecording
                ? "bg-red-500 border-red-400 hover:bg-red-600 animate-pulse"
                : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
            }`}
            title={isRecording ? "Stop recording" : "Start voice recording"}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white/60 hover:text-white/80" />
            )}
          </button>

          {/* Send Button */}
          <button
            className="w-11 h-11 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            onClick={handleSendClick}
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Recording... Click the microphone to stop
          </div>
        )}

        {/* Character count or other status info */}
        {inputValue.length > 0 && (
          <div className="mt-2 text-xs text-white/40">
            {inputValue.length} characters
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
