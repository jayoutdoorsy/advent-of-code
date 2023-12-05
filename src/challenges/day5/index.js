import { join } from 'path';
import { getDirname, readFileRows, parseNumbers } from '../../util.js';

const getSeedsAndMaps = rows => {
  const rangesMatrix = [];
  const seeds = [];
  rows.forEach((row, i) => {
    if (!i) {
      seeds.push(...parseNumbers(row));
    } else if (row.indexOf('map') > -1) {
      rangesMatrix.push([]);
    } else {
      rangesMatrix[rangesMatrix.length - 1].push(parseNumbers(row));
    }
  });
  return { seeds, rangesMatrix };
};

const getLocation = (seed, rangesMatrix) => {
  return rangesMatrix.reduce((nextPos, ranges) => {
    for (const range of ranges) {
      if (nextPos >= range[1] && nextPos < range[1] + range[2]) {
        nextPos = nextPos + range[0] - range[1];
        break;
      }
    }
    return nextPos;
  }, seed);
};

const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path);
  const data = getSeedsAndMaps(rows);
  const seedsToLocations = data.seeds.map(seed => getLocation(seed, data.rangesMatrix));
  console.log(Math.min(...seedsToLocations));
};

main();
