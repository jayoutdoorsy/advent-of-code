import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

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
