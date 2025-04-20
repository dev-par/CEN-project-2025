import { useState, useEffect } from 'react';
import SideBar from './components/SideBar';
import ClubCard from './components/ClubCard';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  const [filters, setFilter] = useState({ majors: [] });
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      const hasSearch = search.trim() !== '';
      const hasMajors = filters.majors.length > 0;

      if (!hasSearch && !hasMajors) {
        setResults([]);
        return;
      }

      const query = new URLSearchParams();

      if (hasSearch) {
        query.append('search', search);
      }

      if (hasMajors) {
        const majorsAsString = filters.majors.join(',');
        query.append('major', majorsAsString);
      }

      try {
        const res = await fetch(`http://localhost:5050/api/clubs?${query.toString()}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Error fetching clubs:', err);
      }
    };

    fetchClubs();
  }, [search, filters]);

  return (
    <div className="container">
      <SideBar filters={filters} setFilter={setFilter} />

      <div className="main-content">
        <h1>Campus Connect</h1>

        <input
          type="text"
          placeholder="Search clubs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        <div className="results">
          {results.slice(0, 2).map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
