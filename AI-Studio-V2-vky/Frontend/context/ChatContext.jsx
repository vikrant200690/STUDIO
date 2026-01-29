// src/context/ChatContext.jsx
import React, { createContext, useContext, useState, useRef } from "react";
import api from "../src/services/tokenService";

const ChatContext = createContext();
export { ChatContext };

export const ChatProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [model, setModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant."
  );
  const [systemMessage, setSystemMessage] = useState(
    "You are a helpful AI assistant. You provide accurate, thoughtful responses and ask clarifying questions when needed."
  );

  // TTS Settings
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [autoPlayTTS, setAutoPlayTTS] = useState(false);
  const [ttsVoice, setTtsVoice] = useState("default");

  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingIntervalRef = useRef(null);
  const abortStreamRef = useRef(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      content:
        "Hello! I'm ready to assist you. I'm currently configured as a helpful AI assistant. You can modify my behavior using the system message settings on the right panel.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [activePreset, setActivePreset] = useState("helpful");
  const [systemStatus, setSystemStatus] = useState(
    "System configured • Ready for conversation"
  );
  const [showSystemStatus, setShowSystemStatus] = useState(true);

  const modelNames = {
    "GPT-4o": "gpt-4o",
    "GPT-4": "gpt-4",
    "GPT-4-0613": "gpt-4-0613",
    "GPT-4o_MINI": "gpt-4o-mini",
    "GPT-4-TURBO": "gpt-4-turbo",
    "GPT-3.5 Turbo": "gpt-3.5-turbo",
    "Gemini 2.0 Flash": "gemini-2.0-flash",
    "Gemini 2.0 Flash-Lite": "gemini-2.0-flash-lite",
    "Gemini 2.0 Flash-Lite (preview)": "gemini-2.0-flash-lite-preview",
    "LLaMA 3.3 70B": "llama-3.3-70b-versatile",
    "LLaMA 3.1 8B": "llama-3.1-8b-instant",
  };

  const presets = {
    helpful:
      "You are a helpful AI assistant. You provide accurate, thoughtful responses and ask clarifying questions when needed.",
    creative:
      "You are a creative writing assistant. You help users brainstorm ideas, write engaging content, and explore imaginative concepts with enthusiasm and originality.",
    technical:
      "You are a technical expert and programming assistant. You provide detailed, accurate technical information, debug code, and explain complex concepts clearly.",
    teacher:
      "You are a patient and encouraging teacher. You break down complex topics into understandable steps, provide examples, and adapt your explanations to the student's level.",
    document:
      "You are a document analysis assistant. You summarize, answer questions, and provide insights based on the uploaded document, referencing key sections and facts.",
    custom: " ",
  };

  // Fake streaming function
  const streamResponse = async (
    fullContent,
    sources = null,
    contextUsed = false,
    documentMode = false
  ) => {
    return new Promise((resolve) => {
      const timestamp = new Date().toISOString();
      abortStreamRef.current = false;
      setIsStreaming(true);

      // Add empty AI message that will be updated
      const messageId = Date.now();
      const initialMessage = {
        id: messageId,
        sender: "ai",
        content: "",
        timestamp,
        sources,
        contextUsed,
        documentMode,
        isStreaming: true,
      };

      setMessages((prev) => [...prev, initialMessage]);

      let currentIndex = 0;
      const words = fullContent.split(" ");
      
      // Adjust speed based on content length
      const baseSpeed = 30; // milliseconds per word
      const speed = Math.max(15, Math.min(50, baseSpeed));

      streamingIntervalRef.current = setInterval(() => {
        if (abortStreamRef.current) {
          // If aborted, show full content immediately
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, content: fullContent, isStreaming: false }
                : msg
            )
          );
          clearInterval(streamingIntervalRef.current);
          setIsStreaming(false);
          resolve();
          return;
        }

        if (currentIndex < words.length) {
          currentIndex++;
          const partialContent = words.slice(0, currentIndex).join(" ");

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, content: partialContent } : msg
            )
          );
        } else {
          // Streaming complete
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, isStreaming: false } : msg
            )
          );
          clearInterval(streamingIntervalRef.current);
          setIsStreaming(false);

          // Add to chat history
          setChatHistory((prev) => [
            ...prev,
            { role: "ai", content: fullContent, timestamp },
          ]);

          // Handle auto-play TTS
          if (autoPlayTTS && ttsEnabled) {
            setTimeout(() => {
              handleTextToSpeech(fullContent, messages.length);
            }, 500);
          }

          resolve();
        }
      }, speed);
    });
  };

  // Stop streaming function
  const stopStreaming = () => {
    abortStreamRef.current = true;
  };

  const addMessage = (
    content,
    role,
    sources = null,
    contextUsed = false,
    documentMode = false,
    useStreaming = false
  ) => {
    const timestamp = new Date().toISOString();

    if (role === "user") {
      // User messages are added immediately
      setChatHistory((prev) => [...prev, { role, content, timestamp }]);

      const newMessage = {
        sender: role,
        content,
        timestamp,
        sources,
        contextUsed,
        documentMode,
      };

      setMessages((prev) => [...prev, newMessage]);
    } else if (role === "ai" && useStreaming) {
      // AI messages with streaming
      streamResponse(content, sources, contextUsed, documentMode);
    } else {
      // AI messages without streaming (legacy behavior)
      setChatHistory((prev) => [...prev, { role, content, timestamp }]);

      const newMessage = {
        sender: role,
        content,
        timestamp,
        sources,
        contextUsed,
        documentMode,
      };

      setMessages((prev) => [...prev, newMessage]);

      if (role === "ai" && autoPlayTTS && ttsEnabled) {
        setTimeout(() => {
          handleTextToSpeech(content, messages.length);
        }, 500);
      }
    }
  };

  const handleTextToSpeech = async (text, messageIndex) => {
    try {
      const response = await api.post("/api/tts", {
        text: text,
      });

      const data = response.data;

      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
        { type: "audio/mpeg" }
      );

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

      return true;
    } catch (error) {
      console.error("TTS Error:", error);
      return false;
    }
  };

  const handleVoiceTranscription = async (audioBlob, documentMode = false) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");
      formData.append("document_mode", documentMode.toString());

      const response = await api.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      if (data.transcript) {
        addMessage(data.transcript, "user");

        if (data.response) {
          // Use streaming for voice responses
          await streamResponse(
            data.response,
            data.sources || [],
            data.context_used || false,
            data.document_mode || false
          );
        }

        if (data.audio && ttsEnabled) {
          const audioBlob = new Blob(
            [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
            { type: "audio/mpeg" }
          );

          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          await audio.play();

          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
          };
        }
      }

      return data;
    } catch (error) {
      console.error("Voice transcription error:", error);
      throw error;
    }
  };

  const handlePresetClick = (preset) => {
    setSystemMessage(presets[preset]);
    setActivePreset(preset);
  };

  const addSystemMessage = (text) => {
    setSystemStatus(text);
    setShowSystemStatus(true);

    setTimeout(() => {
      setShowSystemStatus(false);
      setTimeout(() => {
        setSystemStatus("System configured • Ready for conversation");
        setShowSystemStatus(true);
      }, 100);
    }, 3000);
  };

  const handleResetSystem = () => {
    setSystemMessage(presets.helpful);
    setActivePreset("helpful");
    addSystemMessage("System message reset to default.");
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
    const selectedModelName = Object.keys(modelNames).find(
      (key) => modelNames[key] === e.target.value
    );
    addSystemMessage(
      `Switched to ${
        selectedModelName || e.target.value
      }. Model configuration updated.`
    );
  };

  const handleApplySystem = () => {
    if (systemMessage.trim()) {
      addSystemMessage("System message updated successfully.");
    }
  };

  const handleSendMessage = async (message, documentMode = false) => {
    try {
      const response = await api.post("/api/chat", {
        model,
        temperature,
        top_p: topP,
        system_prompt: systemMessage,
        user_message: message,
        document_mode: documentMode,
      });

      const data = response.data;

      // Use streaming for AI responses
      await streamResponse(
        data.response,
        data.sources || [],
        data.context_used || false,
        documentMode
      );
    } catch (error) {
      console.error("Error sending message:", error);

      addMessage(
        "Sorry, I encountered an error while processing your request. Please try again.",
        "ai",
        null,
        false,
        false,
        false // Don't stream error messages
      );
    }
  };

  const clearMessages = () => {
    // Stop any ongoing streaming
    stopStreaming();
    
    setMessages([
      {
        sender: "ai",
        content:
          "Hello! I'm ready to assist you. I'm currently configured as a helpful AI assistant. You can modify my behavior using the system message settings on the right panel.",
        timestamp: new Date().toISOString(),
      },
    ]);
    setChatHistory([]);
  };

  return (
    <ChatContext.Provider
      value={{
        chatHistory,
        addMessage,
        model,
        setModel,
        temperature,
        setTemperature,
        topP,
        setTopP,
        systemPrompt,
        setSystemPrompt,
        handleResetSystem,
        handlePresetClick,
        setSystemMessage,
        systemMessage,
        addSystemMessage,
        handleModelChange,
        handleApplySystem,
        modelNames,
        activePreset,
        systemStatus,
        showSystemStatus,
        presets,
        handleSendMessage,
        messages,
        setMessages,
        clearMessages,
        ttsEnabled,
        setTtsEnabled,
        autoPlayTTS,
        setAutoPlayTTS,
        ttsVoice,
        setTtsVoice,
        handleTextToSpeech,
        handleVoiceTranscription,
        isStreaming,
        stopStreaming,
        streamResponse,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
