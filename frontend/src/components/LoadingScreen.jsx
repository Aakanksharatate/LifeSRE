import { useEffect, useState } from "react";
import "../styles/LoadingScreen.css";

const steps = [
  "Connecting to secure email channel",
  "Analyzing subscription contracts",
  "Evaluating renewal risk",
  "Calculating savings opportunities",
  "Finalizing dashboard insights",
];

function LoadingScreen({ done }) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (done) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + 3;
      });
    }, 120);

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [done]);

  return (
    <div className="loading-wrapper">
      <div className="loading-card">
        <h1 className="loading-title">LifeSRE</h1>
        <p className="loading-subtitle">
          Securely optimizing your life infrastructure
        </p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step ${
                index <= activeStep ? "step-active" : ""
              }`}
            >
              <div className="step-indicator">
                {index < activeStep ? "✓" : ""}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;