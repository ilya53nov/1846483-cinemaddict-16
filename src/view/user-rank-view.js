import AbstractView from './abstract-view.js';
import {userRanks} from '../const.js';

const getUserRank = (value) => {
  for (const {name, min, max} of userRanks) {
    if (value >= min && value <= max) {
      return name;
    }
  }
};

const createUserRankTemplate = (value) => (
  `<section class="header__profile profile">
    ${value > 0
    ? `<p class="profile__rating">${getUserRank(value)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">`
    : ''}
  </section>`
);

export default class UserRankView extends AbstractView{
  #value = null;

  constructor(value) {
    super();
    this.#value = value;
  }

  get template() {
    return createUserRankTemplate(this.#value);
  }
}
