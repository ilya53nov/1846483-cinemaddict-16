import { createSiteMenuTemplate } from './view/site-menu-view.js';
import { createButtonShowMoreTemplate } from './view/button-show-more-view.js';
import { createFilmCardTemplate } from './view/film-card-view.js';
import { createFilmDetailsTemplate } from './view/film-details-view.js';
import { createUserRankTemplate } from './view/user-rank-view.js';
import { RenderPosition, renderTemplate } from './render.js';

const FILM_COUNT = 5;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const filmsListContainer = document.createElement('div');
filmsListContainer.classList.add('films-list__container');

// Отрисовка звания пользователя
renderTemplate(siteHeaderElement, createUserRankTemplate(),RenderPosition.BEFOREEND);

// Отрисовка меню
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);

// Отрисовка карточки фильма
for (let i = 0; i < FILM_COUNT; i++) {
  renderTemplate(filmsListContainer, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}

siteMainElement.appendChild(filmsListContainer);

// Отрисовка кнопки "Show more"
renderTemplate(siteMainElement, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);

// Отрисовка подробной информации о фильме
renderTemplate(siteMainElement, createFilmDetailsTemplate(), RenderPosition.BEFOREEND);
