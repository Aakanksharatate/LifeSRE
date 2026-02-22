import { useEffect, useState } from "react";
import "../styles/LoadingScreen.css";

function LoadingScreen({ done }) {
  const [loadedBoxes, setLoadedBoxes] = useState(0);
  const totalBoxes = 5;

  // Animate boxes loading
  useEffect(() => {
    if (done) return;

    const interval = setInterval(() => {
      setLoadedBoxes((prev) => {
        if (prev < totalBoxes) return prev + 1;
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [done]);

  return (
    <div className="loading-container">
      <h2 className="loading-title">
        Optimizing Your Life Infrastructure...
      </h2>

      <div className={`truck-wrapper ${done ? "drive-away" : ""}`}>
        <div className="truck">
          🚚
        </div>

        <div className="boxes">
          {[...Array(totalBoxes)].map((_, i) => (
            <div
              key={i}
              className={`box ${i < loadedBoxes ? "box-loaded" : ""}`}
            >
              📦
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;