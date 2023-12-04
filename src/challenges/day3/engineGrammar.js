// Generated by JavaScript APG, Version [`apg-js2`](https://github.com/ldthomas/apg-js2)
export default function () {
  'use strict';
  //```
  // SUMMARY
  //      rules = 4
  //       udts = 0
  //    opcodes = 19
  //        ---   ABNF original opcodes
  //        ALT = 2
  //        CAT = 0
  //        REP = 2
  //        RNM = 3
  //        TLS = 11
  //        TBS = 0
  //        TRG = 1
  //        ---   SABNF superset opcodes
  //        UDT = 0
  //        AND = 0
  //        NOT = 0
  //        BKA = 0
  //        BKN = 0
  //        BKR = 0
  //        ABG = 0
  //        AEN = 0
  // characters = [35 - 64]
  //```
  /* OBJECT IDENTIFIER (for internal parser use) */
  this.grammarObject = 'grammarObject';

  /* RULES */
  this.rules = [];
  this.rules[0] = { name: 'engine', lower: 'engine', index: 0, isBkr: false };
  this.rules[1] = { name: 'symbol', lower: 'symbol', index: 1, isBkr: false };
  this.rules[2] = { name: 'number', lower: 'number', index: 2, isBkr: false };
  this.rules[3] = { name: 'DIGIT', lower: 'digit', index: 3, isBkr: false };

  /* UDTS */
  this.udts = [];

  /* OPCODES */
  /* engine */
  this.rules[0].opcodes = [];
  this.rules[0].opcodes[0] = { type: 3, min: 1, max: Infinity }; // REP
  this.rules[0].opcodes[1] = { type: 1, children: [2, 3, 4] }; // ALT
  this.rules[0].opcodes[2] = { type: 4, index: 1 }; // RNM(symbol)
  this.rules[0].opcodes[3] = { type: 4, index: 2 }; // RNM(number)
  this.rules[0].opcodes[4] = { type: 7, string: [46] }; // TLS

  /* symbol */
  this.rules[1].opcodes = [];
  this.rules[1].opcodes[0] = { type: 1, children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }; // ALT
  this.rules[1].opcodes[1] = { type: 7, string: [42] }; // TLS
  this.rules[1].opcodes[2] = { type: 7, string: [37] }; // TLS
  this.rules[1].opcodes[3] = { type: 7, string: [45] }; // TLS
  this.rules[1].opcodes[4] = { type: 7, string: [35] }; // TLS
  this.rules[1].opcodes[5] = { type: 7, string: [61] }; // TLS
  this.rules[1].opcodes[6] = { type: 7, string: [64] }; // TLS
  this.rules[1].opcodes[7] = { type: 7, string: [36] }; // TLS
  this.rules[1].opcodes[8] = { type: 7, string: [47] }; // TLS
  this.rules[1].opcodes[9] = { type: 7, string: [43] }; // TLS
  this.rules[1].opcodes[10] = { type: 7, string: [38] }; // TLS

  /* number */
  this.rules[2].opcodes = [];
  this.rules[2].opcodes[0] = { type: 3, min: 1, max: Infinity }; // REP
  this.rules[2].opcodes[1] = { type: 4, index: 3 }; // RNM(DIGIT)

  /* DIGIT */
  this.rules[3].opcodes = [];
  this.rules[3].opcodes[0] = { type: 5, min: 48, max: 57 }; // TRG

  // The `toString()` function will display the original grammar file(s) that produced these opcodes.
  this.toString = function () {
    var str = '';
    str += 'engine      = 1*( symbol / number / ".")\n';
    str += '\n';
    str += 'symbol = "*" / "%" / "-" / "#" / "=" / "@" / "$" / "/" / "+" / "&"\n';
    str += 'number = 1*DIGIT\n';
    str += '\n';
    str += '; rfc5234\n';
    str += 'DIGIT          =  %x30-39\n';
    return str;
  };
}
