import React from 'react';
import Search from './components/Search.jsx';
import { useEffect, useState } from 'react';
import Spinner from './components/spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';


const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}  

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce Search Term to prevent too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      // if(data.response == 'False') {
      if (!data.results || data.results.length === 0) {  // ✅ Correct check
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
    // console.log("TMDB API Key:", API_KEY);  // Debugging 
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  
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
          <h2 className="mt-[40px]">All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
        </section>
      </div>  
    </main>
    )
  }

export default App