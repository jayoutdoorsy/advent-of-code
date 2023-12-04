import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { parser as Parser, ast as AST, ids } from 'apg-lib';
import { Buffer } from 'buffer';

export const split = (str, separator) => str.split(separator).map(p => p.trim());

export const readFileRows = path => {
  const contents = readFileSync(path).toString();
  return split(contents, '\n').filter(Boolean);
};

export const getDirname = metaUrl => {
  const filename = fileURLToPath(metaUrl);
  return dirname(filename);
};

export const isValidNumber = input => {
  const num = Number(input);
  return !Number.isNaN(num) && Number.isFinite(num);
};

const buildTrie = (tokens, terminator) => {
  return tokens.reduce((trie, token) => {
    let node = trie;
    for (let i = 0; i < token.length; i++) {
      const char = token.charAt(i);
      node = node[char] = node[char] || {};
    }
    node[terminator] = true;
    return trie;
  }, {});
};

// Approch -- implement a parser that runs across the string and generates tokens.
// When a token is generated, push it's value to the parsedTokens array.
export class TokenParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.terminator = 'END';
    this.tokenTrie = buildTrie(tokens, this.terminator);
  }
  parse(input) {
    const parsedTokens = [];
    let mainIndex = 0;
    while (mainIndex < input.length) {
      let subIndex = mainIndex;
      let char = input.charAt(subIndex);
      let node = this.tokenTrie[char];
      while (node) {
        char = input.charAt(++subIndex);
        if (node[this.terminator]) {
          parsedTokens.push(input.substr(mainIndex, subIndex - mainIndex));
        }
        node = node[char];
      }
      mainIndex++;
    }
    return parsedTokens;
  }
}

// Let's try using an ABNF file just for fun.
// The original lib has a strange/dated interface, so will hide that.
export class ABNFParser {
  constructor(grammar) {
    this.grammar = grammar;
    this.entryToken = grammar.rules[0].name;
    this.parser = new Parser();
    this.parser.ast = new AST();
  }
  parse(input) {
    const { success } = this.parser.parse(this.grammar, this.entryToken, input);
    if (!success) {
      throw new Error(`Failed to parse as '${this.entryToken}'`);
    }
    const result = {};
    this.parser.ast.translate(result);
    return result;
  }
  // register AST token event listeners so we can build up the parsed object
  register(listeners) {
    this.parser.ast.callbacks = Object.keys(listeners).reduce((baseListeners, token) => {
      baseListeners[token] = (state, chars, offset, limit, result) => {
        const event = { state, chars, offset, limit, result };
        if (state === ids.SEM_POST) {
          event.value = Buffer.from(chars.slice(offset, offset + limit)).toString();
        }
        listeners[token](event);
      };
      return baseListeners;
    }, {});
  }
}
