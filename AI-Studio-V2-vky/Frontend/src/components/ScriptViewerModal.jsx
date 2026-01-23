import React, { useEffect, useState } from "react";
import { X, Copy, Check, Maximize2, Minimize2 } from "lucide-react";

const ScriptViewerModal = ({ script, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tab, setTab] = useState("readme");

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const TierBadge = () => {
    const colors = {
      free: "bg-green-500/20 text-green-400",
      paid: "bg-blue-500/20 text-blue-400",
      best: "bg-purple-500/20 text-purple-400",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[script.tier]}`}>
        {script.tier?.toUpperCase() || "FREE"}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
      <div
        className={`bg-slate-900 border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden
        ${isFullscreen ? "w-full h-full" : "w-full max-w-7xl max-h-[90vh]"}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{script.title}</h2>
              <TierBadge />
            </div>
            <p className="text-white/60 mt-1 max-w-2xl">{script.description}</p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 bg-white/5 rounded-lg">
              {isFullscreen ? <Minimize2 /> : <Maximize2 />}
            </button>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-lg">
              <X />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT PANEL */}
          <div className="w-[360px] border-r border-white/10 p-5 space-y-5 overflow-y-auto bg-slate-950/40">
            <div>
              <h4 className="text-white/80 text-sm mb-2">Why this exists</h4>
              <p className="text-white/60 text-sm leading-relaxed">{script.why}</p>
            </div>

            <div>
              <h4 className="text-white/80 text-sm mb-2">Use cases</h4>
              <div className="flex flex-wrap gap-2">
                {script.useCases?.map((u) => (
                  <span key={u} className="px-2 py-1 bg-white/5 text-white/70 rounded text-xs">
                    {u}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white/80 text-sm mb-2">Models</h4>
              {script.models?.map((m) => (
                <div key={m} className="text-xs text-white/60">{m}</div>
              ))}
            </div>

            <div>
              <h4 className="text-white/80 text-sm mb-2">Cost</h4>
              <div className="text-sm text-white/70">{script.cost}</div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {["readme", "code", "requirements", "how to use"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-3 text-sm capitalize ${
                    tab === t ? "text-white border-b-2 border-indigo-500" : "text-white/50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-black/30">
              {tab === "readme" && (
                <pre className="text-white/80 text-sm whitespace-pre-wrap">{script.readme}</pre>
              )}

              {tab === "code" && (
                <div className="relative">
                  <button onClick={() => copy(script.code.main)} className="absolute top-2 right-2">
                    {copied ? <Check /> : <Copy />}
                  </button>
                  <pre className="text-white/80 text-sm overflow-x-auto">{script.code.main}</pre>
                </div>
              )}

              {tab === "requirements" && (
                <pre className="text-white/80 text-sm">{script.code.requirements}</pre>
              )}

              {tab === "how to use" && (
                <p className="text-white/70 text-sm">{script.usage}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptViewerModal;
