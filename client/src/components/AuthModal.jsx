
import { useEffect } from 'react';
import './AuthModal.css'; 


export default function AuthModal({ isOpen, onClose, onSwitch }) {

  useEffect(() => {
    const handler = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="auth-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <form
          id="login-form"
          className={onSwitch === 'login' ? '' : 'hidden'}
        >
          <h2>Log In</h2>
          <input type="email" name="email" placeholder="you@example.com" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Log In</button>
          <p className="toggle">
            Don’t have an account?{' '}
            <button type="button" onClick={() => onSwitch('register')}>
              Sign up
            </button>
          </p>
        </form>

        <form
          id="register-form"
          className={onSwitch === 'register' ? '' : 'hidden'}
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
