import AbstractView from './abstract-view.js';
//import { createFilterTemplate } from './filter-view.js';

const createNavigationTemplate = () => (
  `<nav class="main-navigation">

    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class MenuView extends AbstractView{
  //#filter = null;

  //constructor(filter) {
  //  super();
  //  this.#filter = filter;
  //}

  get template() {
    return createNavigationTemplate();
  }
}
