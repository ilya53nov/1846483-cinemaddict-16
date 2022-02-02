import AbstractView from './abstract-view.js';

const createNoMovieTemplate = () => (
  `<h2 class="films-list__title">
  Loading...
  </h2>`
);

export default class LoadingView extends AbstractView {
  get template() {
    return createNoMovieTemplate();
  }
}
