import {getCreatedElement} from '../utils/utils.js';
import {render, RenderPosition} from '../utils/render.js';
import FilmCardView from '../view/film-card-view.js';
import MenuView from '../view/site-menu-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import {showPopup} from './render-popup.js';
import {movies, filters} from '../mock/get-generate-date.js';
import { remove } from '../utils/render.js';

const FILM_COUNT_PER_STEP = 5;

let renderedMovieCount = FILM_COUNT_PER_STEP;

const siteMainElement = document.querySelector('.main');

const filmsSection = getCreatedElement('section', 'films');
const filmsListSection = getCreatedElement('section', 'films-list');

siteMainElement.appendChild(filmsSection);
filmsSection.appendChild(filmsListSection);

const filmsListContainer = getCreatedElement('div', 'films-list__container');

// Функция отрисовки карточки фильма
const renderFilmCard = (movie) => {
  const filmCardViewComponent = new FilmCardView(movie);

  render(filmsListContainer, filmCardViewComponent, RenderPosition.BEFOREEND);

  filmCardViewComponent.setClickHandler(() => showPopup(movie));
};

// Обработчик кнопки 'ShowMore'
const onShowMoreButtonClick = (component) => {

  movies
    .slice(renderedMovieCount, renderedMovieCount + FILM_COUNT_PER_STEP)
    .forEach((movie) => renderFilmCard(movie));

  renderedMovieCount += FILM_COUNT_PER_STEP;

  if (renderedMovieCount >= movies.length) {
    remove(component);
    renderedMovieCount = FILM_COUNT_PER_STEP;
  }
};

const filmsListTitle = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export const renderMain = () => {
  // Отрисовка меню
  render(siteMainElement, new MenuView(filters), RenderPosition.AFTERBEGIN);

  if (movies.length > 0) {
    // Отрисовка карточки фильма
    for (let i = 0; i < Math.min(movies.length, FILM_COUNT_PER_STEP); i++) {
      renderFilmCard(movies[i]);
    }

    filmsListSection.appendChild(filmsListContainer);

    if (movies.length > FILM_COUNT_PER_STEP) {

      // Отрисовка кнопки "Show more"
      const buttonShowMoreComponent = new ButtonShowMoreView();

      render(filmsListSection, buttonShowMoreComponent, RenderPosition.AFTEREND);

      buttonShowMoreComponent.setClickHandler(() => onShowMoreButtonClick(buttonShowMoreComponent));
    }

  } else {
    filmsListSection.insertAdjacentHTML(RenderPosition.AFTERBEGIN, filmsListTitle());
  }

};
