import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";

const ExportConversation = ({ chatHistory = [] }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const messages = chatHistory.map(item => ({
    role: item.role,
    content: item.content,
  }));

  if (messages.length === 0) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg opacity-50"
      >
        📤 Export
      </button>
    );
  }

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 6,
        left: rect.right - 140,
      });
    }
    setOpen(v => !v);
  };

  const exportConversation = async (format) => {
    setOpen(false);
     
    
        
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/export`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ format, messages }),
});
    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation.${format}`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Export button */}
      <button
        ref={btnRef}
        onClick={toggle}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg hover:bg-white/15"
      >
        📤 Export
      </button>

      {/* Dropdown rendered ABOVE everything */}
      {open &&
        createPortal(
          <div
  style={{ top: coords.top, left: coords.left }}
  className="fixed w-36 rounded-lg border border-white/20 bg-black/90 backdrop-blur text-white z-[99999] shadow-2xl"
>
  <button
    onClick={() => exportConversation("pdf")}
    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10"
  >
    PDF
  </button>
  <button
    onClick={() => exportConversation("json")}
    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10"
  >
    JSON
  </button>
  <button
    onClick={() => exportConversation("txt")}
    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10"
  >
    TXT
  </button>
</div>
,
          document.body
        )}
    </>
  );
};

export default ExportConversation;
