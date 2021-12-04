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

export const getListTemplate = (items, template) => (
  items
    .map((item) => template(item))
    .join('')
);
