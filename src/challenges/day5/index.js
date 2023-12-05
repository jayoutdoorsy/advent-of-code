import { join } from 'path';
import { getDirname, readFileRows, parseNumbers } from '../../util.js';

const getSeedsAndMaps = rows => {
  const rangesMatrix = [];
  const seedRanges = []; // part 2
  const seeds = []; // part 1
  rows.forEach((row, i) => {
    if (!i) {
      seeds.push(...parseNumbers(row));
      seeds.forEach((num, i) => {
        !(i % 2) && seedRanges.push([num, num + seeds[i + 1] - 1]);
      });
    } else if (row.indexOf('map') > -1) {
      rangesMatrix.push([]);
    } else {
      rangesMatrix[rangesMatrix.length - 1].push(parseNumbers(row));
    }
  });
  return { seeds, seedRanges, rangesMatrix };
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
  // part 1
  const seedsToLocations = data.seeds.map(seed => getLocation(seed, data.rangesMatrix));
  console.log(Math.min(...seedsToLocations));
  // part 2
};

main();
