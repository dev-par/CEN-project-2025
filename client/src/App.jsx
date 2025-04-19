import { useState, useEffect } from 'react'
import SideBar from './components/SideBar'
import ClubCard from './components/ClubCard'
import AuthModal from './components/AuthModal'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [filters, setFilter] = useState({ majors: [] })
  const [results, setResults] = useState([])
  const [isAuthOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  useEffect(() => {
    const fetchClubs = async () => {
      const hasSearch = search.trim() !== ''
      const hasMajors = filters.majors.length > 0

      if (!hasSearch && !hasMajors) {
        setResults([])
        return
      }

      const query = new URLSearchParams()
      if (hasSearch) query.append('search', search)
      if (hasMajors) query.append('major', filters.majors.join(','))

      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`http://localhost:${process.env.PORT || 5050}/api/clubs?${query}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        const data = await res.json()
        setResults(data)
      } catch (err) {
        console.error('Error fetching clubs:', err)
      }
    }

    fetchClubs()
  }, [search, filters])

  return (
    <>
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setAuthOpen(false)}
        onSwitch={setAuthMode}
      />

      <div className="container">
        <SideBar filters={filters} setFilter={setFilter} />

        <div className="main-content">
          <header className="app-header">
            <h1>Campus Connect</h1>
            <button onClick={() => { setAuthMode('login'); setAuthOpen(true) }}>
              Log In / Sign Up
            </button>
          </header>

          <input
            type="text"
            placeholder="Search clubs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-bar"
          />

          <div className="results">
            {results.slice(0, 2).map(club => (
              <ClubCard key={club._id} club={club} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
