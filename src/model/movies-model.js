import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';

export default class MoviesModel extends AbstractObservable {
  #apiService = null;
  #movies = [];

  constructor(apiServise) {
    super();
    this.#apiService = apiServise;
  }

  set movies(movies) {
    this.#movies = [...movies];
  }

  get movies() {
    return this.#movies;
  }

  loadMovies = async (updateType, update) => {
    try {
      const movies = await this.#apiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }

    this._notify(updateType, update);
  }

  init = async () => await this.loadMovies(UpdateType.INIT);

  updateMovie = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#apiService.updateMovie(update);
      const updatedMovie = this.#adaptToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedMovie,
        ...this.#movies.slice(index + 1),
      ];

      this._notify(updateType, updatedMovie);

    } catch (err) {
      throw new Error('Can\'t update movie');
    }
  }

  addComment = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t add unexisting comment');
    }

    try {
      const response = await this.#apiService.addComment(update);
      const newMovie = this.#adaptToClientFromAddComment(response);

      this.#movies = [
        ...this.#movies.slice(0, index),
        newMovie,
        ...this.#movies.slice(index + 1),
      ];

      this._notify(updateType, newMovie);

    } catch {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    const commentsCurrentMovie = update.comments;
    const filteredComments = commentsCurrentMovie.filter((comment) => comment !== update.deleteComment);

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(update.deleteComment);

      update.comments = filteredComments;

      this._notify(updateType, update);

    } catch {
      throw new Error('Can\'t delete comment');
    }
  }

  #adaptToClientFromAddComment = (response) => {
    const {movie, comments} = response;

    const adaptedMovie = this.#adaptToClient(movie);

    adaptedMovie.loadedComments = comments;

    return adaptedMovie;
  }

  #adaptToClient = (movie) => {
    const adaptedMovie = {...movie,
      filmInfo: {
        actors: movie['film_info']['actors'],
        ageRating: movie['film_info']['age_rating'],
        alternativeTitle: movie['film_info']['alternative_title'],
        description: movie['film_info']['description'],
        director: movie['film_info']['director'],
        genre: movie['film_info']['genre'],
        poster: movie['film_info']['poster'],
        release: {
          date: movie['film_info']['release']['date'] !== null ? new Date(movie['film_info']['release']['date']) : movie['film_info']['release']['date'],
          releaseCountry: movie['film_info']['release']['release_country'],
        },
        runtime: movie['film_info']['runtime'],
        title: movie['film_info']['title'],
        totalRating: movie['film_info']['total_rating'],
        writers: movie['film_info']['writers'],
      },
      userDetails: {
        watchingDate: movie['user_details']['watching_date'] !== null ? new Date(movie['user_details']['watching_date']) : movie['user_details']['watching_date'],
        alreadyWatched: movie['user_details']['already_watched'],
        favorite: movie['user_details']['favorite'],
        watchlist: movie['user_details']['watchlist'],
      },
    };

    delete adaptedMovie['film_info'];
    delete adaptedMovie['user_details'];

    return adaptedMovie;
  }
}
