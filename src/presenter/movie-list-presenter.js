import {render, RenderPosition} from '../utils/render.js';
import MoviePresenter, {State as MoviePresenterViewState} from './movie-presenter.js';
import MovieListView from '../view/film-list-view.js';
import MovieListContainerView from '../view/film-list-container-view.js';
import MovieSectionView from '../view/films-section-view.js';
import ShowMoreButtonView from '../view/button-show-more-view.js';
import {remove} from '../utils/render.js';
import SortView from '../view/sort-view.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';
import NoMovieView from '../view/no-movie-view.js';
import LoadingView from '../view/loading-view.js';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter{
  #mainContainer = null;
  #moviesModel = null;
  #filterModel = null;


  #renderedMovieCount = MOVIE_COUNT_PER_STEP;

  #movieListComponent = new MovieListView();
  #movieListContainerComponent = new MovieListContainerView();
  #movieSectionComponent = new MovieSectionView();
  #loadingComponent = new LoadingView();
  #noMovieComponent = null;
  #sortComponent = null;
  #showMoreButtonComponent = null;

  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(mainContainer, moviesModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    this.#filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const defaultFilteredMovies = filter[this.#filterType](movies);
    const filteredMovies = defaultFilteredMovies.slice();

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort((current, next) => next.filmInfo.release.date - current.filmInfo.release.date);
      case SortType.RATING:
        return filteredMovies.sort((current, next) => next.filmInfo.totalRating - current.filmInfo.totalRating);
    }

    return defaultFilteredMovies;
  }

  init = () => {
    render(this.#movieListComponent, this.#movieListContainerComponent, RenderPosition.AFTERBEGIN);
    render(this.#movieSectionComponent, this.#movieListComponent, RenderPosition.BEFOREEND);
    render(this.#mainContainer, this.#movieSectionComponent, RenderPosition.AFTEREND);

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  destroy = () => {
    this.#clearBoard({resetRenderedTaskCount: true, resetSortType: true});

    remove(this.#movieListComponent);

    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        try {
          await this.#moviesModel.updateMovie(updateType, update);
        } catch {
          // todo
          this.#moviePresenter.get(update.id).setViewState(MoviePresenterViewState.ABORTING, update);
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#moviePresenter.get(update.id).setViewState(MoviePresenterViewState.ADDING_COMMENT, update);
        try {
          await this.#moviesModel.addComment(updateType, update);
        } catch {
          this.#moviePresenter.get(update.id).setViewState(MoviePresenterViewState.ABORTING, update);
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#moviePresenter.get(update.id).setViewState(MoviePresenterViewState.DELETING_COMMENT, update);
        try {
          await this.#moviesModel.deleteComment(updateType, update);
        } catch {
          this.#moviePresenter.get(update.id).setViewState(MoviePresenterViewState.ABORTING, update);
        }

        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviePresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedMovieCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  }

  #renderLoading = () => {
    render(this.#movieListComponent, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #clearBoard = ({resetRenderedMovieCount = false, resetSortType = false} = {}) => {
    const movieCount = this.movies.length;

    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#noMovieComponent) {
      remove(this.#noMovieComponent);
    }

    if (resetRenderedMovieCount) {
      this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
    } else {
      this.#renderedMovieCount = Math.min(movieCount, this.#renderedMovieCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedTaskCount: true});
    this.#renderBoard();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#mainContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#movieListContainerComponent, this.#handleViewAction, this.#handleModeChange);
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  }

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie));
  }

  #handleShowMoreButtonClick = () => {
    const movieCount = this.movies.length;
    const newRenderedMovieCount = Math.min(movieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedMovieCount, newRenderedMovieCount);

    this.#renderMovies(movies);
    this.#renderedMovieCount = newRenderedMovieCount;

    if (this.#renderedMovieCount >= movieCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);

    render(this.#movieListComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  #renderNoMovies = () => {
    this.#noMovieComponent = new NoMovieView(this.#filterType);
    render(this.#movieListComponent, this.#noMovieComponent, RenderPosition.AFTERBEGIN);
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const movies = this.movies;
    const movieCount = movies.length;

    if (movieCount === 0) {
      this.#renderNoMovies();
      return;
    }

    this.#renderSort();
    this.#renderMovies(movies.slice(0, Math.min(movieCount, this.#renderedMovieCount)));

    if (movieCount > this.#renderedMovieCount) {
      this.#renderShowMoreButton();
    }
  }
}
