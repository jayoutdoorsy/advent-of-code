import { join } from 'path';
import { getDirname, readFileRows } from '../../util.js';
import { ids } from 'apg-lib';
import { ABNFParser } from '../../util.js';
import EngineGrammar from './engineGrammar.js';

const parser = new ABNFParser(new EngineGrammar());
parser.register({
  engine: ({ state, result }) => {
    if (state === ids.SEM_PRE) {
      result.symbols = {};
      result.numbers = {};
      result.total = 0;
    }
  },
  number: ({ state, _result, _value, _offset, _limit }) => {
    if (state === ids.SEM_POST) {
      // for fun, will go with easy one for now.
      // Idea here is to parse and:
      // 1. every time you hit a number, check behind for matching symbols
      //    If there's a matching symbol, don't cache the number
      // 2. every time you hit a symbol, check behind for matching numbers
      //    If there's a matching number, delete it from the cache.
    }
  },
  symbol: ({ state, _result, _value }) => {
    if (state === ids.SEM_POST) {
      // TODO
    }
  },
});

//.....$....&....
//...345687......
//.....66...%....
const getNumbersWithNeighboringSymbols = rows => {
  const result = [];
  for (let rowIndex = 0, match, matcher = /[0-9]+/g; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    while ((match = matcher.exec(row))) {
      const offset = match.index;
      const limit = match[0].length;
      for (let numIndex = offset; numIndex < offset + limit; numIndex++) {
        const charsToCheck = [rows[rowIndex - 1]?.[numIndex], rows[rowIndex + 1]?.[numIndex]];
        if (numIndex === offset) {
          charsToCheck.push(
            row[numIndex - 1],
            rows[rowIndex - 1]?.[numIndex - 1],
            rows[rowIndex + 1]?.[numIndex - 1],
          );
        }
        if (numIndex === offset + limit - 1) {
          charsToCheck.push(
            row[numIndex + 1],
            rows[rowIndex - 1]?.[numIndex + 1],
            rows[rowIndex + 1]?.[numIndex + 1],
          );
        }
        if (charsToCheck.some(char => (char || '').match(/^[^0-9^.]{1}$/))) {
          result.push(Number(match[0]));
          break;
        }
      }
    }
  }
  return result;
};

const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path);
  const numbers = getNumbersWithNeighboringSymbols(rows);
  const result = numbers.reduce((sum, n) => sum + n, 0);
  console.log(result);
};

main();
