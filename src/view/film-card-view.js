import AbstractView from './abstract-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {createFilmCardControlsTemplate} from './film-card-controls-view.js';

dayjs.extend(duration);

const MAX_LENGTH_DESCRIPTION = 140;

const createFilmCardTemplate = (movie) => {
  const {filmInfo, comments, userDetails} = movie;
  const {description, poster, title, totalRating, genre, runtime, release} = filmInfo;
  const {date} = release;

  return (
    `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${dayjs(date).year()}</span>
        <span class="film-card__duration">${dayjs.duration(runtime, 'minutes').format(`${runtime > 60 ? 'H[h] m[m]' : 'm[m]'}`)}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description.length > MAX_LENGTH_DESCRIPTION ? `${description.substring(0, MAX_LENGTH_DESCRIPTION - 1)}...` : description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    ${createFilmCardControlsTemplate(userDetails)}
  </article>`);
};

export default class MovieCardView extends AbstractView{
  #movie = null;

  constructor(movie){
    super();
    this.#movie = movie;
  }

  get template() {
    return createFilmCardTemplate(this.#movie);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      evt.preventDefault();
      this._callback.click();
    }

  }

}
