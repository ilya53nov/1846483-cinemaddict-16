import MovieListPresenter from './presenter/movie-list-presenter.js';
import MoviesModel from './model/movies-model.js';
import { movies } from './mock/get-generate-date.js';
import {render, RenderPosition, remove} from './utils/render.js';
import MenuView from './view/site-menu-view.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {MenuItem} from './const.js';
import StatisticsView from './view/statistics-view.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');

const moviesModel = new MoviesModel();
moviesModel.movies = movies;

const filterModel = new FilterModel();
const menuViewComponent = new MenuView();

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel);
const filterPresenter = new FilterPresenter(menuViewComponent, filterModel, moviesModel, siteHeaderElement);

render(siteMainElement, menuViewComponent, RenderPosition.AFTERBEGIN);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.MOVIES:
      remove(statisticsComponent);
      movieListPresenter.destroy();
      movieListPresenter.init();
      break;
    case MenuItem.STATISTICS:
      movieListPresenter.destroy();
      statisticsComponent = new StatisticsView(moviesModel.movies);
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

menuViewComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
movieListPresenter.init();
footerStatistics.textContent = movies.length;
