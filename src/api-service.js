const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get movies() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = (movie) => this.#load({url: `comments/${movie.id}`}).then(ApiService.parseResponse);

  deleteComment = async (comment) => {
    const response = await this.#load({
      url: `comments/${comment}`,
      method: Method.DELETE,
    });

    return response;
  }

  addComment = async (movie) => {
    const response = await this.#load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify({comment: movie.comment, emotion: movie.emoji}),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  updateMovie = async (movie) => {
    const response = await this.#load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer = (movie) => {
    const adaptedMovie = {...movie,
      'film_info': {
        'actors' : movie.filmInfo.actors,
        'age_rating': movie.filmInfo.ageRating,
        'alternative_title': movie.filmInfo.alternativeTitle,
        'description': movie.filmInfo.description,
        'director': movie.filmInfo.director,
        'genre': movie.filmInfo.genre,
        'poster': movie.filmInfo.poster,
        'release': {
          'date': movie.filmInfo.release.date instanceof Date ? movie.filmInfo.release.date.toISOString() : null,
          'release_country': movie.filmInfo.release.releaseCountry,
        },
        'runtime': movie.filmInfo.runtime,
        'title': movie.filmInfo.title,
        'total_rating': movie.filmInfo.totalRating,
        'writers': movie.filmInfo.writers,
      },

      'user_details': {
        'watching_date': movie.userDetails.watchingDate instanceof Date ? movie.userDetails.watchingDate.toISOString() : null,
        'already_watched': movie.isWatched,
        'favorite': movie.isFavorite,
        'watchlist': movie.isWatchlist,
      },
    };

    delete adaptedMovie.filmInfo;
    delete adaptedMovie.userDetails;
    delete adaptedMovie.isWatched;
    delete adaptedMovie.isFavorite;
    delete adaptedMovie.isWatchlist;

    return adaptedMovie;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
