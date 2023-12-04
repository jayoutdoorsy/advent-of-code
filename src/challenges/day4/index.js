import { join } from 'path';
import { getDirname, readFileRows } from '../../util.js';

const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path);
  const total = rows.reduce((sum, row) => {
    const numbers = row.substr(row.indexOf(':')).match(/[0-9]+/g) || [];
    let dupeCount = 0;
    for (let i = 0, seen = {}; i < numbers.length; i++) {
      if (seen[numbers[i]]) dupeCount++;
      seen[numbers[i]] = true;
    }
    return dupeCount ? sum + 2 ** (dupeCount - 1) : sum;
  }, 0);
  console.log(total);
};

main();
