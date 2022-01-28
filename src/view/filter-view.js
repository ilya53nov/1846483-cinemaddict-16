import { getListTemplate } from '../utils/utils.js';
import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a href="#${String(name).toLowerCase()}" name="${type}" class="main-navigation__item${type === currentFilterType ? ' main-navigation__item--active' : ''}">${type === FilterType.ALL ? 'All movies' : name} ${type !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ''} </a>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<div class="main-navigation__items">
    ${filterItemsTemplate}
    </div>`
  );
};

export default class FilterView extends AbstractView{
  #filter = null;
  #currentFilter = null;

  constructor(filter, currentFilterType) {
    super();
    this.#filter = filter;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filter, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'A') {
      evt.preventDefault();
      this._callback.filterTypeChange(evt.target.name);
    }


  }
}
