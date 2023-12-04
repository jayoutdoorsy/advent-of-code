import { join } from 'path';
import { getDirname, readFileRows } from '../../util.js';

const getCard = (row, id) => {
  const [_, numStr] = row.split(':');
  const numbers = numStr.match(/[0-9]+/g) || [];
  let winners = 0;
  for (let i = 0, seen = {}; i < numbers.length; i++) {
    if (seen[numbers[i]]) winners++;
    seen[numbers[i]] = true;
  }
  return { id, winners, count: 1 };
};
const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path);
  const cards = rows.map(getCard);
  // Part 1
  const fakeTotal = cards.reduce((sum, { winners }) => {
    return winners ? sum + 2 ** (winners - 1) : sum;
  }, 0);
  console.log(fakeTotal);
  // Part 2  - update the counts, simulate the expansion process
  for (let i = 0; i < cards.length; i++)
    for (let j = i + 1; j < Math.min(i + cards[i].winners + 1, cards.length); j++)
      cards[j].count += cards[i].count;
  const actualTotal = cards.reduce((sum, { count }) => sum + count, 0);
  console.log(actualTotal);
};

main();
