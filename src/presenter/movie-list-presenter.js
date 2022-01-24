import {render, RenderPosition} from '../utils/render.js';
import MoviePresenter from './movie-presenter.js';
import MovieListView from '../view/film-list-view.js';
import MovieListContainerView from '../view/film-list-container-view.js';
import MovieSectionView from '../view/films-section-view.js';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import {remove} from '../utils/render.js';
import {updateItem} from '../utils/utils.js';
import SortView from '../view/sort-view.js';
import {SortType} from '../const.js';

const FILM_COUNT_PER_STEP = 5;

export default class MovieListPresenter{
  #mainContainer = null;

  #renderedMovieCount = FILM_COUNT_PER_STEP;
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedBoardMovies = [];

  #sortComponent = new SortView();
  #buttonShowMoreComponent = new ButtonShowMoreView();
  #movieListComponent = new MovieListView();
  #movieListContainerComponent = new MovieListContainerView();
  #movieSectionComponent = new MovieSectionView();


  #boardMovies = [];

  constructor(mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (movies) => {
    this.#boardMovies = [...movies];
    this.#sourcedBoardMovies = [...movies];

    render(this.#movieListComponent, this.#movieListContainerComponent, RenderPosition.AFTERBEGIN);
    render(this.#movieSectionComponent, this.#movieListComponent, RenderPosition.BEFOREEND);
    render(this.#mainContainer, this.#movieSectionComponent, RenderPosition.BEFOREEND);

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  }

  #handleMovieChange = (updatedMovie) => {
    this.#boardMovies = updateItem(this.#boardMovies, updatedMovie);
    this.#sourcedBoardMovies = updateItem(this.#sourcedBoardMovies, updatedMovie);
    this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
  }

  #sortMovies = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#boardMovies.sort((current, next) => next.filmInfo.release.date - current.filmInfo.release.date);
        break;
      case SortType.RATING:
        this.#boardMovies.sort((current, next) => next.filmInfo.totalRating - current.filmInfo.totalRating);
        break;
      default:
        this.#boardMovies = [...this.#sourcedBoardMovies];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortMovies(sortType);
    this.#clearMovieList();
    this.#renderMovieList();
  }

  #renderSort = () => {
    render(this.#mainContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#movieListContainerComponent, this.#handleMovieChange, this.#handleModeChange);
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  }

  #renderMovies = (from, to) => {
    this.#boardMovies
      .slice(from, to)
      .forEach((movie) => this.#renderMovie(movie));
  }

  #clearMovieList = () => {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    this.#renderedMovieCount = FILM_COUNT_PER_STEP;
    remove(this.#buttonShowMoreComponent);
  }

  #renderMovieList = () => {
    this.#renderMovies(0, Math.min(this.#boardMovies.length, FILM_COUNT_PER_STEP));

    if (this.#boardMovies.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #handleShowMoreButtonClick = () => {
    this.#renderMovies(this.#renderedMovieCount, this.#renderedMovieCount + FILM_COUNT_PER_STEP);
    this.#renderedMovieCount += FILM_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.#boardMovies.length) {
      remove(this.#buttonShowMoreComponent);
      this.#renderedMovieCount = FILM_COUNT_PER_STEP;
    }
  }

  #renderShowMoreButton = () => {
    render(this.#movieListComponent, this.#buttonShowMoreComponent, RenderPosition.BEFOREEND);

    this.#buttonShowMoreComponent.setClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderNoMovies = () => {
    // TO DO
  }

  #renderBoard = () => {
    if (this.#boardMovies.length === 0) {
      this.#renderNoMovies();
    }

    this.#renderSort();
    this.#renderMovieList();
  }

}
