import MovieListPresenter from './presenter/movie-list-presenter.js';
import MoviesModel from './model/movies-model.js';
import { movies } from './mock/get-generate-date.js';
import {render, RenderPosition} from './utils/render.js';
import UserRankView from './view/user-rank-view.js';
import MenuView from './view/site-menu-view.js';
//import {filters} from './mock/get-generate-date.js';
import { getHistoryFilterCount } from './utils/utils.js';
import FilterModel from './model/filter-model.js';
import FilterView from './view/filter-view.js';
import FilterPresenter from './presenter/filter-presenter.js';


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');


const moviesModel = new MoviesModel();
moviesModel.movies = movies;


const filterModel = new FilterModel();
const menuView = new MenuView();

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel);
const filterPresenter = new FilterPresenter(menuView, filterModel, moviesModel);



//render(siteHeaderElement, new UserRankView(getHistoryFilterCount(filters)), RenderPosition.BEFOREEND);
render(siteMainElement, menuView, RenderPosition.AFTERBEGIN);
//render(siteMainElement, new FilterView(filters, 'all'), RenderPosition.AFTERBEGIN);

filterPresenter.init();
movieListPresenter.init();
footerStatistics.textContent = movies.length;

