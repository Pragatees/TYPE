import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import frontGif from "../../images/front.gif";
import bgmusic from "../../images/bg_music.mp3";
import buttonclick from "../../images/button_click.mp3";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [muted, setMuted] = useState(true);
  const history = useHistory();
  const bgMusicRef = useRef(null);
  const buttonSoundRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');

      if (!username || !token) {
        history.push('/login');
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
          setError('User not found.');
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

  // Initialize background music
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.3;
      bgMusicRef.current.loop = true;
    }
  }, []);

  // Add a style to remove scrollbars from the document
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const toggleSound = () => {
    setMuted(!muted);
    if (muted) {
      bgMusicRef.current.play().catch(e => console.log("Audio play failed:", e));
    } else {
      bgMusicRef.current.pause();
    }
  };

  const playButtonSound = () => {
    if (!muted && buttonSoundRef.current) {
      buttonSoundRef.current.currentTime = 0;
      buttonSoundRef.current.play().catch(e => console.log("Button sound failed:", e));
    }
  };

  const handleLogout = () => {
    playButtonSound();
    localStorage.clear();
    history.push('/login');
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.bgContainer}></div>
        <div style={styles.overlay}></div>
        <div style={styles.contentContainer}>
          <div style={styles.error}>
            <div style={styles.errorIcon}>❌</div>
            <div>{error}</div>
          </div>
          <button 
            onClick={handleLogout} 
            style={styles.logoutButton}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🔁 Go to Login
          </button>
        </div>
        <audio ref={bgMusicRef} src={bgmusic} />
        <audio ref={buttonSoundRef} src={buttonclick} />
        <SoundToggle muted={muted} toggleSound={toggleSound} />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.bgContainer}></div>
        <div style={styles.overlay}></div>
        <div style={styles.loadingContent}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loading}>⏳ Loading your profile...</div>
        </div>
        <audio ref={bgMusicRef} src={bgmusic} />
        <audio ref={buttonSoundRef} src={buttonclick} />
        <SoundToggle muted={muted} toggleSound={toggleSound} />
      </div>
    );
  }

  const levelEmoji = () => {
    const level = user.levelsCompleted ?? 0;
    if (level === 0) return '🌱';
    if (level < 3) return '🌿';
    if (level < 5) return '🌲';
    if (level < 8) return '🏆';
    return '👑';
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgContainer}></div>
      <div style={styles.overlay}></div>
      {showConfetti && <Confetti />}
      
      <div style={styles.contentContainer}>
        <h1 style={styles.title}>
          <span style={styles.titleEmoji}>👤</span> 
          Welcome, {user.username}!
        </h1>
        
        <div style={styles.card}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
          </div>
          
          <div style={styles.userInfo}>
            <p style={styles.infoRow}>
              <span style={styles.infoIcon}>👤</span>
              <span style={styles.infoLabel}>Username:</span> 
              <span style={styles.infoValue}>{user.username}</span>
            </p>
            
            <p style={styles.infoRow}>
              <span style={styles.infoIcon}>📧</span>
              <span style={styles.infoLabel}>Email:</span> 
              <span style={styles.infoValue}>{user.email}</span>
            </p>
            
            <p style={styles.infoRow}>
              <span style={styles.infoIcon}>{levelEmoji()}</span>
              <span style={styles.infoLabel}>Level:</span> 
              <span style={styles.infoValue}>
                {user.levelsCompleted ?? 0}
                <span style={styles.levelBar}>
                  <span 
                    style={{...styles.levelProgress, width: `${Math.min(100, ((user.levelsCompleted ?? 0) / 10) * 100)}%`}}
                  ></span>
                </span>
              </span>
            </p>
          </div>
        </div>
        
        <div style={styles.buttonContainer}>
          <button 
            onClick={() => {
              playButtonSound();
              history.push('/dashboard');
            }} 
            style={{...styles.actionButton, backgroundColor: '#4CAF50'}}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🎮 Play Game
          </button>
          
          <button 
            onClick={handleLogout} 
            style={styles.logoutButton}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🚪 Logout
          </button>
        </div>
      </div>
      
      <audio ref={bgMusicRef} src={bgmusic} />
      <audio ref={buttonSoundRef} src={buttonclick} />
      <SoundToggle muted={muted} toggleSound={toggleSound} />
    </div>
  );
};

const SoundToggle = ({ muted, toggleSound }) => (
  <button 
    onClick={toggleSound} 
    style={styles.soundToggle}
    title={muted ? "Unmute sounds" : "Mute sounds"}
  >
    {muted ? '🔇' : '🔊'}
  </button>
);

const Confetti = () => {
  const colors = ['#FF5722', '#4CAF50', '#2196F3', '#FFEB3B', '#9C27B0'];
  
  return (
    <div style={styles.confettiContainer}>
      {Array(50).fill().map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,
          top: `-10px`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 15 + 10}px`,
          animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
          animationDelay: `${Math.random() * 2}s`,
        };
        return <div key={i} style={{...styles.confetti, ...style}} />;
      })}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  },
  bgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${frontGif})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 2,
  },
  contentContainer: {
    position: 'relative',
    zIndex: 3,
    width: '90%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
    overflowY: 'auto',
    maxHeight: '100vh',
    boxSizing: 'border-box',
  },
  loadingContent: {
    position: 'relative',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(255, 255, 255, 0.3)',
    borderTop: '5px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  title: {
    fontSize: 'clamp(24px, 5vw, 32px)',
    color: '#FFFFFF',
    marginBottom: '30px',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    padding: '0 20px',
  },
  titleEmoji: {
    fontSize: 'clamp(28px, 5vw, 40px)',
    marginRight: '10px',
    animation: 'bounce 2s infinite',
    display: 'inline-block',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
    borderRadius: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    width: '100%',
    marginBottom: '30px',
  },
  avatarContainer: {
    marginBottom: '20px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#FF5722',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '40px',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(255, 87, 34, 0.3)',
  },
  userInfo: {
    width: '100%',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    padding: '10px 0',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    fontSize: 'clamp(14px, 3vw, 18px)',
    flexWrap: 'wrap',
  },
  infoIcon: {
    marginRight: '15px',
    fontSize: '24px',
    width: '30px',
  },
  infoLabel: {
    fontWeight: 'bold',
    width: '80px',
    color: '#555',
    marginRight: '10px',
  },
  infoValue: {
    flex: 1,
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    minWidth: '150px',
  },
  levelBar: {
    marginLeft: '15px',
    height: '10px',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '5px',
    overflow: 'hidden',
    minWidth: '100px',
  },
  levelProgress: {
    height: '100%',
    backgroundColor: '#FF5722',
    borderRadius: '5px',
    transition: 'width 1s ease-in-out',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    width: '100%',
    flexWrap: 'wrap',
  },
  actionButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    minWidth: '150px',
  },
  logoutButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#FF5722',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(255, 87, 34, 0.3)',
    transition: 'all 0.3s ease',
    minWidth: '150px',
  },
  error: {
    padding: '30px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    color: '#e74c3c',
    fontWeight: 'bold',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
    marginBottom: '30px',
  },
  errorIcon: {
    fontSize: '50px',
    marginBottom: '10px',
  },
  loading: {
    fontSize: '20px',
    color: '#fff',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  soundToggle: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    fontSize: '24px',
    background: 'rgba(255, 255, 255, 0.8)',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 10,
  },
  confettiContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 4,
  },
  confetti: {
    position: 'absolute',
    borderRadius: '2px',
  },
};

export default ProfilePage;