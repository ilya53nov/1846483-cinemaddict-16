import { generateMovie} from './generate.js';
import { generateFilter } from './filter.js';

const FILM_COUNT = 0;

export const movies = Array.from({length: FILM_COUNT}, generateMovie);

export const filters = generateFilter(movies);
