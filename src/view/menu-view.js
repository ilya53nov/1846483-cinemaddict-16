import AbstractView from './abstract-view.js';
import {MenuItem} from '../const.js';
import {findAndRemoveClass} from '../utils/utils.js';

const createNavigationTemplate = () => (
  `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional" data-menu="${MenuItem.STATISTICS}">Stats</a>
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
    if (evt.target.tagName === 'A' || evt.target.tagName === 'SPAN') {

      const currentClassName = evt.target.className;

      evt.target.className = `${currentClassName} ${currentClassName}--active`;

      if (evt.target.dataset.menu === MenuItem.STATISTICS) {
        const mainNavigationItems = document.querySelectorAll('.main-navigation__item');

        mainNavigationItems.forEach((item) => {
          findAndRemoveClass(item, 'main-navigation__item--active');
        });

        this._callback.menuClick(MenuItem.STATISTICS);
      } else {
        const mainNavigationAdditional = document.querySelector('.main-navigation__additional');

        findAndRemoveClass(mainNavigationAdditional, 'main-navigation__additional--active');

        this._callback.menuClick(MenuItem.MOVIES);
      }
    }
  }
}
