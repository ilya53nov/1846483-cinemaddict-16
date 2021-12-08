import {movies} from '../mock/get-generate-date.js';

const siteFooterElement = document.querySelector('.footer');
const footerStatistics = siteFooterElement.querySelector('.footer__statistics');

export const renderFooter = () => {
  footerStatistics.textContent = movies.length;
};
