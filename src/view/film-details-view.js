import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getListTemplate } from '../utils.js';

dayjs.extend(duration);

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];

const createFilmDetailsCommentTemplate = (comments) => {
  const {emotion, comment, author, date} = comments;

  return (
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD HH:MM')}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
  );
};

const createFilmDetailsCommentListTemplate = (comments) => getListTemplate(comments, createFilmDetailsCommentTemplate);

const createFilmDetailsGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;

const createFilmDetailsGenreListTemplate = (genres) => getListTemplate(genres, createFilmDetailsGenreTemplate);

const createFilmDetailsTableRowTemplate = (term, cell) => (
  `<tr class="film-details__row">
  <td class="film-details__term">${term}</td>
  <td class="film-details__cell">${cell}</td>
  </tr>`
);

const createFilmDetailsEmojiTemplate = (emoji) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`
);

const createFilmDetailsEmojiListTemplate = () => getListTemplate(EMOTIONS, createFilmDetailsEmojiTemplate);

export const createFilmDetailsTemplate = (movie) => {
  const {filmInfo, comments} = movie;
  const {
    description,
    poster,
    title,
    totalRating,
    genre,
    runtime,
    release,
    ageRating,
    director,
    writers,
    actors
  } = filmInfo;
  const {date, releaseCountry} = release;

  return (
    `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            ${createFilmDetailsTableRowTemplate('Director', director)}
            ${createFilmDetailsTableRowTemplate('Writers', writers.join(', '))}
            ${createFilmDetailsTableRowTemplate('Actors', actors.join(', '))}
            ${createFilmDetailsTableRowTemplate('Release Date', dayjs(date).format('DD MMMM YYYY'))}
            ${createFilmDetailsTableRowTemplate('Runtime', dayjs.duration(runtime, 'minutes').format(`${runtime > 60 ? 'H[h] m[m]' : 'm[m]'}`))}
            ${createFilmDetailsTableRowTemplate('Country', releaseCountry)}
            ${createFilmDetailsTableRowTemplate(`${genre.length > 1 ? 'Genres' : 'Genre'}`, createFilmDetailsGenreListTemplate(genre))}
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>



        <ul class="film-details__comments-list">
        ${createFilmDetailsCommentListTemplate(comments)}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
          ${createFilmDetailsEmojiListTemplate()}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`);
};
