const userRanks = [
  {
    name: 'Novice',
    min: 1,
    max: 10,
  },

  {
    name: 'Fun',
    min: 11,
    max: 20,
  },

  {
    name: 'Movie Buff',
    min: 21,
    max: Infinity,
  },
];

const getUserRank = (value) => {
  for (const {name, min, max} of userRanks) {
    if (value >= min && value <= max) {
      return name;
    }
  }
};

export const createUserRankTemplate = (value) => (
  `<section class="header__profile profile">
    ${value > 0
    ? `<p class="profile__rating">${getUserRank(value)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">`
    : ''}
  </section>`
);
