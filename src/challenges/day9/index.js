import { join } from 'path';
import { getDirname, parseNumbers, readFileRows } from '../../util.js';

// Develop a recursion relation. Exit condition is when we hit diff = 0
// 10  13  16  21  30  45 |    68
//    3   3   5   9  15 |    23
//      0   2   4   6 |     8
//        2   2   2 |     2
//          0   0 |    0                               Stop at m_n since m_n = 0
// i_n-5  i_n-4  i_n-3  i_n-2  i_n-1  i_n  ->  i_n+1 = i_n + j_n + k_n + l_n + m_n
//    j_n-4  j_n-3  j_n-2  j_n-1  j_n  ->      j_n = i_n - i_n-1
//       k_n-3  k_n-2  k_n-1  k_n              k_n = j_n - j_n-1
//          l_n-2  l_n-1  l_n                  l_n = k_n - k_n-1
//             m_n-1  m_n                      m_n = l_n - l_n-1
// We don't care about n+1 other than i_n+1 for now.

// Can always use a loop instead of recursion since recursion is prone to stack overflows
// or in some cases tail recursion optimization could work (node 18? not sure)
const getDiff = row => {
  let hasNonZero = false;
  for (let i = 1; i < row.length; i++) {
    const diff = (row[i - 1] = row[i] - row[i - 1]);
    hasNonZero = hasNonZero || !!diff;
  }
  return row.pop() + (hasNonZero ? getDiff(row) : 0);
};
const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path).map(parseNumbers);
  const diff = rows.map(getDiff);
  const sum = diff.reduce((total, d) => total + d, 0);
  console.log(sum);
};

main();
