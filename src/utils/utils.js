export const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const isCtrlKey = (evt) => evt.key === 'Control';

export const isEnterKey = (evt) => evt.key === 'Enter';

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
