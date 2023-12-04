import { join } from 'path';
import { getDirname, readFileRows } from '../../util.js';
// import { ids } from 'apg-lib';
// import { ABNFParser } from '../../util.js';
// import EngineGrammar from './engineGrammar.js';

// const parser = new ABNFParser(new EngineGrammar());
// parser.register({
//   engine: ({ state, result }) => {
//     if (state === ids.SEM_PRE) {
//       result.symbols = {};
//       result.numbers = {};
//       result.total = 0;
//     }
//   },
//   number: ({ state, result, value, offset, limit }) => {
//     if (state === ids.SEM_POST) {
//       // for fun, will go with easy one for now.
//       // Idea here is to parse and:
//       // 1. every time you hit a number, check behind for matching symbols
//       //    If there's a matching symbol, don't cache the number
//       // 2. every time you hit a symbol, check behind for matching numbers
//       //    If there's a matching number, delete it from the cache.
//     }
//   },
//   symbol: ({ state, result, value }) => {
//     if (state === ids.SEM_POST) {
//       // TODO
//     }
//   },
// });

//.....$....&....
//...345687......
//.....66...%....
const getNearestNeighborCoords = coords => {
  const neighborCoords = [];
  for (let i = 0; i < coords.length; i++) {
    const c = coords[i];
    neighborCoords.push([c[0] - 1, c[1]], [c[0] + 1, c[1]]);
    if (i === 0) {
      neighborCoords.push([c[0], c[1] - 1], [c[0] - 1, c[1] - 1], [c[0] + 1, c[1] - 1]);
    }
    if (i === coords.length - 1) {
      neighborCoords.push([c[0], c[1] + 1], [c[0] - 1, c[1] + 1], [c[0] + 1, c[1] + 1]);
    }
  }
  return neighborCoords;
};

const getNumbersWithNeighboringSymbols = rows => {
  const result = [];
  for (let rowIndex = 0, match, matcher = /[0-9]+/g; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    while ((match = matcher.exec(row))) {
      const offset = match.index;
      const limit = match[0].length;
      let neighbors = Array(limit).fill();
      neighbors = neighbors.map((_, i) => [rowIndex, offset + i]);
      neighbors = getNearestNeighborCoords(neighbors);
      neighbors = neighbors.map(n => ({ coords: n, char: rows[n[0]]?.[n[1]] }));
      neighbors = neighbors.filter(n => (n.char || '').match(/^[^0-9^.]{1}$/));
      if (neighbors.length) {
        result.push({ value: Number(match[0]), neighbors });
      }
    }
  }
  return result;
};

const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path);
  // Part 1
  const numbers = getNumbersWithNeighboringSymbols(rows);
  const result = numbers.reduce((sum, n) => sum + n.value, 0);
  console.log(result);
  // Part 2 -- find * symbol with 2 numbers
  const symbolIndex = numbers.reduce((index, number) => {
    for (const { coords, char } of number.neighbors) {
      if (char === '*') {
        (index[coords] = index[coords] || []).push(number.value);
      }
      return index;
    }
  }, {});
  const gears = Object.values(symbolIndex).filter(matchingNums => matchingNums.length === 2);
  const gearRatiosSum = gears.reduce((sum, v) => sum + v[0] * v[1], 0);
  console.log(gearRatiosSum);
};

main();
