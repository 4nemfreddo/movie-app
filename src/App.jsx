import React from 'react';
import Search from './components/Search.jsx';
import { useState } from 'react';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return ( 
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Get <span className="text-gradient">Movies</span> For All Moods And Occassions For You and Loved Ones</h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>  
    </main>
    )
  }

export default App