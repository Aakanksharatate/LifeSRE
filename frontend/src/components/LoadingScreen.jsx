import { useEffect, useState } from "react";

const steps = [
  "Establishing secure connection...",
  "Analyzing subscription matrix...",
  "Evaluating vendor risk profiles...",
  "Running price arbitrage algorithms...",
  "Compiling dashboard UI...",
];

function LoadingScreen({ done }) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [decimals, setDecimals] = useState("00");

  useEffect(() => {
    if (done) {
      setDecimals("00");
      return;
    }
    const noiseInterval = setInterval(() => {
      setDecimals(Math.floor(Math.random() * 99).toString().padStart(2, "0"));
    }, 50);
    return () => clearInterval(noiseInterval);
  }, [done]);

  useEffect(() => {
    if (done) {
      setProgress(100);
      setActiveStep(steps.length);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.floor(Math.random() * 4) + 1;
      });
    }, 150);

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 900);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [done]);

  return (
    <>
      <style>
        {`
          /* Holographic Yoyo Scan Line */
          @keyframes scanSweep {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }

          /* Glowing Pulse for Active Step */
          @keyframes activePulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }

          /* Deep Cyberpunk Background Gradient */
          @keyframes darkGradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Buttery smooth card exit */
          @keyframes cardExit {
            0% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
            100% { opacity: 0; transform: scale(0.95) translateY(20px); filter: blur(10px); display: none; }
          }

          @keyframes textShine {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
          }

          /* Ultra-smooth center fade to top-left glide (Match Cut) */
          @keyframes heroGlideAndMove {
            0% {
              top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1.5);
              opacity: 0; filter: blur(10px); font-size: 60px;
            }
            15% {
              top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1);
              opacity: 1; filter: blur(0px); font-size: 60px;
            }
            35% {
              top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1);
              font-size: 60px;
            }
            100% {
              top: 40px; 
              left: max(24px, calc(50vw - 600px));
              transform: translate(0, 0) scale(1);
              font-size: 42px;
            }
          }

          /* Fade in the word "Dashboard" smoothly */
          @keyframes fadeDashboardIn {
            0%, 60% { opacity: 0; transform: translateX(-10px); }
            100% { opacity: 1; transform: translateX(0); }
          }
        `}
      </style>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "linear-gradient(-45deg, #020617, #0f172a, #09090b, #170f2e)",
          backgroundSize: "400% 400%",
          animation: "darkGradientBG 20s ease infinite",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          color: "#f8fafc",
          overflow: "hidden",
        }}
      >
        {/* Phase 1: The Glassmorphism Loading Deck */}
        <div
          style={{
            position: "relative",
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            padding: "48px 40px",
            borderRadius: "24px",
            width: "90%",
            maxWidth: "480px",
            boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
            overflow: "hidden",
            animation: done ? "cardExit 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards" : "none",
          }}
        >
          {/* Holographic Scan Line (Yoyo effect) */}
          <div
            style={{
              position: "absolute",
              left: 0,
              width: "100%",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #60a5fa, #c084fc, transparent)",
              boxShadow: "0 0 15px 2px rgba(96, 165, 250, 0.6)",
              animation: "scanSweep 2s ease-in-out infinite alternate",
              zIndex: 10,
              pointerEvents: "none",
            }}
          />

          <h1 style={{ margin: "0 0 4px 0", fontSize: "36px", fontWeight: "900", letterSpacing: "-1.5px", background: "linear-gradient(to right, #60a5fa, #c084fc)", WebkitBackgroundClip: "text", color: "transparent" }}>
            LifeSRE
          </h1>
          <p style={{ margin: "0 0 36px 0", color: "#94a3b8", fontSize: "14px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            System Initialization Sequence
          </p>

          <div style={{ marginBottom: "36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Overall Progress</span>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: "20px", fontWeight: "800", color: "#60a5fa", textShadow: "0 0 10px rgba(96, 165, 250, 0.5)" }}>
                {progress}.<span style={{ fontSize: "14px", color: "#94a3b8" }}>{decimals}</span>%
              </span>
            </div>
            <div style={{ height: "8px", background: "rgba(0, 0, 0, 0.5)", borderRadius: "999px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.05)", boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.5)" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #3b82f6, #8b5cf6)", borderRadius: "999px", transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "0 0 15px rgba(59, 130, 246, 0.8)", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              return (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "13px", fontWeight: isActive ? "700" : "500", color: isCompleted ? "#94a3b8" : isActive ? "#f8fafc" : "#334155", transition: "all 0.3s ease", transform: isActive ? "translateX(4px)" : "translateX(0)" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: `2px solid ${isActive ? "#60a5fa" : isCompleted ? "#3b82f6" : "#1e293b"}`, display: "flex", justifyContent: "center", alignItems: "center", fontSize: "11px", fontWeight: "900", backgroundColor: isCompleted ? "#3b82f6" : isActive ? "rgba(59, 130, 246, 0.2)" : "transparent", color: isCompleted ? "white" : "transparent", animation: isActive ? "activePulse 1.5s infinite" : "none", transition: "all 0.3s ease" }}>
                    {isCompleted ? "✓" : ""}
                  </div>
                  <span style={{ textShadow: isActive ? "0 0 10px rgba(255,255,255,0.3)" : "none" }}>{step}</span>
                  {isActive && <span style={{ marginLeft: "auto", fontSize: "11px", color: "#60a5fa", fontFamily: "monospace", animation: "blink 1s infinite" }}>[...]</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase 2: The Ultra-Smooth Match Cut Glide */}
        {done && (
          <>
            <h1
              style={{
                position: "fixed",
                margin: 0,
                fontWeight: "900",
                letterSpacing: "-1px",
                background: "linear-gradient(to right, #60a5fa, #c084fc, #60a5fa)",
                backgroundSize: "200% auto",
                color: "transparent",
                WebkitBackgroundClip: "text",
                whiteSpace: "nowrap",
                animation: "heroGlideAndMove 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards, textShine 4s linear infinite",
              }}
            >
              LifeSRE{" "}
              <span style={{ display: "inline-block", opacity: 0, animation: "fadeDashboardIn 1.8s ease-out forwards" }}>
                Dashboard
              </span>
            </h1>
            
            <p
              style={{
                position: "fixed",
                top: "92px", 
                left: "max(24px, calc(50vw - 600px))", 
                margin: 0,
                color: "#94a3b8",
                fontSize: "16px",
                letterSpacing: "0.5px",
                opacity: 0,
                animation: "fadeDashboardIn 1.8s ease-out forwards",
              }}
            >
              Command center for your life infrastructure.
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default LoadingScreen;