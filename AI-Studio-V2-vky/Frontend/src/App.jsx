import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Paperclip, Mic, MicOff } from "lucide-react";
import Header from "./components/header";
import SettingsPanel from "./components/settingsPanel";
import { ChatContext } from "../context/ChatContext";
import Chat from "./components/chat";
import api, { checkAuth } from "./services/tokenService";  // Changed ../ to ./



const NEXUSAiStudio = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Get context values
  const {
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
    handleApplySystem,
    modelNames,
    handleVoiceTranscription,
    messages,
    setMessages,
    systemStatus,
    showSystemStatus,
    handleSendMessage,
  } = useContext(ChatContext);

  // Local state
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("Chat");
  const [maxTokens, setMaxTokens] = useState(2000);
  const [activePreset, setActivePreset] = useState("helpful");
  const [streamResponse, setStreamResponse] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [codeHighlighting, setCodeHighlighting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documentMode, setDocumentMode] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Session management for document cleanup
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log("🔍 Checking authentication...");
        const userData = await checkAuth();
        
        if (userData) {
          console.log("✅ User authenticated:",);
          setIsAuthenticated(true);
        } else {
          console.log("❌ Not authenticated, redirecting to login");
          navigate('/login');
        }
      } catch (error) {
        console.error("❌ Authentication check failed:", error);
        navigate('/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  // Cleanup function to delete session data
  const cleanupSession = async (sessionId) => {
    if (!sessionId) return;

    try {
      const response = await api.post('/cleanup-session', {
        session_id: sessionId
      });

      console.log("🧹 Session cleaned up successfully");
      setCurrentSessionId(null);
    } catch (error) {
      console.error("❌ Error cleaning up session:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  // Manual clear chat function - PRESERVES DOCUMENTS
  const handleClearChat = () => {
    setInputValue("");
    setMessages([]);
    console.log("🧹 Chat UI cleared, documents preserved");
  };

  // Manual delete documents function - EXPLICIT ACTION ONLY
  const handleDeleteDocuments = async () => {
    if (
      currentSessionId &&
      window.confirm(
        "Are you sure you want to delete all uploaded documents? This action cannot be undone."
      )
    ) {
      await cleanupSession(currentSessionId);
      setDocumentMode(false);
      setInputValue("");
      setMessages([]);
      console.log("🗑️ Documents deleted and session reset");
    }
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
  };

  const startSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      console.warn("Speech recognition not supported in this browser");
      setIsRecording(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  useEffect(() => {
    createParticles();
    handlePresetClick("helpful");

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (currentSessionId) {
        console.log("🚪 User is leaving, but preserving session data...");
      }
    };

    const handlePageHide = (event) => {
      if (currentSessionId && event.persisted === false) {
        console.log("📱 Page is being hidden, but preserving session data...");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [currentSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const createParticles = () => {
    const particlesContainer = document.getElementById("particles");
    if (!particlesContainer) return;

    particlesContainer.innerHTML = "";

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className =
        "absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 8 + "s";
      particle.style.animationDuration = 8 + Math.random() * 4 + "s";
      particlesContainer.appendChild(particle);
    }
  };

  const handleToggleSwitch = (toggle) => {
    switch (toggle) {
      case "stream":
        setStreamResponse(!streamResponse);
        break;
      case "autoSave":
        setAutoSave(!autoSave);
        break;
      case "codeHighlighting":
        setCodeHighlighting(!codeHighlighting);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(documentMode);
    }
  };

  const sendMessage = async (documentMode = false) => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      addMessage(message, "user");
      await handleSendMessage(message, documentMode);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401 || error.status === 401) {
        addMessage("⚠️ Session expired. Redirecting to login...", "ai");
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

        try {
          setIsLoading(true);
          await handleVoiceTranscription(audioBlob, documentMode);
        } catch (error) {
          console.error("Voice transcription error:", error);
          
          // Check for auth error
          if (error.response?.status === 401 || error.status === 401) {
            addMessage("⚠️ Session expired. Redirecting to login...", "ai");
            setTimeout(() => navigate('/login'), 2000);
          } else {
            addMessage(
              "Sorry, I couldn't process your voice message. Please try again.",
              "ai"
            );
          }
        } finally {
          setIsLoading(false);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setIsLoading(true);

      try {
        const results = [];

        for (const file of files) {
          console.log(`Uploading: ${file.name}`);

          const formData = new FormData();
          formData.append("file", file);

          try {
            const response = await api.post('/upload-document', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            const result = response.data;
            results.push(result);

            if (
              result.session_id &&
              (!currentSessionId || result.session_id !== currentSessionId)
            ) {
              setCurrentSessionId(result.session_id);
              console.log(`🆕 New session created: ${result.session_id}`);
            }

            addMessage(
              `✅ Uploaded: ${result.filename}\n📄 Created ${
                result.embedding_result?.chunks_created || 0
              } chunks for AI knowledge`,
              "ai"
            );
          } catch (uploadError) {
            if (uploadError.response?.status === 401) {
              addMessage("⚠️ Session expired. Redirecting to login...", "ai");
              setTimeout(() => navigate('/login'), 2000);
              return;
            }
            throw uploadError;
          }
        }

        if (results.length > 1) {
          const totalChunks = results.reduce(
            (sum, r) => sum + (r.embedding_result?.chunks_created || 0),
            0
          );
          addMessage(
            `🎉 Successfully uploaded ${results.length} documents with ${totalChunks} total chunks!\n\nYou can now ask me questions about these documents.`,
            "ai"
          );
        } else {
          addMessage(
            "💡 You can now ask me questions about this document!",
            "ai"
          );
        }
      } catch (error) {
        console.error("Upload error:", error);
        addMessage(`❌ Upload failed: ${error.message}`, "ai");
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder, isRecording]);

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl">🔐 Verifying authentication...</div>
        </div>
      </div>
    );
  }

  // Only render the main component if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-900 to-slate-950 text-white overflow-hidden">
      {/* Floating Particles */}
      <div
        id="particles"
        className="fixed inset-0 pointer-events-none z-0"
      ></div>

      <div className="flex h-screen w-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header
            modelNames={modelNames}
            selectedModel={model}
            onClearChat={handleClearChat}
          />

          {/* Workspace */}
          <div className="flex-1 flex p-6 gap-6 min-h-0">
            {/* Chat Panel */}
            <Chat
              messages={messages}
              inputValue={inputValue}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              sendMessage={sendMessage}
              activeTab={activeTab}
              handleTabClick={handleTabClick}
              isRecording={isRecording}
              toggleRecording={toggleRecording}
              fileInputRef={fileInputRef}
              handleFileUpload={handleFileUpload}
              handleFileChange={handleFileChange}
              textareaRef={textareaRef}
              messagesEndRef={messagesEndRef}
              showSystemStatus={showSystemStatus}
              isLoading={isLoading}
              systemStatus="System configured • Ready for conversation"
              documentMode={documentMode}
              setDocumentMode={setDocumentMode}
            />

            {/* Settings Panel */}
            <SettingsPanel
              selectedModel={model}
              temperature={temperature}
              setTemperature={setTemperature}
              maxTokens={maxTokens}
              setMaxTokens={setMaxTokens}
              topP={topP}
              setTopP={setTopP}
              activePreset={activePreset}
              systemMessage={systemMessage}
              setSystemMessage={setSystemMessage}
              handlePresetClick={handlePresetClick}
              handleResetSystem={handleResetSystem}
              handleApplySystem={handleApplySystem}
              handleToggleSwitch={handleToggleSwitch}
              streamResponse={streamResponse}
              autoSave={autoSave}
              codeHighlighting={codeHighlighting}
              modelNames={modelNames}
              presets={presets}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NEXUSAiStudio;
