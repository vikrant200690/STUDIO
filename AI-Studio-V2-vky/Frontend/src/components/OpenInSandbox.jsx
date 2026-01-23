// components/OpenInSandbox.jsx
import React, { useState } from "react";
import { ExternalLink, Play, Zap } from "lucide-react";

const OpenInSandbox = ({ github }) => {
  const [isHovered, setIsHovered] = useState(false);

  const openInSandbox = () => {
    if (!github) {
      console.log("github link not found");
      return;
    }

    const repoPath = github
      .replace("https://github.com/", "")
      .replace(".git", "")
      .trim();

    if (!repoPath.includes("/")) return;

    const sandboxUrl = `https://codesandbox.io/s/github/${repoPath}`;
    window.open(sandboxUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={openInSandbox}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full py-3 px-4 rounded-xl text-sm font-semibold
        bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20
        hover:from-amber-500 hover:via-orange-500 hover:to-yellow-500
        border-2 border-amber-500/30 hover:border-amber-400
        text-amber-200 hover:text-white
        flex items-center justify-center gap-2.5
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/40
        active:scale-[0.98]
        overflow-hidden"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/30 to-amber-400/0 
        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      {/* Sparkle effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-1 right-4 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-3 right-8 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-75" />
        <div className="absolute bottom-2 left-6 w-1 h-1 bg-amber-300 rounded-full animate-ping delay-150" />
      </div>

      {/* Icon with animation */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="relative">
          <Play 
            className={`w-4 h-4 transition-all duration-300 ${
              isHovered ? 'rotate-0 scale-110' : 'rotate-0'
            }`} 
            fill="currentColor"
          />
          {isHovered && (
            <Zap 
              className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" 
              fill="currentColor"
            />
          )}
        </div>
        
        <span className="relative z-10 tracking-wide">
          Open in Browser
        </span>
        
        <ExternalLink 
          className={`w-4 h-4 transition-all duration-300 ${
            isHovered ? 'translate-x-1 -translate-y-1' : 'translate-x-0'
          }`} 
        />
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
        -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
    </button>
  );
};

export default OpenInSandbox;