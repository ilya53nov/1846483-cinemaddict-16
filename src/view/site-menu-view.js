import AbstractView from './abstract-view.js';
import { createFilterTemplate } from './filter-view.js';

const createNavigationTemplate = (filter) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${createFilterTemplate(filter)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class MenuView extends AbstractView{
  #filter = null;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createNavigationTemplate(this.#filter);
  }
}
