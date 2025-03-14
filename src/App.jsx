import React from 'react';
import Search from './components/Search.jsx';
import { useEffect, useState } from 'react';

const API_BASE_URL = 'https://api.themoviebd.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  Headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}  

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if(data.Response = 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

        setMovieList(data.results || []);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again Later.');
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    fetchMovies();
  }, []);
  
  return ( 
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Get All Your <span className="text-gradient">Movies</span> In One Place</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>  
    </main>
    )
  }

export default App