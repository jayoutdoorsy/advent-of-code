import { join } from 'path';
import { getDirname, isValidNumber, readFileRows, split } from '../../util.js';
import { parseGame as funParseGame } from './fun-alternative/parseGame.js';

// The bag contains only this many cubes of each color.
// Some games will not be possible.
const MAX_CUBE_COUNTS = {
  blue: 14,
  green: 13,
  red: 12,
};
const ALLOWED_COLORS = Object.keys(MAX_CUBE_COUNTS);

const _parseGame = row => {
  const [title, roundsStr] = split(row, ':');
  const [, id] = split(title, ' ');
  if (!id || !isValidNumber(id)) {
    throw new Error('Unexpected edge case, game missing id');
  }
  const rounds = split(roundsStr, ';').map(roundStr => {
    const cubes = split(roundStr, ',');
    return cubes.reduce((counts, cubeStr) => {
      const [count, color] = split(cubeStr, ' ');
      if (!count || !isValidNumber(count)) {
        throw new Error('Unexpected edge case, invalid game round count');
      }
      if (!ALLOWED_COLORS.includes(color)) {
        throw new Error('Unexpected edge case, unknown color');
      }
      counts[color] = (counts[color] || 0) + Number(count);
      return counts;
    }, {});
  });

  return {
    id: Number(id),
    rounds,
  };
};

const getMinimumPowerOfGame = game => {
  // minimum number of cubes per color
  const counts = ALLOWED_COLORS.reduce((zeroes, color) => {
    zeroes[color] = 0;
    return zeroes;
  }, {});
  game.rounds.forEach(round => {
    Object.keys(round).forEach(color => {
      counts[color] = Math.max(counts[color], round[color]);
    });
  });
  return ALLOWED_COLORS.reduce((product, color) => counts[color] * product, 1);
};

const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path);
  const games = rows.map(funParseGame);
  // For part 1
  const total = games.reduce((sum, game) => {
    const gameHasIllegalRound = game.rounds.some(round => {
      return Object.keys(round).some(color => round[color] > MAX_CUBE_COUNTS[color]);
    });
    return gameHasIllegalRound ? sum : sum + game.id;
  }, 0);
  console.log(total);
  // For part 2
  const powerPerGame = games.map(getMinimumPowerOfGame);
  const powerSum = powerPerGame.reduce((sum, val) => val + sum, 0);
  console.log(powerSum);
};

main();
