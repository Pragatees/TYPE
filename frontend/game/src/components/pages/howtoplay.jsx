import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import bgmusic from "../../images/bg_music.mp3";
import buttonclick from "../../images/button_click.mp3";
import background from "../../images/background.jpg";

function HowToPlay() {
  const bgMusicRef = useRef(null);
  const buttonClickRef = useRef(null);
  const [buttonHover, setButtonHover] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.5;
      bgMusicRef.current.loop = true;
      bgMusicRef.current.play().catch((err) => console.log("Audio autoplay blocked", err));
    }
  }, []);

  const handleButtonClick = () => {
    if (buttonClickRef.current) {
      buttonClickRef.current.play();
    }
    setButtonActive(true);
    setTimeout(() => setButtonActive(false), 100);
  };

  return (
    <div className="container">
      <style>
        {`
          .container {
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            box-sizing: border-box;
            overflow: hidden;
            position: fixed;
            top: 0;
            left: 0;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
        `}
      </style>
      <audio ref={bgMusicRef} src={bgmusic} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `url(${background}) no-repeat center center fixed`,
          backgroundSize: "cover",
          filter: "brightness(70%)",
          zIndex: -1,
        }}
      />
      
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px",
          boxSizing: "border-box",
          overflow: "auto",
        }}
      >
        <div
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            margin: "10px 0",
            textTransform: "uppercase",
            letterSpacing: "2px",
            textAlign: "center",
            width: "100%",
            animation: "fadeIn 1.5s ease-in-out",
          }}
        >
          <h1 style={{ margin: 0 }}>How to Play</h1>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flex: 1,
            overflowY: "auto",
            padding: "10px",
          }}
        >
          <div
            style={{
              fontSize: "1rem",
              lineHeight: 1.5,
              textAlign: "left",
              padding: "15px",
              borderRadius: "10px",
              background: "rgba(0, 0, 0, 0.5)",
              animation: "fadeIn 2s ease-in-out",
            }}
          >
            <h2 style={{ margin: "0 0 10px 0", fontSize: "1.5rem" }}>Game Objective</h2>
            <p style={{ margin: 0 }}>
              In this game, you control a runner who must jump over obstacles by typing the words displayed above them. The goal is to avoid collisions and score as many points as possible before time runs out!
            </p>
          </div>

          <div
            style={{
              fontSize: "1rem",
              lineHeight: 1.5,
              textAlign: "left",
              padding: "15px",
              borderRadius: "10px",
              background: "rgba(0, 0, 0, 0.5)",
              animation: "fadeIn 2s ease-in-out",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>Game Mechanics</h3>
            <ul
              style={{
                listStyleType: "none",
                margin: "10px 0",
                paddingLeft: 0,
              }}
            >
              {[
                {
                  strong: "Jumping:",
                  text: "Press the Spacebar to make your runner jump over obstacles.",
                },
                {
                  strong: "Obstacles:",
                  text: "Obstacles appear randomly from the right and move toward the runner.",
                },
                {
                  strong: "Typing Challenge:",
                  text: "Type the word above each obstacle correctly to jump over it.",
                },
                {
                  strong: "Avoid Collisions:",
                  text: "Colliding with an obstacle ends the game.",
                },
                {
                  strong: "Timer:",
                  text: "You have 30 seconds to score as many points as possible!",
                },
              ].map((item, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "8px",
                    position: "relative",
                    paddingLeft: "20px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      fontSize: "1.2rem",
                      color: "#ff6600",
                    }}
                  >
                    •
                  </span>
                  <strong>{item.strong}</strong> {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              fontSize: "1rem",
              lineHeight: 1.5,
              textAlign: "left",
              padding: "15px",
              borderRadius: "10px",
              background: "rgba(0, 0, 0, 0.5)",
              animation: "fadeIn 2s ease-in-out",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>Tips for Success</h3>
            <ul
              style={{
                listStyleType: "none",
                margin: "10px 0",
                paddingLeft: 0,
              }}
            >
              {[
                {
                  strong: "Stay Calm:",
                  text: "Focus on typing accurately to avoid mistakes.",
                },
                {
                  strong: "Be Quick:",
                  text: "Fast typing helps you clear obstacles efficiently.",
                },
                {
                  strong: "Practice:",
                  text: "Regular play improves your typing speed and reflexes.",
                },
              ].map((item, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "8px",
                    position: "relative",
                    paddingLeft: "20px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      fontSize: "1.2rem",
                      color: "#ff6600",
                    }}
                  >
                    •
                  </span>
                  <strong>{item.strong}</strong> {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ margin: "20px 0" }}>
          <audio ref={buttonClickRef} src={buttonclick} />
          <Link
            to="/home"
            style={{
              padding: "12px 30px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "white",
              backgroundColor: buttonHover ? "#e65c00" : "#ff6600",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              textDecoration: "none",
              display: "inline-block",
              transform: buttonHover ? "scale(1.1)" : buttonActive ? "scale(0.95)" : "scale(1)",
            }}
            onClick={handleButtonClick}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HowToPlay;