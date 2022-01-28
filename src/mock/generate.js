import { getRandomInteger, getRandomFloat, getRandomDate, getRandomItem, getRandomItems } from '../utils/utils.js';
import { DESCRIPTION, FEEDBACKS, AUTHORS, EMOTIONS, POSTERS, TITLES, COUNTRIES, GENRES, DIRECTORS, WRITERS, ACTORS } from './data.js';
import {nanoid} from 'nanoid';

// Генерация информации о комментарии
const generateComment = () => ({
  id: nanoid(),
  author: getRandomItem(AUTHORS),
  comment: getRandomItem(FEEDBACKS),
  date: getRandomDate(new Date(2020, 1, 1), new Date),
  emotion: getRandomItem(EMOTIONS),
});

// Генерация информации о релизе
const generateRelease = () => ({
  // date
  date: getRandomDate(new Date(1910, 1, 1), new Date()),

  // country
  releaseCountry: getRandomItem(COUNTRIES),
});

// Генерация информации о фильме
const generateFilmInfo = () => ({
  // title
  title: getRandomItem(TITLES),

  // alternative title


  // total rating
  totalRating: getRandomFloat(0, 10),

  // poster
  poster: getRandomItem(POSTERS),

  // age rating
  ageRating: getRandomInteger(0, 21),

  // director
  director: getRandomItem(DIRECTORS),

  // writers
  writers: getRandomItems(WRITERS),

  // actors
  actors: getRandomItems(ACTORS),

  // release {date, country}
  release: generateRelease(),

  // runtime
  runtime: getRandomInteger(30, 90),

  // genre
  genre: getRandomItems(GENRES),

  // description
  description: getRandomItems(DESCRIPTION.split('.')).join('.'),
});

// Генерация пользовательской информации
const generateUserDetails = () => ({
  watchlist: Boolean(getRandomInteger(0, 1)),
  alreadyWatched: Boolean(getRandomInteger(0, 1)),
  watchingDate: getRandomDate(new Date(2021, 1, 1), new Date()),
  favorite: Boolean(getRandomInteger(0, 1)),
});

//const generateComments = () => Array.from({length: 100}, generateComment);

//export const comments = generateComments();

// Генерация фильма
export const generateMovie = () => ({
  id: nanoid(),
  comments: Array.from({length: getRandomInteger(0, 5)}, generateComment),
  //commentsId:
  filmInfo: generateFilmInfo(),
  userDetails: generateUserDetails(),
});
