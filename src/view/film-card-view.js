import dayjs from 'dayjs';
import {getHoursAndMinutesFromMinutes} from '../utils.js';
import {createFilmCardControlsTemplate} from './film-card-controls-view.js';

const MAX_LENGTH_DESCRIPTION = 140;

export const createFilmCardTemplate = (movie) => {
  const {filmInfo, comments} = movie;
  const {description, poster, title, totalRating, genre, runtime, release} = filmInfo;
  const {date} = release;

  return (
    `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${dayjs(date).year()}</span>
        <span class="film-card__duration">${getHoursAndMinutesFromMinutes(runtime)}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description.length > MAX_LENGTH_DESCRIPTION ? `${description.substring(0, MAX_LENGTH_DESCRIPTION - 1)}...` : description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    ${createFilmCardControlsTemplate()}
  </article>`);
};
