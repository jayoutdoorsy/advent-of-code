import { ids } from 'apg-lib';
import { ABNFParser } from '../../../util.js';
import GameGrammar from './gameGrammar.js';

const parser = new ABNFParser(new GameGrammar());
parser.register({
  gameId: (state, game, value) => {
    if (state === ids.SEM_POST) {
      game.id = Number(value);
    }
  },
  round: (state, game) => {
    if (state === ids.SEM_PRE) {
      (game.rounds = game.rounds || []).push({});
    } else {
      delete game.count;
    }
  },
  cubeCount: (state, game, value) => {
    if (state === ids.SEM_POST) {
      game.count = Number(value);
    }
  },
  cubeColor: (state, game, value) => {
    if (state === ids.SEM_POST) {
      game.rounds[game.rounds.length - 1][value] = game.count;
    }
  },
});

export const parseGame = input => {
  return parser.parse(input);
};
