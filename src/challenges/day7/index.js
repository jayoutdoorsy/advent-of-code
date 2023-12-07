import { join } from 'path';
import { getDirname, readFileRows, split } from '../../util.js';

// Higher is better
const sortScoreMap = {
  2: 0,
  3: 1,
  4: 2,
  5: 3,
  6: 4,
  7: 5,
  8: 6,
  9: 7,
  T: 8,
  J: -1, // For part 2, J is now lower than 2
  Q: 10,
  K: 11,
  A: 12,
};

// ugly but part 2 needs to handle J
const sortHandByCardPrevalence = hand => {
  const counts = {};
  for (const card of hand) {
    counts[card] = (counts[card] || 0) + 1;
  }

  // Break ties with card rank, make sure J always gets bumped to top like JJJK5
  const sorter = (a, b) => {
    if (a === 'J') return -1;
    if (b === 'J') return 1;
    return counts[b] - counts[a] ? counts[b] - counts[a] : sortScoreMap[b] - sortScoreMap[a];
  };
  hand.sort(sorter);

  // For part 2 convert all J's to the next most prevalent card like JJJK5 -> KKKK5
  if (counts.J) {
    const highestNextCard = hand[counts.J] || 'A';
    for (let i = 0; i < counts.J; i++) {
      hand[i] = highestNextCard;
    }
  }

  return hand;
};

const getHands = rows => {
  return rows.map(row => {
    const parts = split(row, ' ');
    const hand = split(parts[0], '');
    return {
      hand,
      sortedHand: sortHandByCardPrevalence([...hand]),
      bid: Number(parts[1]),
    };
  });
};

// ugly but should work
const groupHandsByType = hands => {
  const sortedTypes = [[], [], [], [], [], [], []];
  for (const hand of hands) {
    const { sortedHand } = hand;
    let typeIndex;
    if (sortedHand[0] === sortedHand[4]) typeIndex = 0;
    else if (sortedHand[0] === sortedHand[3]) typeIndex = 1;
    else if (sortedHand[0] === sortedHand[2]) typeIndex = sortedHand[3] === sortedHand[4] ? 2 : 3;
    else {
      const numUnique = new Set(sortedHand).size;
      if (numUnique === 3) typeIndex = 4;
      else if (numUnique === 4) typeIndex = 5;
      else typeIndex = 6;
    }
    sortedTypes[typeIndex].push(hand);
  }
  return sortedTypes;
};

const sortHandsByRank = hands => {
  return hands.sort(({ hand: handA }, { hand: handB }) => {
    for (let i = 0; i < handB.length; i++) {
      if (handB[i] !== handA[i]) return sortScoreMap[handB[i]] - sortScoreMap[handA[i]];
    }
    return 0;
  });
};

const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path);
  const hands = getHands(rows);
  const groupedHands = groupHandsByType(hands);
  // Sorting types individually should be enough since each type dominates the next in rank
  const sortedByRank = groupedHands.map(sortHandsByRank).flat().reverse();
  // console.log(sortedByRank.map(hand => hand.hand));
  const score = sortedByRank.reduce((score, hand, i) => score + hand.bid * (i + 1), 0);
  console.log(score);
};

main();
