import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import frontGif from "../../images/front.gif";
import bgmusic from "../../images/bg_music.mp3";
import buttonclick from "../../images/button_click.mp3";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const history = useHistory();
  
  const bgMusicRef = useRef(null);
  const buttonClickRef = useRef(null);

  useEffect(() => {
    bgMusicRef.current = new Audio(bgmusic);
    buttonClickRef.current = new Audio(buttonclick);

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    };
  }, []);

  const handlePlayMusic = () => {
    if (!isMusicPlaying && bgMusicRef.current) {
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.5;
      bgMusicRef.current.play().catch((err) => {
        console.error("Audio play error:", err);
      });
      setIsMusicPlaying(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      if (buttonClickRef.current) {
        buttonClickRef.current.play().catch(console.error);
      }

      console.log("Logging in with:", { trimmedUsername });

      const response = await axios.post('http://localhost:5000/login', {
        username: trimmedUsername,
        password: trimmedPassword
      });

      console.log("Login response:", response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('levelsCompleted', response.data.user.levelsCompleted);

        history.push('/home');
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Login error response:', error.response);
        setError(error.response.data.message || 'Invalid credentials.');
      } else if (error.request) {
        console.error('Login error request:', error.request);
        setError('Server is not responding.');
      } else {
        console.error('Login error:', error.message);
        setError('Unexpected error. Try again later.');
      }
    }
  };

  // Global styles for placeholder and focus
  const globalStyles = `
    input::placeholder {
      color: #666;
      opacity: 1;
    }
    input:focus {
      border-color: #FF5722;
      box-shadow: 0 0 5px rgba(255, 87, 34, 0.3);
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={styles.outerContainer} onClick={handlePlayMusic}>
        <div style={styles.container}>
          <div style={styles.formContainer}>
            <div style={styles.box}>
              <h2 style={styles.title}>✨ Welcome Back ✨</h2>
              {error && <p style={styles.errorMessage}>⚠️ {error}</p>}
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label htmlFor="username" style={styles.label}>👤 Username:</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="Enter your username"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label htmlFor="password" style={styles.label}>🔒 Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="Enter your password"
                  />
                </div>
                <button type="submit" style={styles.button}>
                  🚪 Login
                </button>
              </form>
              <p style={styles.text}>
                Don't have an account? <Link to='/' style={styles.link}>✏️ Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  outerContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    backgroundImage: `url(${frontGif})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '450px',
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
  },
  box: {
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#FF5722',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
  },
  errorMessage: {
    color: '#e74c3c',
    fontSize: '15px',
    marginBottom: '15px',
    padding: '8px',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  inputGroup: {
    marginBottom: '20px',
    width: '100%',
  },
  label: {
    display: 'block',
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#555',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    transition: '0.3s ease',
    backgroundColor: 'rgba(255, 255, 255, 1)', // Fully opaque for clarity
    color: '#000', // Black text for visibility
    boxSizing: 'border-box',
  },
  button: {
    background: 'linear-gradient(45deg, #FF5722, #FF9800)',
    color: '#fff',
    padding: '14px 25px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: '0.3s ease',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(255, 87, 34, 0.3)',
    width: '100%',
    marginTop: '10px',
  },
  text: {
    marginTop: '20px',
    color: '#444',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  link: {
    color: '#FF5722',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: '0.2s ease',
  },
};

export default LoginPage;
