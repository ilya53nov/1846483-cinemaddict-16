import FilterView from '../view/filter-view.js';
import UserRankView from '../view/user-rank-view.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #userRankContainer = null;
  #filterModel = null;
  #moviesModel = null;

  #filterComponent = null;
  #userRankComponent = null;

  constructor(filterContainer, filterModel, moviesModel, userRankContainer) {
    this.#filterContainer = filterContainer;
    this.#userRankContainer = userRankContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const movies = this.#moviesModel.movies;

    return [
      {
        type: FilterType.ALL,
        name: 'All',
        count: filter[FilterType.ALL](movies).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }

  countHistory() {
    return filter[FilterType.HISTORY](this.#moviesModel.movies).length;
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    const prevUserRankComponent = this.#userRankComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#userRankComponent = new UserRankView(this.countHistory());
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    if (prevFilterComponent === null) {
      render(this.#userRankContainer, this.#userRankComponent, RenderPosition.BEFOREEND);
      render(this.#filterContainer, this.#filterComponent, RenderPosition.AFTERBEGIN);

      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    replace(this.#userRankComponent, prevUserRankComponent);
    remove(prevFilterComponent);
    remove(prevUserRankComponent);
  }

  destroy = () => {
    remove(this.#filterComponent);
    this.#filterComponent = null;

    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);

    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
