import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './AuthModal.css'; 

export default function AuthModal({ isOpen, onClose, onSwitch, onAuthSuccess }) {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const loginFormRef = useRef(null);
  const registerFormRef = useRef(null);

  useEffect(() => {
    const handler = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const clearForm = (formRef) => {
    if (formRef && formRef.current) {
      formRef.current.reset();
    }
  };

  const handleSubmit = async (e, isLogin) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (isLogin && response.status === 400) {
          setError('Incorrect email or password. Please try again.');
        } else {
          setError(data.error || 'Something went wrong');
        }
        return;
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        clearForm(loginFormRef);
        onClose();
        // Show success notification
        onAuthSuccess(`Welcome back! You've successfully logged in.`);
      } else {
        // Show success message for registration
        setSuccessMessage(data.message || 'Account created successfully! You can now log in.');
        // Clear the registration form
        clearForm(registerFormRef);
        // Switch to login form after a short delay
        setTimeout(() => {
          onSwitch('login');
        }, 2000);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  // Clear forms when switching between login and register
  useEffect(() => {
    if (isOpen) {
      clearForm(loginFormRef);
      clearForm(registerFormRef);
    }
  }, [isOpen, onSwitch]);

  if (!isOpen) return null;

  return (
    <div className="auth-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <form
          ref={loginFormRef}
          id="login-form"
          className={onSwitch === 'login' ? '' : 'hidden'}
          onSubmit={(e) => handleSubmit(e, true)}
        >
          <h2>Log In</h2>
          <input type="email" name="email" placeholder="you@example.com" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Log In</button>
          <p className="toggle">
            Dont have an account?{' '}
            <button type="button" onClick={() => onSwitch('register')}>
              Sign up
            </button>
          </p>
        </form>

        <form
          ref={registerFormRef}
          id="register-form"
          className={onSwitch === 'register' ? '' : 'hidden'}
          onSubmit={(e) => handleSubmit(e, false)}
        >
          <h2>Sign Up</h2>
          <input type="email" name="email" placeholder="you@example.com" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Register</button>
          <p className="toggle">
            Already have an account?{' '}
            <button type="button" onClick={() => onSwitch('login')}>
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSwitch: PropTypes.func.isRequired,
  onAuthSuccess: PropTypes.func.isRequired
};
