import { ids } from 'apg-lib';
import { ABNFParser } from '../../../util.js';
import GameGrammar from './gameGrammar.js';

const parser = new ABNFParser(new GameGrammar());
parser.register({
  gameId: ({ state, result, value }) => {
    if (state === ids.SEM_POST) {
      result.id = Number(value);
    }
  },
  round: ({ state, result }) => {
    if (state === ids.SEM_PRE) {
      (result.rounds = result.rounds || []).push({});
    } else {
      delete result.count;
    }
  },
  cubeCount: ({ state, result, value }) => {
    if (state === ids.SEM_POST) {
      result.count = Number(value);
    }
  },
  cubeColor: ({ state, result, value }) => {
    if (state === ids.SEM_POST) {
      result.rounds[result.rounds.length - 1][value] = result.count;
    }
  },
});

export const parseGame = input => {
  return parser.parse(input);
};
