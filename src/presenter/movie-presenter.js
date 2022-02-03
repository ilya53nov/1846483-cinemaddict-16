import MovieCardView from '../view/movie-card-view.js';
import MovieDetailsView from '../view/movie-details-view.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {isEscapeKey} from '../utils/utils.js';
import {UserAction, UpdateType, Server} from '../const.js';
import ApiService from '../api-service.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export const State = {
  ABORTING: 'ABORTING',
  DELETING_COMMENT: 'DELETING_COMMENT',
  ADDING_COMMENT: 'ADDING_COMMENT',
  UPDATE_MOVIE: 'UPDATE_MOVIE',
};

const popup = {
  showed: null,
};

export default class MoviePresenter {
  #movieListContainer = null;
  #changeData = null;
  #apiService = null;
  #comments = [];

  #movieComponent = null;
  #moviePopupComponent = null;
  #scrollTopMoviePopup = null;

  #movie = null;
  #mode = Mode.DEFAULT;

  constructor(movieListContainer, changeData){
    this.#movieListContainer = movieListContainer;
    this.#changeData = changeData;
  }

  init = (movie) => {
    this.#movie = movie;

    this.#apiService = new ApiService(Server.END_POINT, Server.AUTHORIZATION);

    const prevMovieComponent = this.#movieComponent;
    const prevMoviePopupComponent = this.#moviePopupComponent;

    this.#movieComponent = new MovieCardView(this.#movie);

    this.#moviePopupComponent = new MovieDetailsView(this.#movie, this.#changeData);

    this.#movieComponent.setClickHandler(this.#handleShowPopup);

    this.#movieComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#movieComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#movieComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

    if (prevMovieComponent === null || prevMoviePopupComponent === null) {
      render(this.#movieListContainer, this.#movieComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      this.#handleClosePopup();

      render(prevMovieComponent, this.#movieComponent, RenderPosition.AFTEREND);
      remove(prevMovieComponent);
    }

    if (this.#mode === Mode.POPUP) {
      this.#handleShowPopup();

      render(prevMovieComponent, this.#movieComponent, RenderPosition.AFTEREND);
      remove(prevMovieComponent);
    }
  }

  destroy  = () => {
    remove(this.#movieComponent);
    remove(this.#moviePopupComponent);
  }

setViewState = (state, data) => {
  const resetFormState = () => {
    delete data.deleteComment;
    this.#moviePopupComponent.updateData({
      data,
      isDeletingComment: false,
      isAddingComment:false,
    });
  };

  const popupData = this.#moviePopupComponent.getData();

  switch (state) {
    case State.UPDATE_MOVIE:
      if (this.#mode === Mode.POPUP) {
        this.#moviePopupComponent.updateData({
          data,
        });
      }

      break;
    case State.ADDING_COMMENT:
      this.#moviePopupComponent.updateData({
        ...data,
        isAddingComment: true,
      });
      break;
    case State.DELETING_COMMENT:
      this.#moviePopupComponent.updateData({
        ...data,
        isDeletingComment: true
      });
      break;
    case State.ABORTING:
      if (this.#mode === Mode.POPUP) {
        if (popupData.isDeletingComment) {
          this.#moviePopupComponent.setShakeEffectComment(resetFormState);
          break;
        }
        if (popupData.isAddingComment) {
          this.#moviePopupComponent.setShakeEffect(resetFormState);
          break;
        }
        this.#moviePopupComponent.setShakeEffect(resetFormState);
      } else {
        this.#movieComponent.setShakeEffect(resetFormState);
      }

      break;
  }
}

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      this.#handleClosePopup();
    }
  }

  #handleClosePopup = () => {
    document.body.className = '';
    remove(this.#moviePopupComponent);

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #loadComments = async () => {
    try {
      this.#comments = await this.#apiService.getComments(this.#movie);
      this.#moviePopupComponent.updateData({isLoadComments: true, loadedComments: this.#comments});

    } catch {
      this.#comments = [];
    }
  }

  #handleShowPopup = () => {
    this.#loadComments();

    const footer = document.querySelector('.footer');

    document.body.className = 'hide-overflow';

    if (popup.showed) {
      remove(popup.showed);
    }

    this.#moviePopupComponent.setScrollHandler(this.#handleScroll);

    render(footer, this.#moviePopupComponent, RenderPosition.AFTEREND);

    if (this.#scrollTopMoviePopup) {
      this.#moviePopupComponent.element.scroll(0, this.#scrollTopMoviePopup);
    }

    this.#moviePopupComponent.restoreHandlers();

    this.#moviePopupComponent.setEscKeyDownHandler(this.#escKeyDownHandler);

    document.addEventListener('keydown', this.#escKeyDownHandler);

    popup.showed = this.#moviePopupComponent;

    this.#mode = Mode.POPUP;
  }

  #handleScroll = () => {
    this.#scrollTopMoviePopup = this.#moviePopupComponent.getScrollTop();
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, isFavorite: !this.#movie.userDetails.favorite}
    );
  }

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, isWatched: !this.#movie.userDetails.alreadyWatched}
    );
  }

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, isWatchlist: !this.#movie.userDetails.watchlist}
    );
  }
}
