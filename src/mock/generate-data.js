import { getRandomInteger, getRandomFloat, getRandomDate } from '../utils.js';

// Генерация актёров
const generateActors = () => {
  const actors = [
    'Marlon Brando',
    'Al Pacino',
    'Robert De Niro',
    'Jack Nicholson',
    'Daniel Day-Lewis',
    'Tom Hanks',
    'James Stewart',
    'Dustin Hoffman'
  ];

  return actors.slice(0, getRandomInteger(1, actors.length - 1));
};

// Генерация писателей
const generateWriters = () => {
  const writers = [
    'William Shakespeare',
    'David Icke',
    'J. K. Rowling',
    'R. R. Tolkien',
    'Jane Austen',
    'Agatha Christie',
    'George Orwell',
    'Charles Dickens',
    'S. Lewis'
  ];

  return writers.slice(0, getRandomInteger(1, writers.length - 1));
};

// Генерация директора
const generateDirector = () => {
  const directors = [
    'Alan Watts',
    'Lewis Carroll',
    'Joseph Conrad',
    'Geoffrey Chaucer',
    'George Eliot',
    'John Keats',
    'Emily Bront',
    'John Milton',
    'Thomas Hardy',
    'H. Lawrence',
    'Bernard Cornwell'
  ];

  return directors[getRandomInteger(directors.length - 1)];
};

// Генерация жанров
const generateGenres = () => {
  const genres = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Western'
  ];

  return genres.slice(0, getRandomInteger(1, genres.length - 1));
};

// Генерация страны
const generateCountry = () => {
  const countries = [
    'Denmark',
    'England',
    'Estonia',
    'Finland',
    'Iceland',
    'Ireland',
    'Latvia',
    'Norway',
    'Scotland',
    'Sweden'
  ];

  return countries[getRandomInteger(countries.length - 1)];
};

// Генерация случайного заголовка
const generateTitle = () => {
  const titles = [
    'made for each other',
    'popeye meets sinbad',
    'sagebrush trail',
    'santa claus conquers the martians',
    'the dance of life',
    'the great flamarion',
    'the man with the golden arm'
  ];

  return titles[getRandomInteger(titles.length - 1)];
};

// Генерация случайного постера
const generatePoster = () => {
  const posters = [
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg'
  ];
  return posters[getRandomInteger(posters.length -1)];
};

// Генерация эмоции
const generateEmotion = () => {
  const emotions = [
    'smile',
    'sleeping',
    'puke',
    'angry'
  ];

  return emotions[getRandomInteger(emotions.length - 1)];
};

// Генерация автора
const generateAuthor = () => {
  const authors = [
    'Marlon Brando',
    'Al Pacino',
    'Robert De Niro',
    'Jack Nicholson',
    'Daniel Day-Lewis',
    'Tom Hanks',
    'James Stewart',
    'Dustin Hoffman'
  ];

  return authors[getRandomInteger(authors.length - 1)];
};

// Генерация отзыва
const generateFeedback = () => {
  const feedbacks = [
    'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    'this is fantastic',
    'i like it is',
    'very good',
    'nice'
  ];

  return feedbacks[getRandomInteger(feedbacks.length - 1)];
};

const generateComment = () => ({
  author: generateAuthor(),
  comment: generateFeedback(),
  date: getRandomDate(new Date(2020, 1, 1), new Date),
  emotion: generateEmotion(),
});

// Генерация случайного описания
const generateDescription = () => {
  const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const descriptions = description.split('.');

  return descriptions.slice(0, getRandomInteger(1, descriptions.length - 1)).join('.');
};

// Генерация информации о релизе
const generateRelease = () => ({
  // date
  date: getRandomDate(new Date(1910, 1, 1), new Date()),

  // country
  releaseCountry: generateCountry(),
});

// Генерация информации о фильме
const generateFilmInfo = () => ({
  // title
  title: generateTitle(),

  // alternative title


  // total rating
  totalRating: getRandomFloat(0, 10),

  // poster
  poster: generatePoster(),

  // age rating
  ageRating: getRandomInteger(0, 21),

  // director
  director: generateDirector(),

  // writers
  writers: generateWriters(),

  // actors
  actors: generateActors(),

  // release {date, country}
  release: generateRelease(),

  // runtime
  runtime: getRandomInteger(30, 90),

  // genre
  genre: generateGenres(),

  // description
  description: generateDescription(),
});

const generateUserDetails = () => ({
  watchlist: Boolean(getRandomInteger(0, 1)),
  alreadyWatched: Boolean(getRandomInteger(0, 1)),
  watchingDate: getRandomDate(new Date(2021, 1, 1), new Date()),
  favorite: Boolean(getRandomInteger(0, 1)),
});

export const generateMovie = () => ({
  comments: Array.from({length: getRandomInteger(0, 5)}, generateComment),
  filmInfo: generateFilmInfo(),
  userDetails: generateUserDetails(),
});
