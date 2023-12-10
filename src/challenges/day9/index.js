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

// part 1
const _getNextDiff = row => {
  let hasNonZero = false;
  for (let i = 1; i < row.length; i++) {
    const diff = (row[i - 1] = row[i] - row[i - 1]);
    hasNonZero = hasNonZero || !!diff;
  }
  return row.pop() + (hasNonZero ? _getNextDiff(row) : 0);
};

// part 2 is like part 1 but from the other side
// Cool tail recursion optimized version. have to use alterating signs in the sum
// Interestingly the previous version included a minus sign in the return value
// so we didnt need an alternating factor, since it already had one:
// e.g. 10 - (3 - (0 - (2 - 0)))   (regular recursion, can't be optimized)
//      10 - 3 + 0 - 2 + 0         (tail optimized)
const getPrevDiff = (row, sum = 0, neg = -1) => {
  let hasNonZero = false;
  for (let i = row.length - 1; i > 0; i--) {
    const diff = (row[i] = row[i] - row[i - 1]);
    hasNonZero = hasNonZero || !!diff;
  }
  sum = sum - neg * row.shift();
  return hasNonZero ? getPrevDiff(row, sum, -neg) : sum;
};

const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path).map(parseNumbers);
  // part 2 now
  const diff = rows.map(row => getPrevDiff(row));
  const sum = diff.reduce((total, d) => total + d, 0);
  console.log(sum);
};

main();
