import { useEffect, useState } from 'react';
import './AuthModal.css'; 

export default function AuthModal({ isOpen, onClose, onSwitch }) {
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e, isLogin) => {
    e.preventDefault();
    setError('');
    
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
        onClose();
      } else {
        onSwitch('login');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        {error && <div className="error-message">{error}</div>}
        
        <form
          id="login-form"
          className={onSwitch === 'login' ? '' : 'hidden'}
          onSubmit={(e) => handleSubmit(e, true)}
        >
          <h2>Log In</h2>
          <input type="email" name="email" placeholder="you@example.com" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Log In</button>
          <p className="toggle">
            Don't have an account?{' '}
            <button type="button" onClick={() => onSwitch('register')}>
              Sign up
            </button>
          </p>
        </form>

        <form
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
