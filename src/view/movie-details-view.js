import he from 'he';
import SmartView from './smart-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {getListTemplate} from '../utils/utils.js';
import {isEscapeKey, isCtrlKey, isEnterKey, isMetaKey} from '../utils/utils.js';
import {UserAction, UpdateType} from '../const.js';

dayjs.extend(duration);

const SHAKE_ANIMATION_TIMEOUT = 600;

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];

const createMovieDetailsCommentTemplate = (loadedComments, deleteComment, isDeletingComment) => {

  const {emotion, comment, author, date, id} = loadedComments;

  return (
    `<li ${deleteComment === id && isDeletingComment ? `data-id="${id}"` : ''} class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD HH:MM')}</span>
        <button ${deleteComment === id && isDeletingComment ? 'disabled' : ''} id="${id}" class="film-details__comment-delete">${deleteComment === id && isDeletingComment ? 'Deleting...' : 'Delete'}</button>
      </p>
    </div>
  </li>`
  );
};

const createMovieDetailsCommentListTemplate = (loadedComments, deleteComment, isDeletingComment) => {
  const commentListTemplate = loadedComments
    .map((comment) => createMovieDetailsCommentTemplate(comment, deleteComment, isDeletingComment))
    .join('');

  return (
    `<ul class="film-details__comments-list">
    ${commentListTemplate}
    </ul>`
  );
};

const createMovieDetailsGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;

const createMovieDetailsGenreListTemplate = (genres) => getListTemplate(genres, createMovieDetailsGenreTemplate);

const createMovieDetailsTableRowTemplate = (term, cell) => (
  `<tr class="film-details__row">
  <td class="film-details__term">${term}</td>
  <td class="film-details__cell">${cell}</td>
  </tr>`
);

