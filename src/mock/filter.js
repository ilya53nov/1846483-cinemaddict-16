
const filmToFilterMap = {
// 'All movies': (movies) => movies.length,
  'Watchlist': (movies) =>  movies.filter((movie) => movie.userDetails.watchlist).length,
  'History': (movies) =>  movies.filter((movie) => movie.userDetails.alreadyWatched).length,
  'Favorites': (movies) =>  movies.filter((movie) => movie.userDetails.favorite).length,
};

export const generateFilter = (movies) => Object.entries(filmToFilterMap).map(
  ([filterName, countMovies]) => ({
    name: filterName,
    count: countMovies(movies),
  }),
);
