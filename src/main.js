import MenuView from './view/site-menu-view.js';
import ButtonShowMoreView from './view/button-show-more-view.js';
import FilmCardView from './view/film-card-view.js';
import FilmDetailsView from './view/film-details-view.js';
import UserRankView from './view/user-rank-view.js';
import { RenderPosition, render } from './render.js';
import { generateFilter } from './mock/filter.js';

import { generateMovie } from './mock/generate.js';

const FILM_COUNT = 25;
const FILM_COUNT_PER_STEP = 5;

const movies = Array.from({length: FILM_COUNT}, generateMovie);
const filters = generateFilter(movies);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');

const filmsListContainer = document.createElement('div');
filmsListContainer.classList.add('films-list__container');

let renderedMovieCount = FILM_COUNT_PER_STEP;

// Функция для получения количества просмотренных фильмов
const getHistoryFilterCount = (filtersItem) => {
  const historyFilter = filtersItem.filter(({name}) => name === 'History');

  return historyFilter[0].count;
};

// Отрисовка звания пользователя
render(siteHeaderElement, new UserRankView(getHistoryFilterCount(filters)).element, RenderPosition.BEFOREEND);

// Отрисовка меню
render(siteMainElement, new MenuView(filters).element, RenderPosition.BEFOREEND);

// Обработчик закрытия попапа
const onClosePopup = (element) => {
  document.body.classList.toggle('hide-overflow');
  siteMainElement.removeChild(element);
};

// Обработчик открытия попапа
const onShowPopup = (movie) => {
  const filmDetailsViewElement = new FilmDetailsView(movie).element;
  const closeButtonFilmDetailsViewElement = filmDetailsViewElement.querySelector('.film-details__close-btn');

  document.body.classList.toggle('hide-overflow');
  siteMainElement.appendChild(filmDetailsViewElement);

  closeButtonFilmDetailsViewElement.addEventListener('click', () => {
    onClosePopup(filmDetailsViewElement);
  });
};

// Функция добавления карточки фильма
const addFilmCard = (movie) => {
  const filmCardViewElement = new FilmCardView(movie).element;

  render(filmsListContainer, filmCardViewElement, RenderPosition.BEFOREEND);

  filmCardViewElement.addEventListener('click', () => {
    onShowPopup(movie);
  });

};

// Обработчик кнопки 'ShowMore'
const onShowMoreButton = (evt) => {
  evt.preventDefault();

  movies
    .slice(renderedMovieCount, renderedMovieCount + FILM_COUNT_PER_STEP)
    .forEach((movie) => addFilmCard(movie));

  renderedMovieCount += FILM_COUNT_PER_STEP;

  if (renderedMovieCount >= movies.length) {
    evt.target.remove();
    evt.target.removeEventListener('click', onShowMoreButton);
    renderedMovieCount = FILM_COUNT_PER_STEP;
  }
};

// Отрисовка карточки фильма
for (let i = 0; i < Math.min(movies.length, FILM_COUNT_PER_STEP); i++) {
  addFilmCard(movies[i]);
}

if (movies.length > FILM_COUNT_PER_STEP) {

  // Отрисовка кнопки "Show more"
  render(siteMainElement, new ButtonShowMoreView().element, RenderPosition.AFTEREND);

  const showMoreButton = document.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', onShowMoreButton);
}

siteMainElement.appendChild(filmsListContainer);

footerStatistics.textContent = movies.length;
