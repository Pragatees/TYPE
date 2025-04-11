import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import frontGif from "../../images/front.gif";
import bgmusic from "../../images/newbg.mp3";
import buttonclick from "../../images/button_click.mp3";

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const history = useHistory();

  const bgMusicRef = useRef(new Audio(bgmusic));
  const buttonClickRef = useRef(new Audio(buttonclick));

  // Handle music play on user interaction
  const handlePlayMusic = () => {
    if (!isMusicPlaying) {
      const bgMusic = bgMusicRef.current;
      bgMusic.loop = true;
      bgMusic.volume = 0.5;
      bgMusic.play().catch((err) => {
        console.error("Error playing audio: ", err);
      });
      setIsMusicPlaying(true);
    }
  };

  useEffect(() => {
    // Apply no-scroll styles to body and html elements
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Cleanup function to reset styles on unmount
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    buttonClickRef.current.play();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', { username, email, password });
      console.log(response.data);
      alert('Account created successfully. Please log in to continue.');
      history.push('/login');
    } catch (err) {
      console.error(err);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div style={styles.outerContainer} onClick={handlePlayMusic}>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div style={styles.box}>
            <h2 style={styles.title}>✨ Create Your Account ✨</h2>
            {error && <p style={styles.errorMessage}>⚠️ {error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label htmlFor="username" style={styles.label}>👤 Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required style={styles.input} placeholder="Enter your username" />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>📧 Email:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} placeholder="Enter your email" />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>🔒 Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} placeholder="Create a password" />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="confirmPassword" style={styles.label}>🔐 Confirm Password:</label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={styles.input} placeholder="Confirm your password" />
              </div>
              <button type="submit" style={styles.button}>
                🚀 Sign Up
              </button>
            </form>
            <p style={styles.text}>
              Already have an account? <Link to='/login' style={styles.link}>🔑 Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
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
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `url(${frontGif}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '16px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '450px',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    maxHeight: '95vh',
  },
  box: {
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#663399', // Purple instead of blue
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
    marginBottom: '15px',
    width: '100%',
  },
  label: {
    display: 'block',
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: '6px',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxSizing: 'border-box',
  },
  button: {
    background: 'linear-gradient(45deg, #663399, #9370DB)', // Purple gradient instead of blue
    color: '#fff',
    padding: '14px 25px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: '0.3s ease',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(102, 51, 153, 0.3)',
    width: '80%',
    marginTop: '10px',
  },
  text: {
    marginTop: '15px',
    color: '#444',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  link: {
    color: '#663399', // Purple instead of blue
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: '0.2s ease',
  },
};

export default SignupPage;