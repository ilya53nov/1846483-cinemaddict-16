import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart-view.js';
import {getGenreHistoryMovies, getAmountOfWatchedMinutes, getCountHistoryMovies, filterDataStatistics} from '../utils/statistics.js';
import {FilterTypeStatistics} from '../const.js';

const BAR_HEIGHT = 50;
const START_POSITION = 'start';
const FONT_SIZE = 20;
const PADDING = 100;
const OFFSET = 40;
const BAR_THICKNESS =24;

const Color = {
  YELLOW: '#ffe800',
  WHITE: '#ffffff',
};

const settingChart = {
  display: false,
  responsive: false,
  drawBorder: false,
  beginAtZero: true,
  enabled: false,
  type: 'horizontalBar',
};

const renderChart = (statisticCtx, movies) => {
  const historyMovies = getGenreHistoryMovies(movies, 'genres', 'counts');

  statisticCtx.height = BAR_HEIGHT * historyMovies.genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: settingChart.type,
    data: {
      labels: historyMovies.genres,
      datasets: [{
        data: historyMovies.counts,
        backgroundColor: Color.YELLOW,
        hoverBackgroundColor: Color.YELLOW,
        anchor: START_POSITION,
        barThickness: BAR_THICKNESS,
      }],
    },
    options: {
      responsive: settingChart.responsive,
      plugins: {
        datalabels: {
          font: {
            size: FONT_SIZE,
          },
          color: Color.WHITE,
          anchor: START_POSITION,
          align: START_POSITION,
          offset: OFFSET,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Color.WHITE,
            padding: PADDING,
            fontSize: FONT_SIZE,
          },
          gridLines: {
            display: settingChart.display,
            drawBorder: settingChart.drawBorder,
          },
        }],
        xAxes: [{
          ticks: {
            display: settingChart.display,
            beginAtZero: settingChart.beginAtZero,
          },
          gridLines: {
            display: settingChart.display,
            drawBorder: settingChart.drawBorder,
          },
        }],
      },
      legend: {
        display: settingChart.display,
      },
      tooltips: {
        enabled: settingChart.enabled,
      },
    },
  });
};

const createFilterItemTemplate = (filter, currentFilterType) => {
  const labelText = String(filter[0].toUpperCase() + filter.slice(1)).replace('-', ' ');

  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter}" value="${filter}" ${filter === currentFilterType ? 'checked=true': ''}>
  <label for="statistic-${filter}" class="statistic__filters-label">${labelText}</label>`
  );
};

const createFilterTemplate = (currentFilterType) => {
  const filterItemsTemplate = Object.values(FilterTypeStatistics)
    .map((value) => createFilterItemTemplate(value, currentFilterType))
    .join('');

  return (
    `<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    ${filterItemsTemplate}
    </form>`
  );
};

const createStatisticsTemplate = (movies, currentFilterType) => {
  const amountOfWatchedMinutes = getAmountOfWatchedMinutes(movies);
  const historyMovies = getGenreHistoryMovies(movies);

  const topGenre = historyMovies.genres[0];

  const userRating = document.querySelector('.profile__rating').textContent;

  const amountOfWatchedHour = dayjs.duration(amountOfWatchedMinutes, 'minutes').format('H');
  const remainingInMinutes = dayjs.duration(amountOfWatchedMinutes, 'minutes').format('m');


  const countHistoryMovies = getCountHistoryMovies(movies);

  return (
    `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${userRating}</span>
  </p>

    ${createFilterTemplate(currentFilterType)}

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${countHistoryMovies} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>

      <p class="statistic__item-text">${amountOfWatchedMinutes > 60 ? `${amountOfWatchedHour}<span class="statistic__item-description">h</span>${remainingInMinutes}<span class="statistic__item-description">m</span>` : `${amountOfWatchedMinutes}<span class="statistic__item-description">m</span>`}</p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre ? topGenre : ''}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`);
};

export default class StatisticsView extends SmartView {
  #chart = null;
  #filterType = FilterTypeStatistics.ALL;

  constructor (movies) {
    super();

    this._data = movies;

    this.#setInnerHandlers();

    this.#setChart();
  }

  get template() {
    return createStatisticsTemplate(filterDataStatistics[this.#filterType](this._data), this.#filterType);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#chart) {
      this.#chart.destroy();
      this.#chart = null;
    }
  }

  #handleYearClick = () => {
    this.#filterType = FilterTypeStatistics.YEAR;
    this.updateElement();
  }

  #handleMonthClick = () => {
    this.#filterType = FilterTypeStatistics.MONTH;
    this.updateElement();
  }

  #handleWeekClick = () => {
    this.#filterType = FilterTypeStatistics.WEEK;
    this.updateElement();
  }

  #handleTodayClick = () => {
    this.#filterType = FilterTypeStatistics.TODAY;
    this.updateElement();
  }

  #handleClick = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'LABEL') {
      switch (evt.target.control.value) {
        case FilterTypeStatistics.YEAR:
          this.#handleYearClick();
          break;
        case FilterTypeStatistics.MONTH:
          this.#handleMonthClick();
          break;
        case FilterTypeStatistics.WEEK:
          this.#handleWeekClick();
          break;
        case FilterTypeStatistics.TODAY:
          this.#handleTodayClick();
          break;
        default:
          this.#filterType = FilterTypeStatistics.ALL;
          this.updateElement();
      }
    }
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.statistic__filters').addEventListener('click', this.#handleClick);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setChart();
  }

  #setChart = () => {
    const movies = filterDataStatistics[this.#filterType](this._data);
    const statisticCtx = this.element.querySelector('.statistic__chart');

    this.#chart = renderChart(statisticCtx, movies);
  }
}
