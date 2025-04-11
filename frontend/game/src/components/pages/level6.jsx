import React, { useState, useEffect, useRef } from "react";
import "../../App.css";
import back from "../../images/bg_litegreen.mp4";
import obstacle1 from "../../images/Obstacle_1.png";
import obstacle2 from "../../images/Obstacle_2.png";
import obstacle3 from "../../images/Obstacle_3.png";
import obstacle4 from "../../images/Obstacle_4.png";
import obstacle5 from "../../images/Obstacle_5.png";
import user from "../../images/boy-running.gif";
import jumpSound from "../../images/jumop.mp3";
import bgmusic from "../../images/bg_music.mp3";

const obstacles = [obstacle1, obstacle2, obstacle3, obstacle4, obstacle5];

const level6Words = [
  // 4-letter words
  "blue", "coat", "dive", "find", "glow", 
  "help", "jump", "kiss",
  // 5-letter words
  "brave", "clean", "dream", "flash", "guard",
  "happy", "light"
];

function Level6Game() {
  const [obstacleList, setObstacleList] = useState([]);
  const [runnerPosition, setRunnerPosition] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [typedWord, setTypedWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState("");
  const [jumping, setJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [collisionAnimation, setCollisionAnimation] = useState(false);
  const [allWordsCompleted, setAllWordsCompleted] = useState(false);
  const [levelUpdated, setLevelUpdated] = useState(false);
  const [processedWords] = useState(new Set());
  const [obstacleSpeed, setObstacleSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const runnerRef = useRef(null);
  const audioRef = useRef(null);
  const bgMusicRef = useRef(null);

  const calculateProgress = () => {
    return `${wordsCompleted}/${level6Words.length} words`;
  };

  const updateLevelInDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/level-up', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update level');
      }

      const data = await response.json();
      setLevelUpdated(true);
      return data;
    } catch (err) {
      console.error("Error updating level:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allWordsCompleted && !levelUpdated) {
      updateLevelInDatabase();
    }
  }, [allWordsCompleted, levelUpdated]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !allWordsCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        setObstacleSpeed(prev => Math.min(prev + 0.01, 2.0));
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 || allWordsCompleted) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver, allWordsCompleted]);

  useEffect(() => {
    if (gameOver || allWordsCompleted) {
      if (videoRef.current) videoRef.current.pause();
      if (runnerRef.current) runnerRef.current.style.display = "none";
      if (bgMusicRef.current) bgMusicRef.current.pause();
      return;
    }

    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.3;
      bgMusicRef.current.play();
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= level6Words.length) {
        setAllWordsCompleted(true);
        clearInterval(interval);
        return;
      }

      const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
      const newWord = level6Words[currentIndex];
      setCurrentWord(newWord);

      const newObstacle = {
        image: randomObstacle,
        word: newWord,
        position: {
          bottom: "12%",
          left: "100%",
        },
      };
      setObstacleList((prevObstacles) => [...prevObstacles, newObstacle]);
      currentIndex++;
    }, 2000);

    return () => clearInterval(interval);
  }, [gameOver, allWordsCompleted]);

  useEffect(() => {
    const moveObstacles = setInterval(() => {
      setObstacleList((prevObstacles) => {
        return prevObstacles.map((obstacle) => {
          const newLeft = parseFloat(obstacle.position.left) - obstacleSpeed;
          
          if (
            newLeft < 15 && 
            newLeft > 0 && 
            obstacle.word.trim().toLowerCase() === typedWord.trim().toLowerCase() &&
            !processedWords.has(obstacle.word)
          ) {
            processedWords.add(obstacle.word);
            handleWordMatch();
            return null;
          }

          if (newLeft < 15 && newLeft > 0 && runnerPosition <= 15) {
            const isWordMatched = typedWord.trim().toLowerCase() === obstacle.word.trim().toLowerCase();
            if (!isWordMatched) {
              setCollisionAnimation(true);
              setTimeout(() => {
                setCollisionAnimation(false);
                setGameOver(true);
              }, 500);
              return null;
            }
          }

          if (newLeft <= -20) {
            return null;
          }

          return {
            ...obstacle,
            position: {
              ...obstacle.position,
              left: `${newLeft}%`,
            },
          };
        }).filter(Boolean);
      });
    }, 30);

    return () => clearInterval(moveObstacles);
  }, [typedWord, gameOver, runnerPosition, obstacleSpeed]);
  
  useEffect(() => {
    if (jumping) {
      setRunnerPosition(40);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0.2;
        audioRef.current.play();
      }
    } else {
      setRunnerPosition(10);
    }
  }, [jumping]);

  const handleWordMatch = () => {
    setJumping(true);
    const basePoints = 10;
    setScore(prevScore => prevScore + basePoints);
    setWordsCompleted(prev => prev + 1);
    setTimeout(() => setJumping(false), 500);
    setTypedWord("");

    if (wordsCompleted + 1 === level6Words.length) {
      setAllWordsCompleted(true);
    }
  };

  const handleInputChange = (event) => {
    setTypedWord(event.target.value);
  };

  const restartGame = () => {
    setObstacleList([]);
    setRunnerPosition(10);
    setGameOver(false);
    setTypedWord("");
    setTimeLeft(60);
    setCurrentWord("");
    setJumping(false);
    setScore(0);
    setWordsCompleted(0);
    setCollisionAnimation(false);
    setAllWordsCompleted(false);
    setLevelUpdated(false);
    setObstacleSpeed(1.0);
    setError(null);
    processedWords.clear();

    if (videoRef.current) videoRef.current.play();
    if (runnerRef.current) runnerRef.current.style.display = "block";
    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play();
    }
  };

  return (
    <div className="App" style={{ 
      backgroundColor: "black", 
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      position: "fixed",
      top: 0,
      left: 0
    }}>
      <div className="game-container" style={{
        position: "relative",
        height: "100%",
        width: "100%",
        margin: 0,
        padding: 0,
        overflow: "hidden"
      }}>
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source src={back} type="video/mp4" />
        </video>

        {/* Level Heading */}
        <div style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#4CAF50",
          fontSize: "clamp(16px, 4vw, 24px)",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          background: "rgba(0,0,0,0.7)",
          padding: "8px 16px",
          borderRadius: "8px",
          zIndex: 1
        }}>
          Level 6 - Legendary
        </div>

        {/* Progress Display */}
        <div style={{
          position: "absolute",
          top: "60px",
          right: "10px",
          color: "white",
          fontSize: "clamp(12px, 3vw, 18px)",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.7)",
          padding: "8px",
          borderRadius: "8px",
          zIndex: 1
        }}>
          Progress: {calculateProgress()}
        </div>

        {/* Timer Display */}
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: timeLeft <= 20 ? "#ff4444" : "white",
          fontSize: "clamp(14px, 3.5vw, 20px)",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.7)",
          padding: "8px",
          borderRadius: "8px",
          zIndex: 1
        }}>
          Time: {timeLeft}s
        </div>

        {/* Score Display */}
        <div style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          color: "white",
          fontSize: "clamp(14px, 3.5vw, 20px)",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.7)",
          padding: "8px",
          borderRadius: "8px",
          zIndex: 1
        }}>
          Score: {score}
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.9)",
            padding: "20px",
            borderRadius: "15px",
            color: "white",
            textAlign: "center",
            zIndex: 2,
            width: "90%",
            maxWidth: "500px"
          }}>
            <h2 style={{ color: allWordsCompleted ? "#4CAF50" : "#ff4444" }}>
              {allWordsCompleted ? "Level Complete!" : "Game Over!"}
            </h2>
            <p>Final Score: {score}</p>
            <p>Words Completed: {wordsCompleted}/{level6Words.length}</p>
            
            {loading && <p>Saving your progress...</p>}
            {error && <p style={{ color: "#ff4444" }}>Error: {error}</p>}
            
            {allWordsCompleted && (
              <p style={{ color: "#FF9800" }}>
                {levelUpdated ? "Progress saved successfully!" : "Saving progress..."}
              </p>
            )}
            
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              gap: "10px", 
              marginTop: "20px",
              alignItems: "center"
            }}>
              <button
                onClick={restartGame}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(to right, rgb(30, 255, 0), rgb(41, 77, 0))",
                  border: "none",
                  borderRadius: "5px",
                  color: "white",
                  cursor: "pointer",
                  width: "100%",
                  maxWidth: "200px"
                }}
              >
                {allWordsCompleted ? "Play Again" : "Try Again"}
              </button>
              
              {allWordsCompleted && (
                <button
                  onClick={() => window.location.href = "/l7"}
                  style={{
                    padding: "10px 20px",
                    background: "linear-gradient(to right, #2196F3, #1976D2)",
                    border: "none",
                    borderRadius: "5px",
                    color: "white",
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: "200px"
                  }}
                >
                  Next Level
                </button>
              )}
              
              <button
                onClick={() => window.location.href = "/levels"}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(to right, #9C27B0, #673AB7)",
                  border: "none",
                  borderRadius: "5px",
                  color: "white",
                  cursor: "pointer",
                  width: "100%",
                  maxWidth: "200px"
                }}
              >
                Levels Page
              </button>
              
              <button
                onClick={() => window.location.href = "/home"}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(to left, #ff9800, rgb(90, 49, 7))",
                  border: "none",
                  borderRadius: "5px",
                  color: "white",
                  cursor: "pointer",
                  width: "100%",
                  maxWidth: "200px"
                }}
              >
                Main Menu
              </button>
            </div>
          </div>
        )}

        {/* Word Display */}
        <div className="word-display" style={{
          position: "absolute",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "clamp(16px, 4vw, 24px)",
          color: "white",
          textAlign: "center",
          zIndex: 1,
          width: "90%"
        }}>
          <span style={{
            display: "inline-block",
            padding: "5px 15px",
            background: "linear-gradient(to right, #4CAF50, #45a049)",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(76, 175, 80, 0.8)",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
          }}>
            {currentWord.toUpperCase()}
          </span>
        </div>

        {/* Input Box */}
        <input
          type="text"
          value={typedWord}
          onChange={handleInputChange}
          placeholder="Type the word..."
          style={{
            position: "absolute",
            top: "120px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px",
            fontSize: "clamp(14px, 3.5vw, 18px)",
            borderRadius: "5px",
            border: "2px solid #4CAF50",
            background: "rgba(255, 255, 255, 0.9)",
            color: "black",
            width: "80%",
            maxWidth: "300px",
            textAlign: "center",
            zIndex: 1
          }}
          disabled={gameOver}
          autoFocus
        />

        {/* Obstacles */}
        {obstacleList.map((obstacle, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              bottom: obstacle.position.bottom,
              left: obstacle.position.left,
              transition: "left 0.03s linear",
              zIndex: 1
            }}
          >
            <div style={{
              textAlign: "center",
              color: "white",
              fontSize: "clamp(14px, 3.5vw, 20px)",
              fontWeight: "bold",
              marginBottom: "120px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.7)"
            }}>
              {obstacle.word.toUpperCase()}
            </div>
            <img
              src={obstacle.image}
              alt="obstacle"
              style={{
                width: "clamp(50px, 15vw, 80px)",
                height: "clamp(75px, 22vw, 120px)",
                position: "absolute",
                bottom: `${(runnerPosition / 10) - 40}px`,
              }}
            />
          </div>
        ))}

        {/* Runner */}
        <div
          ref={runnerRef}
          style={{
            position: "absolute",
            bottom: `${runnerPosition}%`,
            left: "10%",
            transition: "bottom 0.3s",
            animation: collisionAnimation ? "shake 0.1s" : "none",
            zIndex: 1
          }}
        >
          <img
            src={user}
            alt="runner"
            style={{
              width: "clamp(60px, 20vw, 100px)",
              height: "clamp(105px, 35vw, 175px)"
            }}
          />
        </div>

        {/* Audio Elements */}
        <audio ref={audioRef} src={jumpSound} preload="auto"></audio>
        <audio ref={bgMusicRef} src={bgmusic} loop preload="auto"></audio>

        {/* CSS Styles */}
        <style>
          {`
            @keyframes shake {
              0% { transform: translateX(0); }
              25% { transform: translateX(-10px); }
              50% { transform: translateX(10px); }
              75% { transform: translateX(-10px); }
              100% { transform: translateX(0); }
            }

            input:focus {
              outline: none;
              box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            }

            button {
              transition: transform 0.1s, opacity 0.2s;
            }

            button:active {
              transform: scale(0.95);
            }

            button:hover {
              opacity: 0.9;
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default Level6Game;