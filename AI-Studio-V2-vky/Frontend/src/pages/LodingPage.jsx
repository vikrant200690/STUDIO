import React from "react";
const LoadingPage = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-white/60">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
