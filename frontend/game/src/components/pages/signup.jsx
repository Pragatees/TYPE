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
  // Add a new state for password strength
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: ''
  });
  
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

  // New function to check password strength
  const checkPasswordStrength = (password) => {
    // Initialize score
    let score = 0;
    
    // Check if empty
    if (password.length === 0) {
      setPasswordStrength({
        score: 0,
        message: '',
        color: ''
      });
      return;
    }
    
    // Check length
    if (password.length < 6) {
      score = 1;
    } else if (password.length < 10) {
      score += 2;
    } else {
      score += 3;
    }
    
    // Check for mixed case
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
      score += 1;
    }
    
    // Check for numbers
    if (password.match(/\d/)) {
      score += 1;
    }
    
    // Check for special characters
    if (password.match(/[^a-zA-Z\d]/)) {
      score += 1;
    }
    
    // Score interpretation
    let message = '';
    let color = '';
    
    if (score < 3) {
      message = 'Weak';
      color = '#e74c3c'; // Red
    } else if (score < 5) {
      message = 'Moderate';
      color = '#f39c12'; // Orange
    } else {
      message = 'Strong';
      color = '#27ae60'; // Green
    }
    
    setPasswordStrength({
      score,
      message,
      color
    });
  };

  // Add effect to check password strength whenever password changes
  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    buttonClickRef.current.play();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Add a minimum strength requirement if desired
    if (passwordStrength.score < 3) {
      setError("Please choose a stronger password");
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

  // Global styles for placeholder
  const globalStyles = `
    input::placeholder {
      color: #666;
      opacity: 1;
    }
    input:focus {
      border-color: #663399;
      box-shadow: 0 0 5px rgba(102, 51, 153, 0.3);
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={styles.outerContainer} onClick={handlePlayMusic}>
        <div style={styles.container}>
          <div style={styles.formContainer}>
            <div style={styles.box}>
              <h2 style={styles.title}>✨ Create Your Account ✨</h2>
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
                  <label htmlFor="email" style={styles.label}>📧 Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="Enter your email"
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
                    placeholder="Create a password"
                  />
                  {password && (
                    <div style={styles.strengthIndicator}>
                      <div style={{
                        ...styles.strengthMeter,
                        width: `${(passwordStrength.score / 6) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }}></div>
                      <span style={{color: passwordStrength.color}}>
                        {passwordStrength.message}
                      </span>
                    </div>
                  )}
                  {password && (
                    <div style={styles.passwordTips}>
                      <p>Password should contain:</p>
                      <ul style={styles.tipsList}>
                        <li style={{color: password.length >= 8 ? '#27ae60' : '#ccc'}}>
                          At least 8 characters
                        </li>
                        <li style={{color: (password.match(/[A-Z]/) && password.match(/[a-z]/)) ? '#27ae60' : '#ccc'}}>
                          Upper and lowercase letters
                        </li>
                        <li style={{color: password.match(/\d/) ? '#27ae60' : '#ccc'}}>
                          At least one number
                        </li>
                        <li style={{color: password.match(/[^a-zA-Z\d]/) ? '#27ae60' : '#ccc'}}>
                          At least one special character
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div style={styles.inputGroup}>
                  <label htmlFor="confirmPassword" style={styles.label}>🔐 Confirm Password:</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="Confirm your password"
                  />
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
    overflowY: 'auto',
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
    color: '#663399',
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
    backgroundColor: 'rgba(255, 255, 255, 1)',
    color: '#000',
    boxSizing: 'border-box',
  },
  // Add new styles for password strength meter
  strengthIndicator: {
    marginTop: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  strengthMeter: {
    height: '6px',
    borderRadius: '3px',
    width: '0%',
    transition: 'all 0.3s ease',
    marginBottom: '5px',
  },
  passwordTips: {
    marginTop: '8px',
    textAlign: 'left',
    fontSize: '14px',
    color: '#666',
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderRadius: '5px',
  },
  tipsList: {
    marginTop: '5px',
    paddingLeft: '20px',
    textAlign: 'left',
  },
  button: {
    background: 'linear-gradient(45deg, #663399, #9370DB)',
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
    color: '#663399',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: '0.2s ease',
  },
};

export default SignupPage;