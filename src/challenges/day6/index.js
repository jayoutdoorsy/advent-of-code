import { join } from 'path';
import { getDirname, parseNumbers, readFileRows } from '../../util.js';

// Equaton is quadratic: x(t) = t * (T - t)
// Verify by drawing the graph and noting the values for input (x, t) = [9, 6]
// x(0) = 0, x(1) = 5, x(2) = 8, x(3) = 9
// x(6) = 0  x(5) = 5, x(4) = 8
// We want x(t) > K, where K is high score.
// We can find this by solving the quadratic equation for x(t_min) = K
// Equation becomes: t^2 - Tt + K = 0
// We then find the "good" root, giving us t_min
// We then have our answer (T + 1) - 2*t_min
// Factor of two is for symmetry of x(t).
// Math.ceil(t_min) is required as t_min is continuous and we want the NEXT minimum discrete T.

const getRaces = rows => {
  const Ts = parseNumbers(rows[0]);
  const xs = parseNumbers(rows[1]);
  return xs.map((x, i) => [x, Ts[i]]);
};

const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path);
  const races = getRaces(rows);
  const result = races.reduce((numWays, [x, T]) => {
    let tMin = Math.ceil((T - Math.sqrt(T * T - 4 * x)) / 2);
    if (x === tMin * (T - tMin)) tMin++; // edge case with ceil...
    return numWays * (T + 1 - 2 * tMin);
  }, 1);
  console.log(result);
};

main();
