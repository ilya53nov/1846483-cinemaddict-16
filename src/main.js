import { createSiteMenuTemplate } from './view/site-menu-view.js';
import { createButtonShowMoreTemplate } from './view/button-show-more-view.js';
import { createFilmCardTemplate } from './view/film-card-view.js';
import { createFilmDetailsTemplate } from './view/film-details-view.js';
import { createUserRankTemplate } from './view/user-rank-view.js';
import { RenderPosition, renderTemplate } from './render.js';
import { generateFilter } from './mock/filter.js';

import { generateMovie } from './mock/generate-data.js';

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
renderTemplate(siteHeaderElement, createUserRankTemplate(getHistoryFilterCount(filters)),RenderPosition.BEFOREEND);

// Отрисовка меню
renderTemplate(siteMainElement, createSiteMenuTemplate(filters), RenderPosition.BEFOREEND);

// Обработчик кнопки 'ShowMore'
const onShowMoreButton = (evt) => {
  evt.preventDefault();
  movies
    .slice(renderedMovieCount, renderedMovieCount + FILM_COUNT_PER_STEP)
    .forEach((movie) => renderTemplate(filmsListContainer, createFilmCardTemplate(movie), RenderPosition.BEFOREEND));

  renderedMovieCount += FILM_COUNT_PER_STEP;

  if (renderedMovieCount >= movies.length) {
    evt.target.remove();
    evt.target.removeEventListener('click', onShowMoreButton);
    renderedMovieCount = FILM_COUNT_PER_STEP;
  }
};

// Отрисовка карточки фильма
for (let i = 0; i < Math.min(movies.length, FILM_COUNT_PER_STEP); i++) {
  renderTemplate(filmsListContainer, createFilmCardTemplate(movies[i]), RenderPosition.BEFOREEND);
}

if (movies.length > FILM_COUNT_PER_STEP) {
  // Отрисовка кнопки "Show more"
  renderTemplate(siteMainElement, createButtonShowMoreTemplate(), RenderPosition.AFTEREND);

  const showMoreButton = document.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', onShowMoreButton);
}

siteMainElement.appendChild(filmsListContainer);

// Отрисовка подробной информации о фильме
renderTemplate(siteMainElement, createFilmDetailsTemplate(movies[0]), RenderPosition.BEFOREEND);

footerStatistics.textContent = movies.length;
