import FilmDetailsView from '../view/film-details-view.js';
import {isEscapeKey} from '../utils/utils.js';
import { render, RenderPosition } from '../utils/render.js';

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
  const filmDetailsViewComponent = new FilmDetailsView(movie);

  const footer = document.querySelector('.footer');

  document.body.classList.toggle('hide-overflow');

  render(footer, filmDetailsViewComponent, RenderPosition.AFTEREND);

  filmDetailsViewComponent.setClickHandler(() => onClosePopup());

  document.addEventListener('keydown', onEscapeKeyDown);
};
