const DECIMAL_PLACES = 1;

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return +(lower + Math.random() * (upper - lower + 1)).toFixed(DECIMAL_PLACES);
};

export const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const getRandomItem = (items) => items[getRandomInteger(items.length - 1)];

export const getRandomItems = (items) => items.slice(0, getRandomInteger(1, items.length - 1));

export const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const getCreatedElement = (elementName, className) => {
  const element = document.createElement(`${elementName}`);
  element.classList.add(`${className}`);

  return element;
};

export const getListTemplate = (items, template) => (
  items
    .map((item) => template(item))
    .join('')
);

export const getHistoryFilterCount = (filtersItem) => {
  const historyFilter = filtersItem.filter(({name}) => name === 'History');

  return historyFilter[0].count;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

