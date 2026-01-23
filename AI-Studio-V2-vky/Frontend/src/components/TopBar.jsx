import React from "react";

const TopBar = ({
  title = "NEXUS AI",
  showBorder = true,
  height = "h-16",
}) => {
  return (
    <div
      className={`
        ${height}
        w-full
        flex items-center
        justify-between
        px-6
        bg-slate-900/80
        backdrop-blur-md
        ${showBorder ? "border-b border-slate-700" : ""}
      `}
    >
      {/* Logo + Title (ALWAYS LEFT) */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
          N
        </div>
        <span className="text-white font-semibold tracking-wide">
          {title}
        </span>
      </div>

      {/* Right side (empty for now, future-proof) */}
      <div />
    </div>
  );
};

export default TopBar;
