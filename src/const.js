export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserAction = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const FilterTypeStatistics = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const MenuItem = {
  MOVIES: 'MOVIES',
  STATISTICS: 'STATISTICS',
};

export const userRanks = [
  {
    name: 'Novice',
    min: 1,
    max: 10,
  },

  {
    name: 'Fan',
    min: 11,
    max: 20,
  },

  {
    name: 'Movie Buff',
    min: 21,
    max: Infinity,
  },
];

export const Server = {
  AUTHORIZATION: 'Basic k456klk45lh6k3lk2ld',
  END_POINT: 'https://16.ecmascript.pages.academy/cinemaddict',
};
