import AbstractView from './abstract-view.js';
import {MenuItem} from '../const.js';

const createNavigationTemplate = () => (
  `<nav class="main-navigation">

    <a href="#stats" class="main-navigation__additional" id=${MenuItem.STATISTICS}>Stats</a>
  </nav>`
);

export default class MenuView extends AbstractView{

  get template() {
    return createNavigationTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'A') {
      if (evt.target.id === MenuItem.STATISTICS) {
        this._callback.menuClick(MenuItem.STATISTICS);
      } else {
        this._callback.menuClick(MenuItem.MOVIES);
      }
    }
  }
}
