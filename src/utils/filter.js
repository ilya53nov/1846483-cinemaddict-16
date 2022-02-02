import {FilterType} from '../const.js';

export const filter = {
  [FilterType.ALL]: (movies) => movies.sort(),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
  [FilterType.HISTORY]: (movies) =>  movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.WATCHLIST]: (movies) =>  movies.filter((movie) => movie.userDetails.watchlist),
};
