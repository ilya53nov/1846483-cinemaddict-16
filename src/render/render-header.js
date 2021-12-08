import {render, RenderPosition} from '../render.js';
import UserRankView from '../view/user-rank-view';
import {filters} from '../mock/get-generate-date.js';

const siteHeaderElement = document.querySelector('.header');

// Функция для получения количества просмотренных фильмов
const getHistoryFilterCount = (filtersItem) => {
  const historyFilter = filtersItem.filter(({name}) => name === 'History');

  return historyFilter[0].count;
};

export const renderHeader = () => {
  // Отрисовка звания пользователя
  render(siteHeaderElement, new UserRankView(getHistoryFilterCount(filters)).element, RenderPosition.BEFOREEND);

};
