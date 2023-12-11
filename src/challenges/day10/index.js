import { join } from 'path';
import { getDirname, readFileRows } from '../../util.js';

const directionMap = {
  up: ['|', '7', 'F', 'S'],
  down: ['|', 'J', 'L', 'S'],
  left: ['-', 'L', 'F', 'S'],
  right: ['-', 'J', '7', 'S'],
};
const connectionsMap = {
  '|': ['up', 'down'],
  '-': ['left', 'right'],
  L: ['up', 'right'],
  J: ['left', 'up'],
  7: ['left', 'down'],
  F: ['right', 'down'],
  '.': [],
  S: ['left', 'right', 'up', 'down'],
};

const setEdges = (graph, i, j) => {
  const node = graph[i][j];
  const dirsToIndexMap = { up: [i - 1, j], down: [i + 1, j], left: [i, j - 1], right: [i, j + 1] };
  for (const dirName of connectionsMap[node.type]) {
    const dir = dirsToIndexMap[dirName];
    const child = graph[dir[0]]?.[dir[1]];
    if (child && directionMap[dirName].includes(child.type)) {
      node.edges.push(child);
    }
  }
};

const rowsToGraph = rows => {
  const graph = {};
  let startNode;
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      const map = (graph[i] = graph[i] || {});
      map[j] = map[j] || { pos: [i, j], type: rows[i][j], edges: [] };
      if (rows[i][j] === 'S') startNode = map[j];
    }
  }
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      setEdges(graph, i, j);
    }
  }
  return startNode;
};

const getLoopLengths = start => {
  let lengths = [];
  const visit = (node, pathLength = 0, prevNode) => {
    if (node.visited) {
      return lengths.push(pathLength);
    }
    node.visited = true;
    for (const edge of node.edges) {
      if (prevNode !== edge) visit(edge, pathLength + 1, node);
    }
  };
  visit(start);
  return lengths;
};

// S must be in the main loop
// Num steps from farthest point is length of loop/2
// node --stack-size=5000 src/challenges/day10/index

const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path);
  const start = rowsToGraph(rows);
  const loopLengths = getLoopLengths(start);
  console.log(Math.max(...loopLengths) / 2);
};

main();
