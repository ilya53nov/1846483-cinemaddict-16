
const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;

  return (
    `<a href="#${String(name).toLowerCase()}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

export const createFilterTemplate = (filterItems) => (
  filterItems
    .map((filter) => createFilterItemTemplate(filter))
    .join('')
);
