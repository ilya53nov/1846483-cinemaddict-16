import AbstractObservable from '../utils/abstract-observable.js';

export default class MoviesModel extends AbstractObservable {
  #movies = [];

  set movies(movies) {
    this.#movies = [...movies];
  }

  get movies() {
    return this.#movies;
  }

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addComment = (updateType, update) => {

    update.comments.push(update.newComment);

    delete update.newComment;

    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t add unexisting comment');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  deleteComment = (updateType, update) => {
    const commentsCurrentMovie = update.comments;
    const filteredComments = commentsCurrentMovie.filter((comment) => comment.id !== update.deleteComment);

    delete update.deleteComment;

    update.comments = filteredComments;

    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

}
