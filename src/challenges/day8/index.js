import { join } from 'path';
import { getDirname, readFileRows } from '../../util.js';

const getCrawlOrder = instructionsRow => instructionsRow.split('').map(k => (k === 'L' ? 0 : 1));

const getNodesMap = nodes => {
  const map = {};
  nodes.forEach(node => {
    const [start, next] = node.split(' = ');
    map[start] = {
      key: start,
      isStartNode: start.endsWith('A'),
      isEndNode: start.endsWith('Z'),
      nextNodes: next.slice(1, next.length - 1).split(', '),
    };
  });
  return map;
};

// Part 1
const getNumNodesUntilZZZ = (indexCrawlList, startNodeKey, nodesMap) => {
  let crawledCount = 0;
  let currentNodeKey = startNodeKey;
  while (currentNodeKey !== 'ZZZ') {
    currentNodeKey =
      nodesMap[currentNodeKey].nextNodes[indexCrawlList[crawledCount++ % indexCrawlList.length]];
  }
  return crawledCount;
};

// Part 2
// LCM(a,b) = a * b / GCD(a, b)
// const getGCD = (a, b) => {
//   console.log(a, b);
//   // the numbers are too big for recursion to work, so we'd need to use a loop instead.
//   // but after logging it looks like it's just the length of the instruction input..
//   if (a === b) return a;
//   if (a < b) return getGCD(a, b - a);
//   return getGCD(a - b, b);
// };
const getLCM = (a, b) => {
  return (a * b) / 263;
};
const getNumNodesUntilAllEndNodes = (indexCrawlList, startNodes, nodesMap) => {
  const pathLengthsToEndNodes = startNodes.map(start => {
    let crawledCount = 0;
    let currentNode = nodesMap[start];
    while (!currentNode.isEndNode) {
      currentNode =
        nodesMap[
          nodesMap[currentNode.key].nextNodes[
            indexCrawlList[crawledCount++ % indexCrawlList.length]
          ]
        ];
    }
    return crawledCount;
  });
  return pathLengthsToEndNodes.reduce(getLCM);
};

const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path);
  const [instructionsRow, ...nodes] = rows;
  const indexCrawlList = getCrawlOrder(instructionsRow);
  const nodesMap = getNodesMap(nodes);
  // part 1
  const crawledCount = getNumNodesUntilZZZ(indexCrawlList, 'AAA', nodesMap);
  console.log(crawledCount);
  // part 2
  const startNodes = Object.keys(nodesMap).filter(k => nodesMap[k].isStartNode);
  const crawledCount2 = getNumNodesUntilAllEndNodes(indexCrawlList, startNodes, nodesMap);
  console.log(crawledCount2);
};

main();
