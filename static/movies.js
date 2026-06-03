

        const apiKey = "8d516687";


        async function loadMovies(searchTerm, containerId){

            const response = await fetch(
                `https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`
            );

            const data = await response.json();

            if(data.Response === "False"){

                document.getElementById(containerId).innerHTML =
                "<p>No movies found</p>";

                return;
            }

            let moviesHTML = "";

            data.Search.forEach(movie => {

                let poster = movie.Poster;

                if(poster === "N/A"){
                    poster = "https://via.placeholder.com/220x320";
                }

                moviesHTML += `

                    <div class="movie-card"
                        

                        <img src="${poster}" alt="${movie.Title}" onerror="this.src='https://via.placeholder.com/220x320?text=No+Image'">

                        <h3>${movie.Title}</h3>

                        <p>${movie.Year}</p>

                        <button onclick='watchTrailer("${movie.Title}")'>
                            ▶ Trailer
                        </button>

                        <button onclick='openIMDb("${movie.imdbID}")'>
                            ⭐ Details
                        </button>

                    </div>

                `;
            });

            document.getElementById(containerId).innerHTML =
            moviesHTML;
        }


        // ADD FUNCTIONS HERE

        function watchTrailer(title){

           const url =
          `https://www.youtube.com/results?search_query=${title}+trailer`;

           window.open(url, "_blank");
        
        }

        function openIMDb(imdbID){

           const url =
           `https://www.imdb.com/title/${imdbID}`;

            window.open(url, "_blank");
        }
        // AUTO LOAD MOVIES

        loadMovies("avengers", "trendingMovies");

        loadMovies("naruto", "animeMovies");

        loadMovies("conjuring", "horrorMovies");

        loadMovies("comedy", "comedyMovies");

        async function showMovieDetails(imdbID){

           const response = await fetch(
            `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`
        );

        const movie = await response.json();

        alert(
           `${movie.Title}

⭐ IMDb: ${movie.imdbRating}

🎭 Genre: ${movie.Genre}

📖 Plot:
${movie.Plot}`
    );
}

        
