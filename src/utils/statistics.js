import { filter } from '../utils/filter.js';
import { FilterType,FilterTypeStatistics,userRanks } from '../const.js';
import dayjs from 'dayjs';

const getValuesItems = (items) => {
  const valuesItems = [];

  for (const item of items.values()) {
    valuesItems.push(item);
  }

  return valuesItems;
};

const getKeysItems = (items) => {
  const keysItems = [];

  for (const item of items.keys()) {
    keysItems.push(item);
  }

  return keysItems;
};

const getUniqItemsAndCount = (items) => {
  const mapItems = new Map();

  items.forEach((item) => {
    if (mapItems.has(item)) {
      mapItems.set(item, mapItems.get(item) + 1);
    } else {
      mapItems.set(item, 1);
    }
  });

  return {genres: getKeysItems(mapItems), counts: getValuesItems(mapItems)};
};

const getFilteredHistoryMovies = (movies) => filter[FilterType.HISTORY](movies);

export const getCountHistoryMovies = (movies) => getFilteredHistoryMovies(movies).length;

export const  getAmountOfWatchedMinutes = (movies) => {
  const filteredHistoryMovies = getFilteredHistoryMovies(movies);

  return filteredHistoryMovies.reduce((sum, item) => sum + item.filmInfo.runtime, 0);
};

export const getGenreHistoryMovies = (movies) => {
  const filteredHistoryMovies = getFilteredHistoryMovies(movies);
  const genresHistoryMovies =  filteredHistoryMovies.map((movie) => movie.filmInfo.genre);

  if (genresHistoryMovies.length === 0) {
    return {genres: [], counts: []};
  }

  const genresList = genresHistoryMovies.map((genres) => genres.join()).join().split(',');

  return getUniqItemsAndCount(genresList);
};

export const filterDataStatistics = {
  [FilterTypeStatistics.ALL]: (movies) => movies.sort(),
  [FilterTypeStatistics.MONTH]: (movies) => movies.filter((movie) => dayjs().diff(dayjs(movie.userDetails.watchingDate), 'month') === 0),
  [FilterTypeStatistics.TODAY]: (movies) =>  movies.filter((movie) => movie.userDetails.watchingDate === dayjs()),
  [FilterTypeStatistics.WEEK]: (movies) =>  movies.filter((movie) => dayjs().diff(dayjs(movie.userDetails.watchingDate), 'week') === 0),
  [FilterTypeStatistics.YEAR]: (movies) =>  movies.filter((movie) => dayjs().diff(dayjs(movie.userDetails.watchingDate), 'year') === 0),
};

export const getUserRank = (value) => {
  for (const {name, min, max} of userRanks) {
    if (value >= min && value <= max) {
      return name;
    }
  }
};
