import { createElement } from '../render.js';

const userRanks = [
  {
    name: 'Novice',
    min: 1,
    max: 10,
  },

  {
    name: 'Fun',
    min: 11,
    max: 20,
  },

  {
    name: 'Movie Buff',
    min: 21,
    max: Infinity,
  },
];

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

export default class UserRankView{
  #element = null;
  #value = 0;

  constructor(value){
    this.#value = value;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createUserRankTemplate(this.#value);
  }

  removeElement() {
    this.#element = null;
  }
}
