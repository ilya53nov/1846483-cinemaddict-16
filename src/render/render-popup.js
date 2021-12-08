import FilmDetailsView from '../view/film-details-view.js';
import {isEscapeKey} from '../utils.js';

// Обработчик закрытия попапа
const onClosePopup = () => {
  document.body.classList.toggle('hide-overflow');

  const filmDetailsElement = document.querySelector('.film-details');

  document.body.removeChild(filmDetailsElement);

  document.removeEventListener('keydown', onEscapeKeyDown);
};

// Обработчик нажатия клавиши Esc
function onEscapeKeyDown(evt) {
  if (isEscapeKey(evt)) {
    onClosePopup();
  }
}

// Обработчик открытия попапа
export const showPopup = (movie) => {
  const filmDetailsViewComponent = new FilmDetailsView(movie).element;
  const closeButtonFilmDetailsView = filmDetailsViewComponent.querySelector('.film-details__close-btn');

  const footer = document.querySelector('.footer');

  document.body.classList.toggle('hide-overflow');

  footer.after(filmDetailsViewComponent);

  closeButtonFilmDetailsView.addEventListener('click', onClosePopup);
  document.addEventListener('keydown', onEscapeKeyDown);
};
