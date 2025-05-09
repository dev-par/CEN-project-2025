import { useState, useEffect, Fragment } from 'react'
import SideBar from './components/SideBar'
import ClubCard from './components/ClubCard'
import AuthModal from './components/AuthModal'
import Notification from './components/Notification'
import { useAuth } from './context/AuthContext'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [filters, setFilter] = useState({ majors: [] })
  const [results, setResults] = useState([])
  const [isAuthOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [notification, setNotification] = useState(null)
  const { isAuthenticated, login, logout } = useAuth()

  const hasActiveFilters = filters.majors.length > 0
  const hasSearch = search.trim() !== ''
  const showLandingMessage = !hasActiveFilters && !hasSearch

  useEffect(() => {
    const fetchClubs = async () => {
      if (!hasSearch && !hasActiveFilters) {
        setResults([])
        return
      }

      const query = new URLSearchParams()
      if (hasSearch) query.append('search', search)
      if (hasActiveFilters) query.append('major', filters.majors.join(','))

      console.log('Fetching clubs with query:', query.toString())

      try {
        const token = localStorage.getItem('token')
        const url = `http://localhost:5050/api/clubs?${query}`
        console.log('Making request to:', url)
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        const data = await res.json()
        console.log('Received clubs data:', data)
        setResults(data)
      } catch (err) {
        console.error('Error fetching clubs:', err)
      }
    }

    fetchClubs()
  }, [search, filters, hasSearch, hasActiveFilters])

  const handleAuthSuccess = (message) => {
    setNotification({
      message,
      type: 'success'
    });
  };

  const handleLogout = () => {
    logout();
    setNotification({
      message: 'You have been logged out successfully',
      type: 'success'
    });
  };

  const handleAuthModalOpen = (mode) => {
    console.log('Opening auth modal in mode:', mode);
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleAuthModalClose = () => {
    console.log('Closing auth modal');
    setAuthOpen(false);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <Fragment>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleAuthModalClose}
        onSwitch={setAuthMode}
        onAuthSuccess={handleAuthSuccess}
      />

      <div className="container">
        <SideBar filters={filters} setFilter={setFilter} />

        <div className="main-content">
          <header className="app-header">
            <h1>Campus Connect</h1>
            {isAuthenticated ? (
              <button onClick={handleLogout}>
                Log Out
              </button>
            ) : (
              <button onClick={() => handleAuthModalOpen('login')}>
                Log In / Sign Up
              </button>
            )}
          </header>

          <input
            type="text"
            placeholder="Search clubs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-bar"
          />

          <div className="results">
            {showLandingMessage ? (
              <div className="landing-message">
                <h2>Welcome to Campus Connect!</h2>
                <p>Search clubs or use filters to start exploring</p>
              </div>
            ) : results.length > 0 ? (
              results.slice(0, 2).map(club => (
                <ClubCard key={club._id} club={club} />
              ))
            ) : (
              <div className="no-results-message">
                <p>No clubs found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default App
