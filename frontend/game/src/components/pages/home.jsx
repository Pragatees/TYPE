import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import frontGif from "../../images/front.gif";
import bgmusic from "../../images/newbg.mp3";
import buttonclick from "../../images/button_click.mp3";

const Home = () => {
  const bgMusicRef = useRef(null);
  const buttonClickSoundRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchUser = async () => {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");

      if (!username || !token) {
        history.push("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/getusers?username=${encodeURIComponent(username)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = Array.isArray(response.data) ? response.data[0] : null;

        if (!userData) {
          setError("User not found.");
        } else {
          setUser(userData);
          setTimeout(() => setShowConfetti(true), 500);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        setError(err.response?.data?.message || "Unable to fetch user");
      }
    };

    fetchUser();
  }, [history]);

  useEffect(() => {
    bgMusicRef.current = new Audio(bgmusic);
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.5;
    bgMusicRef.current.play().catch((error) =>
      console.log("Autoplay blocked: ", error)
    );

    buttonClickSoundRef.current = new Audio(buttonclick);

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const handleButtonClick = () => {
    if (buttonClickSoundRef.current) {
      buttonClickSoundRef.current.currentTime = 0;
      buttonClickSoundRef.current.play();
    }
  };

  const toggleMute = () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = !bgMusicRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    history.push("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (buttonClickSoundRef.current) {
      buttonClickSoundRef.current.currentTime = 0;
      buttonClickSoundRef.current.play();
    }
  };

  const getRandomColor = (username) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const r = (hash & 0xff0000) >> 16;
    const g = (hash & 0x00ff00) >> 8;
    const b = hash & 0x0000ff;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const styles = {
    fullContainer: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      margin: 0,
      padding: 0,
    },
    homeContainer: {
      width: "100%",
      height: "100%",
      position: "relative",
      display: "flex",
    },
    backgroundGif: {
      position: "absolute",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 1,
    },
    sidebar: {
      width: sidebarOpen ? "300px" : "0",
      height: "100%",
      background: "linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(50, 50, 50, 0.9))",
      color: "white",
      padding: sidebarOpen ? "30px" : "0",
      boxSizing: "border-box",
      zIndex: 3,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      borderRadius: "0 15px 15px 0",
      boxShadow: sidebarOpen ? "5px 0 15px rgba(0, 0, 0, 0.5)" : "none",
      transition: "all 0.3s ease",
      overflow: "hidden",
      position: "relative",
    },
    sidebarToggle: {
      position: "absolute",
      top: "20px",
      left: sidebarOpen ? "calc(300px - 40px)" : "10px",
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      background: user ? getRandomColor(user.username) : "linear-gradient(45deg, #6a11cb, #2575fc)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      zIndex: 4,
      border: "none",
      color: "white",
      fontSize: "1.5rem",
      fontWeight: "bold",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
      transition: "all 0.3s ease",
      textAlign: "center", // Added to ensure text centering
      lineHeight: "60px", // Added to vertically center the text
    },
    userInitial: {
      // Added specific style for the user initial text
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      fontSize: "1.5rem",
    },
    sidebarContent: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      marginTop: "20px",
    },
    sidebarItem: {
      fontSize: "1.1rem",
      padding: "12px",
      width: "100%",
      transition: "all 0.3s ease",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.05)",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    sidebarItemHover: {
      background: "rgba(255, 255, 255, 0.15)",
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    },
    itemIcon: {
      fontSize: "1.3rem",
      marginRight: "5px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
    },
    logoutButton: {
      padding: "0.8rem 1.5rem",
      fontSize: "1.2rem",
      background: "linear-gradient(45deg, #ff4d4d, #ff1a1a)",
      color: "white",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "auto",
      width: "80%",
      boxShadow: "0 4px 10px rgba(255, 0, 0, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      textShadow: "0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 0, 0, 0.5)",
      letterSpacing: "1px",
    },
    logoutButtonHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 7px 20px rgba(255, 0, 0, 0.5)",
      background: "linear-gradient(45deg, #ff1a1a, #ff4d4d)",
    },
    mainContent: {
      flex: 1,
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      zIndex: 2,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      color: "white",
      textAlign: "center",
      padding: "2rem",
      boxSizing: "border-box",
    },
    topSection: {
      marginBottom: "2rem",
      width: "100%",
      maxWidth: "800px",
    },
    title: {
      fontSize: "clamp(2rem, 5vw, 3.5rem)",
      marginBottom: "1rem",
      textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
      color: "#fff",
      animation: "glow 2s ease-in-out infinite alternate",
    },
    titleEmoji: {
      fontSize: "clamp(1.8rem, 4.5vw, 3rem)",
      verticalAlign: "middle",
      display: "inline-block",
      margin: "0 0.5rem",
      animation: "bounce 2s ease infinite",
    },
    subtitle: {
      fontSize: "clamp(1rem, 2vw, 1.5rem)",
      color: "#f0f0f0",
      marginBottom: "2rem",
    },
    buttonGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      width: "100%",
      maxWidth: "400px",
      margin: "0 auto",
    },
    linkStyle: {
      width: "100%",
      textDecoration: "none",
    },
    animatedButton: {
      padding: "0.8rem 1.5rem",
      fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
      background: "linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)",
      color: "white",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "60px",
    },
    buttonEmoji: {
      marginRight: "10px",
      fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
    },
    footerText: {
      marginTop: "3rem",
      fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
      color: "#cccccc",
      fontStyle: "italic",
    },
    controls: {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 3,
    },
    soundControl: {
      background: "rgba(0, 0, 0, 0.5)",
      border: "none",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      fontSize: "1.5rem",
      color: "white",
      transition: "all 0.3s ease",
    },
    divider: {
      width: "80%",
      height: "1px",
      background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)",
      margin: "15px 0",
    },
    userInfoContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "15px",
      width: "100%",
    },
  };

  return (
    <div style={styles.fullContainer}>
      <div style={styles.homeContainer}>
        <img src={frontGif} alt="Typing Adventure Front" style={styles.backgroundGif} />
        
        {/* Sidebar Toggle Button with User Initial - Now with better centering */}
        <button 
          style={styles.sidebarToggle}
          onClick={toggleSidebar}
          onMouseEnter={() => setHoveredButton("sidebarToggle")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <div style={styles.userInitial}>
            {user ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
        </button>
        
        <div style={styles.sidebar}>
          {user && sidebarOpen && (
            <>
              <div style={styles.userInfoContainer}>
                <div
                  style={{
                    ...styles.sidebarItem,
                    ...(hoveredButton === "username" ? styles.sidebarItemHover : {}),
                  }}
                  onMouseEnter={() => setHoveredButton("username")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <span style={styles.itemIcon}>👤</span>
                  <div>Username: {user.username}</div>
                </div>
                <div
                  style={{
                    ...styles.sidebarItem,
                    ...(hoveredButton === "email" ? styles.sidebarItemHover : {}),
                  }}
                  onMouseEnter={() => setHoveredButton("email")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <span style={styles.itemIcon}>✉️</span>
                  <div>Email: {user.email}</div>
                </div>
                <div
                  style={{
                    ...styles.sidebarItem,
                    ...(hoveredButton === "levels" ? styles.sidebarItemHover : {}),
                  }}
                  onMouseEnter={() => setHoveredButton("levels")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <span style={styles.itemIcon}>🏆</span>
                  <div>Levels Completed: {user.levelsCompleted || 0}</div>
                </div>
              </div>
              
              <div style={styles.divider} />
              
              <button
                style={{
                  ...styles.logoutButton,
                  ...(hoveredButton === "logout" ? styles.logoutButtonHover : {}),
                }}
                onClick={handleLogout}
                onMouseEnter={() => setHoveredButton("logout")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span style={{ fontSize: "1.2rem" }}>🚪</span>
                Logout
              </button>
            </>
          )}
          {error && sidebarOpen && <div style={styles.sidebarItem}>{error}</div>}
          {!user && sidebarOpen && (
            <div style={styles.sidebarItem}>
              <span style={styles.itemIcon}>⌛</span>
              Loading...
            </div>
          )}
        </div>

        <div style={styles.mainContent}>
          <div style={styles.overlay}>
            <div style={styles.topSection}>
              <h1 style={styles.title}>
                <span style={styles.titleEmoji}>⌨️</span> Typing Adventure Game{" "}
                <span style={styles.titleEmoji}>🎮</span>
              </h1>
              <p style={styles.subtitle}>Master your typing skills in an epic adventure!</p>
            </div>

            <div style={styles.buttonGroup}>
              <Link to="/levels" style={styles.linkStyle}>
                <button
                  style={{
                    ...styles.animatedButton,
                    ...(hoveredButton === "start"
                      ? {
                          transform: "translateY(-5px)",
                          boxShadow: "0 7px 20px rgba(0, 0, 0, 0.3)",
                          background: "linear-gradient(45deg, #2575fc 0%, #6a11cb 100%)",
                        }
                      : {}),
                  }}
                  onClick={handleButtonClick}
                  onMouseEnter={() => setHoveredButton("start")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <span style={styles.buttonEmoji}>🚀</span> Start Game
                </button>
              </Link>
              <Link to="/hp" style={styles.linkStyle}>
                <button
                  style={{
                    ...styles.animatedButton,
                    ...(hoveredButton === "howto"
                      ? {
                          transform: "translateY(-5px)",
                          boxShadow: "0 7px 20px rgba(0, 0, 0, 0.3)",
                          background: "linear-gradient(45deg, #2575fc 0%, #6a11cb 100%)",
                        }
                      : {}),
                  }}
                  onClick={handleButtonClick}
                  onMouseEnter={() => setHoveredButton("howto")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <span style={styles.buttonEmoji}>📖</span> How to Play
                </button>
              </Link>
              <Link to="/rules" style={styles.linkStyle}>
                <button
                  style={{
                    ...styles.animatedButton,
                    ...(hoveredButton === "rules"
                      ? {
                          transform: "translateY(-5px)",
                          boxShadow: "0 7px 20px rgba(0, 0, 0, 0.3)",
                          background: "linear-gradient(45deg, #2575fc 0%, #6a11cb 100%)",
                        }
                      : {}),
                  }}
                  onClick={handleButtonClick}
                  onMouseEnter={() => setHoveredButton("rules")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <span style={styles.buttonEmoji}>📜</span> Rules
                </button>
              </Link>
              <button
                style={{
                  ...styles.animatedButton,
                  ...(hoveredButton === "quit"
                    ? {
                        transform: "translateY(-5px)",
                        boxShadow: "0 7px 20px rgba(0, 0, 0, 0.3)",
                        background: "linear-gradient(45deg, #2575fc 0%, #6a11cb 100%)",
                      }
                    : {}),
                }}
                onClick={() => window.close()}
                onMouseEnter={() => setHoveredButton("quit")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span style={styles.buttonEmoji}>🚪</span> Quit Game
              </button>
            </div>

            <div style={styles.footerText}>
              <p>Embark on your typing journey and become a keyboard master!</p>
            </div>
          </div>
        </div>

        <div style={styles.controls}>
          <button
            style={{
              ...styles.soundControl,
              ...(hoveredButton === "sound"
                ? {
                    background: "rgba(0, 0, 0, 0.8)",
                    transform: "scale(1.1)",
                  }
                : {}),
            }}
            onClick={toggleMute}
            onMouseEnter={() => setHoveredButton("sound")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
              @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
              @keyframes glow {
                from { text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
                to { text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6); }
              }
              
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
            `,
          }}
        />
      </div>
    </div>
  );
};

export default Home;