const createMovieDetailsEmojiTemplate = (emoji, selectedEmoji) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${emoji === selectedEmoji ? 'checked = true' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`
);

const createMovieDetailsControlsTemplate = ({isFavorite, isWatched, isWatchlist}) => {
  const controlButtonClass = 'film-details__control-button';

  return (
    `<button type="button" class="${controlButtonClass} ${controlButtonClass}--watchlist ${isWatchlist ? `${controlButtonClass}--active` : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="${controlButtonClass} ${controlButtonClass}--watched ${isWatched ? `${controlButtonClass}--active` : ''}" id="watched" name="watched">Already watched</button>
    <button type="button" class="${controlButtonClass} ${controlButtonClass}--favorite ${isFavorite ? `${controlButtonClass}--active` : ''}" id="favorite" name="favorite">Add to favorites</button>`
  );
};

const createMovieDetailsEmojiListTemplate = (selectedEmoji) => ( //getListTemplate(EMOTIONS, createFilmDetailsEmojiTemplate);
  EMOTIONS
    .map((emotion) => createMovieDetailsEmojiTemplate(emotion, selectedEmoji))
    .join('')
);

const createMovieDetailsTemplate = (data) => {
  const {
    filmInfo,
    emoji,
    loadedComments,
    comments,
    comment,
    isLoadComments,
    isFavorite,
    isWatched,
    isWatchlist,
    deleteComment,
    isDeletingComment
  } = data;
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
            ${createMovieDetailsTableRowTemplate('Director', director)}
            ${createMovieDetailsTableRowTemplate('Writers', writers.join(', '))}
            ${createMovieDetailsTableRowTemplate('Actors', actors.join(', '))}
            ${createMovieDetailsTableRowTemplate('Release Date', dayjs(date).format('DD MMMM YYYY'))}
            ${createMovieDetailsTableRowTemplate('Runtime', dayjs.duration(runtime, 'minutes').format(`${runtime > 60 ? 'H[h] m[m]' : 'm[m]'}`))}
            ${createMovieDetailsTableRowTemplate('Country', releaseCountry)}
            ${createMovieDetailsTableRowTemplate(`${genre.length > 1 ? 'Genres' : 'Genre'}`, createMovieDetailsGenreListTemplate(genre))}
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        ${createMovieDetailsControlsTemplate({isFavorite, isWatched, isWatchlist})}


      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>



        <ul class="film-details__comments-list">
        ${isLoadComments ? createMovieDetailsCommentListTemplate(loadedComments, deleteComment, isDeletingComment): '<p class="film-details__comment-text">Loading...</p>'}

        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}" id="${emoji}"></img>` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment ? comment : ''}</textarea>
          </label>

          <div class="film-details__emoji-list">
          ${createMovieDetailsEmojiListTemplate(emoji)}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`);
};

const keyHandler = {
  control: {
    down: false,
  },

  enter: {
    down: false,
  },

  meta: {
    down: false,
  }
};

export default class MovieDetailsView extends SmartView{
  #scrollTop = null;
  #changeData = null;

  constructor(movie, changeData){
    super();
    this.#changeData = changeData;
    this._data = movie;
    this.#setInnerHandlers();
  }

  get template() {
    return createMovieDetailsTemplate(this._data);
  }

  getScrollTop = () => this.#scrollTop;

  setScrollHandler = (callback) => {
    this._callback.scroll = callback;
    this.element.addEventListener('scroll', this.#scrollHandler);
  }

  #scrollHandler = () => {
    this.#scrollTop = this.element.scrollTop;
    this._callback.scroll();
  }

  #emojiClickHandler = (evt) => {
    if (evt.target.classList.contains('film-details__emoji-item')) {
      const comment = this.element.querySelector('.film-details__comment-input').value;
      this.updateData({emoji: evt.target.value, comment: comment});
    }
  }

  #watchedToggleHandler = (evt) => {
    evt.preventDefault();
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {...this._data, isWatched: !this._data.userDetails.alreadyWatched}
    );
  }

  #watchlistTogglekHandler = (evt) => {
    evt.preventDefault();
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {...this._data, isWatchlist: !this._data.userDetails.watchlist}
    );
  }

  #favoriteToggleHandler = (evt) => {
    evt.preventDefault();
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {...this._data, isFavorite: !this._data.userDetails.favorite}
    );
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      this.#closePopupHandler();
    }
  }

  #keyDownHandler = (evt) => {
    if (isCtrlKey(evt)) {
      keyHandler.control.down = true;
    }

    if (isMetaKey(evt)) {
      keyHandler.meta.down = true;
    }

    if (isEnterKey(evt)) {
      keyHandler.enter.down = true;
    }

    if (isEscapeKey(evt)) {
      this.#closePopupHandler();
    }

    if ((keyHandler.meta.down || keyHandler.control.down) && keyHandler.enter.down) {
      keyHandler.control.down = false;
      keyHandler.enter.down = false;
      keyHandler.meta.down = false;
      this.#submitForm();
    }
  }

  #keyUpHandler = (evt) => {
    if (isCtrlKey(evt)) {
      keyHandler.control.down = false;
    }

    if (isEnterKey(evt)) {
      keyHandler.enter.down = false;
    }
  }

  #submitForm = () => {
    const comment = this.element.querySelector('.film-details__comment-input').value;
    const emotionContainer = this.element.querySelector('.film-details__add-emoji-label');
    const imgEmotionContainer = emotionContainer.querySelector('img');
    let emotion = null;

    if (imgEmotionContainer) {
      emotion = imgEmotionContainer.id;
    }

    if (!comment || !emotion) {
      return;
    }

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {...this._data, emoji: emotion, comment: comment}
    );
  }

  setEscKeyDownHandler = (callback) => {
    this._callback.escKeyDownHandler = callback;
  }

  #closePopupHandler = () => {
    document.body.className = '';
    this.updateData({emoji: '', comment: ''}, true);
    this.element.remove();

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    document.removeEventListener('keydown', this._callback.escKeyDownHandler);
  }

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'BUTTON') {

      this.#changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        {...this._data, deleteComment: evt.target.id}
      );
    }
  }

  #setInnerHandlers = () => {
    this._data = MovieDetailsView.parseMovieToData(this._data);

    this.element.querySelector('#watched').addEventListener('click', this.#watchedToggleHandler);
    this.element.querySelector('#watchlist').addEventListener('click', this.#watchlistTogglekHandler);
    this.element.querySelector('#favorite').addEventListener('click', this.#favoriteToggleHandler);
    this.element.addEventListener('scroll', this.#scrollHandler);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupHandler);
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#deleteCommentHandler);
    this.element.addEventListener('keydown', this.#keyDownHandler);
    this.element.addEventListener('keyup', this.#keyUpHandler);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
  }

  setShakeEffectComment = (callback) => {
    const commentElement = this.element.querySelector(`.film-details__comment[data-id="${this._data.deleteComment}"]`);

    commentElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.element.style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  static parseMovieToData = (movie) => ({
    ...movie,
    isWatched: movie.userDetails.alreadyWatched,
    isWatchlist: movie.userDetails.watchlist,
    isFavorite: movie.userDetails.favorite,
  });
}
