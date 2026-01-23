import React from "react";
import { Volume2, VolumeX, Settings, RotateCcw } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import ExportConversation from "../../components/ExportConversation";



const TTSSettingsPanel = () => {
  const {
    ttsEnabled,
    setTtsEnabled,
    autoPlayTTS,
    setAutoPlayTTS,
    ttsVoice,
    setTtsVoice,
    model,
    setModel,
    temperature,
    setTemperature,
    topP,
    setTopP,
    systemMessage,
    setSystemMessage,
    handleResetSystem,
    handlePresetClick,
    handleApplySystem,
    modelNames,
    activePreset,
    presets,
    clearMessages,
  } = useChat();

  return (
    <div className="w-80 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-fit">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold">Chat Settings</h2>
      </div>

      {/* Model Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">AI Model</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          {Object.entries(modelNames).map(([displayName, modelValue]) => (
            <option key={modelValue} value={modelValue} className="bg-gray-800">
              {displayName}
            </option>
          ))}
        </select>
      </div>

      {/* Temperature Control */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Creativity (Temperature): {temperature}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
        <small className="text-white/60">
          Lower values are more focused, higher values are more creative
        </small>
      </div>

      {/* Top P Control */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Focus (Top P): {topP}
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={topP}
          onChange={(e) => setTopP(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
        <small className="text-white/60">
          Controls response diversity and focus
        </small>
      </div>

      {/* TTS Settings Section */}
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="w-4 h-4 text-blue-400" />
          <h3 className="font-medium text-blue-400">Text-to-Speech</h3>
        </div>

        {/* Enable/Disable TTS */}
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm">Enable TTS</label>
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              ttsEnabled ? "bg-blue-500" : "bg-white/20"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                ttsEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Auto-play TTS */}
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm">Auto-play responses</label>
          <button
            onClick={() => setAutoPlayTTS(!autoPlayTTS)}
            disabled={!ttsEnabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoPlayTTS && ttsEnabled ? "bg-blue-500" : "bg-white/20"
            } ${!ttsEnabled ? "opacity-50" : ""}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoPlayTTS && ttsEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Voice Selection */}
        <div className="mb-3">
          <label className="block text-sm mb-2">Voice Style</label>
          <select
            value={ttsVoice}
            onChange={(e) => setTtsVoice(e.target.value)}
            disabled={!ttsEnabled}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
          >
            <option value="default" className="bg-gray-800">Default</option>
            <option value="alloy" className="bg-gray-800">Alloy</option>
            <option value="echo" className="bg-gray-800">Echo</option>
            <option value="fable" className="bg-gray-800">Fable</option>
            <option value="onyx" className="bg-gray-800">Onyx</option>
            <option value="nova" className="bg-gray-800">Nova</option>
            <option value="shimmer" className="bg-gray-800">Shimmer</option>
          </select>
        </div>

        {/* TTS Status */}
        <div className="text-xs text-white/60">
          {ttsEnabled ? (
            <div className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-green-400" />
              <span>TTS Ready</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <VolumeX className="w-3 h-3 text-red-400" />
              <span>TTS Disabled</span>
            </div>
          )}
        </div>
      </div>

      {/* System Message Presets */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Personality Presets</label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {Object.keys(presets).map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 capitalize ${
                activePreset === preset
                  ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                  : "bg-white/5 border-white/20 hover:bg-white/10"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Custom System Message */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Custom System Message</label>
        <textarea
          value={systemMessage}
          onChange={(e) => setSystemMessage(e.target.value)}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm resize-none min-h-[80px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-white/40"
          placeholder="Enter custom system instructions..."
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleApplySystem}
            className="px-3 py-1.5 text-xs bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
          >
            Apply
          </button>
          <button
            onClick={handleResetSystem}
            className="px-3 py-1.5 text-xs bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

     {/* Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          {/* Deploy */}
          <button
            onClick={deployApp} // define this handler
            className="w-full px-4 py-2 text-sm bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-200"
          >
            Deploy
          </button>
          {/* Export */}
          <button
            onClick={exportConversation}
            className="w-full px-4 py-2 text-sm bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
          >
            Export Conversation
          </button>

          {/* Clear Chat */}
          <button
            onClick={clearMessages}
            className="w-full px-4 py-2 text-sm bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
          >
            Clear Conversation
          </button>
        </div>

      {/* Custom CSS for sliders */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
      `}</style>
    </div>
  );
};

export default TTSSettingsPanel