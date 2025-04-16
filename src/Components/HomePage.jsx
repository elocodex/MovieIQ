import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import heroImg from '../../public/hero-img.png'
import Search from './Search'
import Spinner from './Spinner';
import MovieCard from './MovieCard';
import { getTrendingMovies, updateSearchCount } from '../appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
}

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [movieList, setMovieList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [trendingMovies, setTrendingMovies] = useState([])
  
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('savedPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });

  const [totalPages, setTotalPages] = useState(0)
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm)
    if (!localStorage.getItem('savedPage')) {
      setCurrentPage(1);  // Only reset when there's no saved page
    }
  }, 750, [searchTerm])

  const fetchMovies = async (query = '', page = 1) => {
    setIsLoading(true)
    setErrorMessage("")

    const validPage = isNaN(page) || page <= 0 ? 1 : page;  // Default to page 1 if invalid

    try {
      const endpoint =
        query 
          ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}&page=${validPage}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${validPage}`

      const response = await fetch(endpoint, API_OPTIONS)

      
      if(!response.ok){
        throw new Error('Failed to fetch movies')
      } else {
        const data = await response.json();

        if(data.Response === 'false'){
          console.log(data.Error);
          setErrorMessage(data.Error || "Failed to fetch!")
          setMovieList([])
          return;
        } else {
          setMovieList(data.results || [])
          setTotalPages(data.total_pages || 0)
          
          if(query && data.results.length > 0){
            await updateSearchCount(query, data.results[0])
          }
        }
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Error fetching movies. Please try again!")
    } finally {
      setIsLoading(false)
      setIsPageTransitioning(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !isPageTransitioning) {
      setIsPageTransitioning(true)
      setCurrentPage(newPage)
      
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (err) {
      console.log('Error fetching trending movies:', err);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, currentPage)
  }, [debouncedSearchTerm, currentPage])

  useEffect(() => {
    loadTrendingMovies()
  }, [])

    useEffect(() => {
      const savedPage = localStorage.getItem('savedPage');
      if (savedPage) {
        setCurrentPage(parseInt(savedPage, 10));
      }
    }, []);

    useEffect(() => {
      localStorage.setItem('savedPage', currentPage);
    }, [currentPage]);


  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src={heroImg} alt="Hero Banner" />
          <h1 className='text-3xl sm:text-6xl'>Discover <span className='text-gradient'>Movies</span> Like an Expert, Watch Like a Pro.</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index+1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2>All Movies</h2>
          {isLoading ? (
            <p className='text-white'><Spinner />.</p>
          ): errorMessage ?(
            <p className='text-red-500'>{errorMessage}</p>
          ): (
            <>
              <ul className={isPageTransitioning ? 'opacity-60 transition-opacity' : 'opacity-100 transition-opacity'}>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
              
            {totalPages > 0 && (
            <div className="pagination mt-6 flex justify-center items-center gap-2 flex-wrap">
              <button 
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isPageTransitioning}
                className="bg-dark-100 px-3 md:px-5 py-2 md:py-3 rounded-xl shadow-inner shadow-light-100/10 text-white font-bold text-sm md:text-base cursor-pointer disabled:opacity-50 transition-all duration-300"
              >
                First
              </button>

              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isPageTransitioning}
                className="bg-dark-100 px-3 md:px-5 py-2 md:py-3 rounded-xl shadow-inner shadow-light-100/10 text-white font-bold text-sm md:text-base cursor-pointer disabled:opacity-50 transition-all duration-300"
              >
                Previous
              </button>

              <span className="text-white px-2 md:px-4 font-bold text-sm md:text-base">
                Page {currentPage} of {totalPages > 500 ? 500 : totalPages}
              </span>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || currentPage === 500 || isPageTransitioning}
                className="bg-dark-100 px-3 md:px-5 py-2 md:py-3 rounded-xl shadow-inner shadow-light-100/10 text-white font-bold text-sm md:text-base cursor-pointer disabled:opacity-50 transition-all duration-300"
              >
                Next
              </button>

              <button 
                onClick={() => handlePageChange(totalPages > 500 ? 500 : totalPages)}
                disabled={currentPage === totalPages || currentPage === 500 || isPageTransitioning}
                className="bg-dark-100 px-3 md:px-5 py-2 md:py-3 rounded-xl shadow-inner shadow-light-100/10 text-white font-bold text-sm md:text-base cursor-pointer disabled:opacity-50 transition-all duration-300"
              >
                Last
              </button>
            </div>
          )}

            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default Homepage
