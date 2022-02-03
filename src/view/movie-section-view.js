import AbstractView from './abstract-view.js';

const createMovieSectionTemplate = () => '<section class="films"></section>';

export default class MovieSectionView extends AbstractView {
  get template() {
    return createMovieSectionTemplate();
  }
}
