import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Notification.css';

const Notification = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        {message}
      </div>
      <button className="notification-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
};

export default Notification; 