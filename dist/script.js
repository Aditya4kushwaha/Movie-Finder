const API_KEY = '1ecad7f';  
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const movieGrid = document.getElementById("movie-grid");

async function fetchMovies(query) {
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.Search) {
        displayMovies(data.Search);
    } else {
        movieGrid.innerHTML = `<p class="text-center col-span-full text-gray-400">No movies found.</p>`;
    }
}

async function displayMovies(movies) {
    movieGrid.innerHTML = ""; 

    const movieSet = new Set(); 

    
    const movieDetailsArray = await Promise.all(
        movies.map(async (movie) => {
            if (!movieSet.has(movie.imdbID)) {
                movieSet.add(movie.imdbID);
                return fetchMovieDetails(movie.imdbID);
            }
            return null;
        })
    );


    movieDetailsArray.filter(movie => movie !== null).forEach(movieDetails => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("bg-gray-800", "rounded-lg", "overflow-hidden", "shadow-lg");

        movieCard.innerHTML = `
            <img src="${movieDetails.Poster !== "N/A" ? movieDetails.Poster : 'https://via.placeholder.com/300x400'}"
                alt="${movieDetails.Title}" class="w-full h-80 object-cover rounded-t-lg">
            <div class="p-4 text-center">
                <h3 class="text-lg font-bold">${movieDetails.Title}</h3>
                <p class="text-gray-400">Year: ${movieDetails.Year}</p>
                <p class="text-yellow-400 font-bold">⭐ IMDb: ${movieDetails.imdbRating}</p>
                <p class="text-gray-400">Release Date: ${movieDetails.Released}</p>
                <a href="https://www.youtube.com/results?search_query=${movieDetails.Title}+trailer" 
                    target="_blank" class="text-blue-400 hover:underline">🎬 Watch Trailer</a>
            </div>
        `;

        movieGrid.appendChild(movieCard);
    });
}

async function fetchMovieDetails(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
    return response.json();
}


searchBtn.removeEventListener("click", handleSearch);
searchBtn.addEventListener("click", handleSearch);

searchInput.removeEventListener("keypress", handleKeyPress);
searchInput.addEventListener("keypress", handleKeyPress);

function handleSearch() {
    const query = searchInput.value.trim();
    if (query) fetchMovies(query);
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
}
