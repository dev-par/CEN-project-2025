import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
 

function App() {
  const [search, setSearch] = useState('');
  const [filters, setFilter] = useState({
    days: [],
    majors: []
  });
  return (
    <div className='App'>
      <h1>Campus Connect </h1>
      <input
      type='text'
      placeholder="Search:"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-bar"
      />
    </div>
  );
}
export default App
