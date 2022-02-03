export const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const isMetaKey = (evt) => evt.metaKey;

export const isCtrlKey = (evt) => evt.key === 'Control';

export const isEnterKey = (evt) => evt.key === 'Enter';

export const getListTemplate = (items, template) => (
  items
    .map((item) => template(item))
    .join('')
);

export const findAndRemoveClass = (element, className) => {
  const isСontains = element.classList.contains(className);

  if (isСontains) {
    element.classList.remove(className);
  }
};
