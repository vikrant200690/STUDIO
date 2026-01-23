import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext, ChatProvider } from "../../context/ChatContext";

const SettingsPanel = ({
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  topP,
  setTopP,
  activePreset,
  systemMessage,
  setSystemMessage,
  handlePresetClick,
  handleResetSystem,
  handleApplySystem,
  handleToggleSwitch,
  streamResponse,
  autoSave,
  modelNames,
  presets,
  codeHighlighting,
  voiceInput,
}) => {
  const { handleModelChange, model } = useContext(ChatContext);

  return (
    <>
      <div className="w-80 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent">
        <div className="text-lg font-semibold mb-5">Model Configuration</div>

        {/* Model Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/80 mb-2">
            AI Model
          </label>
          <select
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            value={model}
            onChange={handleModelChange}
          >
            {Object.entries(modelNames).map(([label, value]) => (
              <option key={value} value={value} className="bg-slate-800">
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* System Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/80 mb-2">
            System Message
          </label>
          <div className="flex flex-wrap gap-1 mb-2">
            {[...Object.keys(presets), "document", "custom" ].map((preset) => (
              <button
                key={preset}
                className={`px-2 py-1 text-xs rounded border transition-all duration-200 ${
                  activePreset === preset
                    ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                    : "bg-white/10 border-white/20 text-white/80 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-400"
                }`}
                onClick={() => handlePresetClick(preset)}
              >
                {preset.charAt(0).toUpperCase() + preset.slice(1)}{" "}
                {preset === "helpful"
                  ? "Assistant"
                  : preset === "creative"
                  ? "Writer"
                  : preset === "technical"
                  ? "Expert"
                  : preset === "document"
                  ? "Expert"
                  : preset === "custom"
                  ? ""
                  : "Tutor"
                  }
              </button>
            ))}
          </div>
          <textarea
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-3 text-sm min-h-[80px] max-h-[200px] resize-y focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-white/40 leading-relaxed"
            placeholder="Define the AI's role, personality, and behavior guidelines..."
            value={systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
          />
          <div className="flex gap-2 mt-2 justify-end">
            <button
              className="px-3 py-1.5 text-xs bg-white/10 border border-white/20 rounded text-white/80 hover:bg-white/15 transition-all duration-200"
              onClick={handleResetSystem}
            >
              Reset
            </button>
            <button
              className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-500 to-purple-600 rounded hover:shadow-md hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200"
              onClick={handleApplySystem}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Parameters */}
        <div className="text-lg font-semibold mb-5">Parameters</div>

        {/* Temperature */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/80 mb-2">
            Temperature
          </label>
          <div className="relative">
            <input
              type="range"
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer focus:outline-none slider"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
            <div className="text-xs text-white/60 mt-1">{temperature}</div>
          </div>
        </div>

        {/* Max Tokens */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/80 mb-2">
            Max Tokens
          </label>
          <div className="relative">
            <input
              type="range"
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer focus:outline-none slider"
              min="100"
              max="4000"
              step="100"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            />
            <div className="text-xs text-white/60 mt-1">{maxTokens}</div>
          </div>
        </div>

        {/* Top P */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-white/80 mb-2">
            Top P
          </label>
          <div className="relative">
            <input
              type="range"
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer focus:outline-none slider"
              min="0"
              max="1"
              step="0.1"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
            />
            <div className="text-xs text-white/60 mt-1">{topP}</div>
          </div>
        </div>

        {/* Features */}
        <div className="text-lg font-semibold mb-5">Features</div>
        {[
          {
            key: "stream",
            label: "Stream Response",
            value: streamResponse,
          },
          { key: "autoSave", label: "Auto-save", value: autoSave },
          {
            key: "codeHighlighting",
            label: "Code Highlighting",
            value: codeHighlighting,
          },
          { key: "voiceInput", label: "Voice Input", value: voiceInput },
        ].map((toggle) => (
          <div
            key={toggle.key}
            className="flex items-center justify-between py-3"
          >
            <span className="text-sm">{toggle.label}</span>
            <div
              className={`relative w-11 h-6 rounded-full cursor-pointer transition-all duration-300 ${
                toggle.value
                  ? "bg-gradient-to-r from-blue-500 to-purple-600"
                  : "bg-white/20"
              }`}
              onClick={() => handleToggleSwitch(toggle.key)}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all duration-300 ${
                  toggle.value ? "left-5.5" : "left-0.5"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SettingsPanel;
