import { useState, useEffect, Fragment } from 'react'
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
  }, [search, filters])

  return (
    <Fragment>
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
            {results.length > 0 ? (
              results.slice(0, 2).map(club => (
                <ClubCard key={club._id} club={club} />
              ))
            ) : (
              <div className="start_screen">
                <p>
                  {!search.trim() && filters.majors.length === 0
                    ? "Select a major or search for a club to get started!"
                    : "No clubs found matching your search criteria."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default App
