import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from './BackButton';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const options = {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json;charset=utf-8'
          }
        };
        
        const res = await fetch(`${API_BASE_URL}/movie/${id}?append_to_response=videos,credits,similar`, options);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status}`);
        }
        
        const data = await res.json();
        setMovie(data);

        const trailers = data.videos?.results?.filter(video => video.type === "Trailer") || [];
        setTrailer(trailers.length > 0 ? trailers[0].key : null);

        setCast(data.credits?.cast?.slice(0, 6) || []);

        setSimilarMovies(data.similar?.results?.slice(0, 8) || []);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <p className="text-light-100 text-xl">Loading...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="bg-dark-100 p-5 rounded-2xl shadow-inner shadow-light-100/10">
        <p className="text-white">{error}</p>
      </div>
    </div>
  );
  
  if (!movie) return null;

  const formatCurrency = (value) => {
    return value ? `$${value.toLocaleString()}` : 'Not available';
  };

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  return (
    <main>
      <div className="pattern"></div>
      <BackButton />

      <div className="wrapper">
        <div className="relative">
          {movie.backdrop_path && (
            <div className="absolute top-0 left-0 w-full h-96 overflow-hidden rounded-2xl -z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent z-10"></div>
              <img 
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                alt={`${movie.title} backdrop`}
                className="w-full h-full object-cover object-top opacity-50"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'placeholder-image.jpg';
                }}
              />
            </div>
          )}

          <div className="pt-64 relative z-10">
            <h1 className="mx-auto max-w-4xl text-center text-5xl font-bold leading-tight tracking-[-1%] text-white sm:text-[64px] sm:leading-[76px]">
              {movie.title} {releaseYear && `(${releaseYear})`}
            </h1>
            
            {movie.tagline && 
              <p className="text-center text-light-200 text-xl mt-4 italic">{movie.tagline}</p>
            }
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            {movie.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="w-full rounded-2xl shadow-inner shadow-light-100/10"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'placeholder-poster.jpg';
                }}
              />
            ) : (
              <div className="bg-dark-100 h-96 rounded-2xl flex items-center justify-center shadow-inner shadow-light-100/10">
                <p className="text-light-200">No poster available</p>
              </div>
            )}

            <div className="mt-6 bg-dark-100 p-5 rounded-2xl shadow-inner shadow-light-100/10">
              {movie.vote_average !== undefined && (
                <div className="flex items-center mb-3">
                  <img src="/Rating.svg" alt="Rating" className="w-5 h-5 mr-2" />
                  <p className="text-white font-bold">{movie.vote_average.toFixed(1)} 
                    {movie.vote_count !== undefined && 
                      <span className="text-gray-100 font-normal ml-1">({movie.vote_count.toLocaleString()} votes)</span>
                    }
                  </p>
                </div>
              )}
              
              {movie.runtime && (
                <p className="text-light-200 mb-3">
                  <strong className="text-white">Runtime:</strong> {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </p>
              )}
              
              {movie.release_date && (
                <p className="text-light-200 mb-3">
                  <strong className="text-white">Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}
                </p>
              )}
              
              <p className="text-light-200 mb-3">
                <strong className="text-white">Budget:</strong> {formatCurrency(movie.budget)}
              </p>
              
              <p className="text-light-200">
                <strong className="text-white">Revenue:</strong> {formatCurrency(movie.revenue)}
              </p>
            </div>
          </div>
          
          <div className="md:col-span-2">
            {movie.overview && (
              <div className="bg-dark-100 p-5 rounded-2xl shadow-inner shadow-light-100/10 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-light-200">{movie.overview}</p>
              </div>
            )}
            
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Genres</h2>
                <div className="flex flex-wrap gap-3">
                  {movie.genres.map(g => (
                    <span key={g.id} className="bg-dark-100 px-4 py-2 rounded-lg text-light-200">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Production Companies</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {movie.production_companies.map(company => (
                    <div key={company.id} className="bg-dark-100 p-3 rounded-lg text-center">
                      <p className="text-light-200">{company.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {movie.spoken_languages && movie.spoken_languages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Languages</h2>
                <div className="flex flex-wrap gap-3">
                  {movie.spoken_languages.map((lang, index) => (
                    <span key={index} className="bg-dark-100 px-4 py-2 rounded-lg text-light-200">
                      {lang.english_name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {movie.homepage && (
              <div className="mb-6">
                <a 
                  href={movie.homepage} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-dark-100 px-6 py-3 rounded-lg text-light-100 hover:bg-light-100/10 transition-colors"
                >
                  Visit Official Website
                </a>
              </div>
            )}
          </div>
        </div>
        
        {trailer && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Watch Trailer</h2>
            <div className="bg-dark-100 p-2 rounded-2xl shadow-inner shadow-light-100/10 overflow-hidden">
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${trailer}`}
                  title={`${movie.title} Trailer`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
        
        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Top Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
              {cast.map(actor => (
                <div key={actor.id} className="bg-dark-100 rounded-2xl overflow-hidden shadow-inner shadow-light-100/10">
                  {actor.profile_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                      alt={actor.name}
                      className="w-full aspect-[3/4] object-cover" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'placeholder-actor.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-light-100/5 flex items-center justify-center">
                      <p className="text-gray-100">No Image</p>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-white font-medium text-base truncate">{actor.name}</p>
                    {actor.character && (
                      <p className="text-gray-100 text-sm truncate">{actor.character}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {similarMovies.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
            <div className="all-movies">
              <ul>
                {similarMovies.map(movie => (
                  <li key={movie.id}>
                    <div className="movie-card cursor-pointer"
                         onClick={() => {
                          window.scrollTo(0,0)
                            navigate(`/movie/${movie.id}`);
                        }}
                    >
                      {movie.poster_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                          alt={movie.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'placeholder-poster.jpg';
                          }}
                        />
                      ) : (
                        <div className="aspect-[2/3] bg-light-100/5 flex items-center justify-center">
                          <p className="text-gray-100">No Poster</p>
                        </div>
                      )}
                      <h3>{movie.title}</h3>
                      <div className="content">
                        {movie.vote_average !== undefined && (
                          <div className="rating">
                            <img src="/Rating.svg" alt="rating" />
                            <p>{movie.vote_average.toFixed(1)}</p>
                          </div>
                        )}
                        {movie.release_date && (
                          <span className="year">{new Date(movie.release_date).getFullYear()}</span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MovieDetails;