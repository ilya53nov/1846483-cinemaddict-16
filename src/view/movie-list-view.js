import AbstractView from './abstract-view.js';

const createMovieListTemplate = () => '<section class="films-list"></section>';

export default class MovieListView extends AbstractView {
  get template() {
    return createMovieListTemplate();
  }
}
