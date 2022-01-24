export const createFilmCardControlsTemplate = ({watchlist, alreadyWatched, favorite}) => {
  const controlButtonClass = 'film-card__controls-item';

  return (
    `<div class="film-card__controls">
    <button class="${controlButtonClass} ${controlButtonClass}--add-to-watchlist ${watchlist ? `${controlButtonClass}--active` : ''}" type="button">Add to watchlist</button>
    <button class="${controlButtonClass} ${controlButtonClass}--mark-as-watched ${alreadyWatched ? `${controlButtonClass}--active` : ''}" type="button">Mark as watched</button>
    <button class="${controlButtonClass} ${controlButtonClass}--favorite ${favorite ? `${controlButtonClass}--active` : ''}" type="button">Mark as favorite</button>
    </div>`
  );

};
