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
        !(i % 2) && seedRanges.push([num, num + seeds[i + 1]]);
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
  let nextPos = seed;
  let i = 0;
  let ranges;
  while ((ranges = rangesMatrix[i++])) {
    for (const range of ranges) {
      if (nextPos >= range[1] && nextPos < range[1] + range[2]) {
        nextPos = nextPos + range[0] - range[1];
        break;
      }
    }
  }
  return nextPos;
};

const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path);
  const data = getSeedsAndMaps(rows);
  // part 1
  const seedLocations = data.seeds.map(seed => getLocation(seed, data.rangesMatrix));
  console.log(Math.min(...seedLocations));
  // part 2
  // log the count to see if this is computationally feasible
  const totalSeedsCount = data.seedRanges.reduce((total, range) => total + range[1] - range[0], 0);
  // count is 2.2 billion, which takes an empty for-loop 3ish seconds.
  console.log(totalSeedsCount);
  let minLocation = Infinity;
  let progress = 0;
  for (const range of data.seedRanges) {
    for (let i = range[0]; i < range[1]; i++) {
      if (!(progress % 1e6)) console.log(`Processed ${progress} seeds.`); // this is really slow. let's not use .reduce
      const location = getLocation(i, data.rangesMatrix);
      if (location < minLocation) minLocation = location;
      progress++;
    }
  }
  console.log('Processed all seeds.');
  console.log(minLocation);
};

main();
