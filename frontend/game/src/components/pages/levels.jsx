import React, { useEffect, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import back from "../../images/front.gif";
import bgmusic from "../../images/bg_music.mp3";

function Levels() {
  const audioRef = useRef(null);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  useEffect(() => {
    audioRef.current = new Audio(bgmusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    const fetchUserProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (!token || !username) {
          console.log("Missing token or username. Redirecting to login.");
          history.push('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/getusers?username=${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = response.data[0];
        if (!userData) {
          console.error("No user data found");
          return;
        }

        const levelsCompleted = userData.levelsCompleted || 0;
        setCompletedLevels(levelsCompleted);
        setUnlockedLevel(levelsCompleted + 1);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          history.push('/login');
        }
      }
    };

    fetchUserProgress();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [history]);

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => console.error("Audio play error:", error));
    }
  };

  const handleLevelClick = (level) => {
    if (level > unlockedLevel) {
      setAlertMessage(`Complete level ${unlockedLevel} first!`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    history.push(`/l${level}`);
  };

  const getLevelStatus = (level) => {
    if (level < unlockedLevel) return 'completed';
    if (level === unlockedLevel) return 'unlocked';
    return 'locked';
  };

  const renderLevelBox = (level) => {
    const status = getLevelStatus(level);
    
    return (
      <div 
        key={level}
        onClick={() => handleLevelClick(level)} 
        style={{ position: 'relative' }}
        role="button"
        tabIndex={0}
      >
        <div className="level-box" style={{
          ...boxStyle,
          opacity: status === 'locked' ? 0.7 : 1,
          cursor: status === 'locked' ? 'not-allowed' : 'pointer',
          background: status === 'completed' 
            ? 'linear-gradient(45deg, #2ECC71, #27AE60)'
            : status === 'unlocked'
            ? 'linear-gradient(45deg, #E67E22, #F1C40F)'
            : 'linear-gradient(45deg, #7F8C8D, #E74C3C)',
          transform: status === 'completed' ? 'scale(1.05)' : 'scale(1)',
          animation: 'fadeInBox 0.5s ease-in-out',
        }}>
          Level {level}
          {status === 'locked' && <div style={lockIconStyle}>🔒</div>}
          {status === 'completed' && (
            <div style={{
              position: 'absolute',
              top: '5px',
              right: '10px',
              fontSize: '1.8rem',
              color: '#FFD700',
              filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 1))',
            }}>⭐</div>
          )}
          {status === 'unlocked' && (
            <div style={{
              position: 'absolute',
              bottom: '5px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#FFF',
              textShadow: '0 0 12px rgba(241, 196, 15, 1)',
            }}>START</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="levels-container" onClick={playMusic}>
      <style>
        {`
          @keyframes fadeInBox {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInAlert {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .level-box:hover {
            transform: scale(1.1);
          }
        `}
      </style>

      <div style={backgroundStyle} />

      {showAlert && (
        <div style={{
          ...alertStyle,
          animation: 'slideInAlert 0.3s ease-out',
        }}>
          {alertMessage}
        </div>
      )}

      <div style={contentStyle}>
        <h1 style={titleStyle}>Select Your Level</h1>
        
        <div style={{ 
          padding: '30px', 
          borderRadius: '20px',
          maxWidth: '1000px',
          width: '95%',
        }}>
          <div style={{ 
            marginBottom: '20px',
            textAlign: 'center',
            color: '#FFD700',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            textShadow: '0 0 15px rgba(255, 215, 0, 1)',
          }}>
            {completedLevels > 0 ? (
              <span>You've conquered {completedLevels} level{completedLevels !== 1 ? 's' : ''}!</span>
            ) : (
              <span>Embark on your typing adventure!</span>
            )}
          </div>

          <div style={difficultySectionStyle}>
            <h2 style={{ color: '#2ECC71', marginBottom: '15px', textShadow: '0 0 10px rgba(46, 204, 113, 1)' }}>Easy</h2>
            <div style={rowStyle}>
              {[1, 2, 3, 4].map(renderLevelBox)}
            </div>
          </div>

          <div style={difficultySectionStyle}>
            <h2 style={{ color: '#FFD700', marginBottom: '15px', textShadow: '0 0 10px rgba(255, 215, 0, 1)' }}>Medium</h2>
            <div style={rowStyle}>
              {[5, 6, 7, 8].map(renderLevelBox)}
            </div>
          </div>

          <div style={difficultySectionStyle}>
            <h2 style={{ color: '#C0392B', marginBottom: '15px', textShadow: '0 0 10px rgba(192, 57, 43, 1)' }}>Hard</h2>
            <div style={rowStyle}>
              {[9, 10].map(renderLevelBox)}
            </div>
          </div>
        </div>

        <Link to="/home" style={homeLinkStyle}>
          <div style={{
            ...homeButtonStyle,
            animation: 'pulse 2s infinite',
          }}>Back to Home</div>
        </Link>
      </div>
    </div>
  );
}

// Styles
const backgroundStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  backgroundImage: `url(${back})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const boxStyle = {
  width: '150px',
  height: '80px',
  margin: '15px',
  color: '#ffffff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.3rem',
  fontWeight: 'bold',
  borderRadius: '15px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s ease',
};

const lockIconStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '2.5rem',
  opacity: 0.9,
  color: '#FFF',
  textShadow: '0 0 15px rgba(192, 57, 43, 1)',
};

const alertStyle = {
  position: 'fixed',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#C0392B',
  color: '#FFF',
  padding: '15px 40px',
  borderRadius: '15px',
  zIndex: 100,
  fontSize: '1.2rem',
  fontWeight: 'bold',
  border: '2px solid rgba(255, 255, 255, 0.5)',
};

const contentStyle = {
  position: 'relative',
  zIndex: 1,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: `'Montserrat', sans-serif`,
  color: '#ffffff',
  padding: '30px',
  boxSizing: 'border-box',
  width: '100%',
};

const titleStyle = {
  marginBottom: '40px',
  fontSize: '3.5rem',
  fontWeight: '900',
  fontFamily: `'Montserrat', sans-serif`,
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  color: '#000000',
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '10px',
};

const difficultySectionStyle = {
  marginBottom: '40px',
  textAlign: 'center',
  padding: '20px',
  borderRadius: '15px',
  background: 'rgba(255, 255, 255, 0.05)',
};

const homeButtonStyle = {
  marginTop: '30px',
  padding: '15px 40px',
  background: '#C0392B',
  color: '#FFF',
  fontSize: '1.3rem',
  fontWeight: 'bold',
  borderRadius: '15px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '2px solid rgba(255, 255, 255, 0.4)',
};

const homeLinkStyle = {
  textDecoration: 'none',
};

export default Levels;