import MovieListPresenter from './presenter/movie-list-presenter.js';
import { movies } from './mock/get-generate-date.js';
import {render, RenderPosition} from './utils/render.js';
import UserRankView from './view/user-rank-view.js';
import MenuView from './view/site-menu-view.js';
import {filters} from './mock/get-generate-date.js';
import { getHistoryFilterCount } from './utils/utils.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');

const movieListPresenter = new MovieListPresenter(siteMainElement);

render(siteHeaderElement, new UserRankView(getHistoryFilterCount(filters)), RenderPosition.BEFOREEND);
render(siteMainElement, new MenuView(filters), RenderPosition.AFTERBEGIN);

movieListPresenter.init(movies);
footerStatistics.textContent = movies.length;

