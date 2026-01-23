import React from "react";

function LandingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Aurora Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617]" />

      {/* Animated Aurora Waves */}
      <div className="absolute inset-0">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="aurora aurora-3" />
      </div>

      {/* Floating Glass Blobs */}
      <FloatingBlobs />

      {/* Noise Overlay (Premium Feel) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08]" />

      {/* Radial Light Focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(99,102,241,0.18),transparent_60%)]" />

      {/* Styles */}
      <style>{`
        .aurora {
          position: absolute;
          width: 120%;
          height: 120%;
          filter: blur(80px);
          opacity: 0.5;
          animation: auroraMove 20s linear infinite;
        }

        .aurora-1 {
          background: linear-gradient(120deg, #6366f1, #22d3ee);
          top: -30%;
          left: -20%;
          animation-duration: 22s;
        }

        .aurora-2 {
          background: linear-gradient(120deg, #a855f7, #ec4899);
          top: 10%;
          right: -30%;
          animation-duration: 26s;
        }

        .aurora-3 {
          background: linear-gradient(120deg, #14b8a6, #3b82f6);
          bottom: -40%;
          left: 10%;
          animation-duration: 30s;
        }

        @keyframes auroraMove {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(10%, -10%) rotate(180deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/* Floating Glass Blobs */
function FloatingBlobs() {
  const blobs = Array.from({ length: 6 });

  return (
    <>
      {blobs.map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-2xl border border-white/10"
          style={{
            width: `${200 + i * 40}px`,
            height: `${200 + i * 40}px`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            animation: `blobFloat ${20 + i * 6}s ease-in-out infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes blobFloat {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -40px) scale(1.1);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
      `}</style>
    </>
  );
}

export default LandingBackground;
