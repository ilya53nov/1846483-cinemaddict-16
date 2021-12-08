import { createFilterTemplate } from './filter-view.js';
import { createElement } from '../render.js';

const createNavigationTemplate = (filter) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${createFilterTemplate(filter)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class MenuView{
  #element = null;
  #filter = null;

  constructor(filter) {
    this.#filter = filter;
  }

  get element(){
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNavigationTemplate(this.#filter);
  }

  removeElement() {
    this.#element = null;
  }
}

