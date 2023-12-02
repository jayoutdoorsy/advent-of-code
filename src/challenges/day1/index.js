import { join } from 'path';
import { TokenParser, getDirname, readFileRows, isValidNumber } from '../../util.js';

const DIGIT_DICTIONARY = {
  0: '0',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

const getCalibrationValueFromRow = (row, parser) => {
  const digits = parser.parse(row);
  if (!digits.length) {
    throw new Error('Unexpected edge case, no digits from row');
  }
  const firstDigit = DIGIT_DICTIONARY[digits[0]];
  const lastDigit = DIGIT_DICTIONARY[digits[digits.length - 1]];
  const rowNumber = Number(firstDigit + lastDigit);
  if (!isValidNumber(rowNumber)) {
    throw new Error('Unexpected edge case, numbers are hard');
  }
  return rowNumber;
};

const main = async () => {
  const path = join(getDirname(import.meta.url), 'input.txt');
  const rows = readFileRows(path);
  const digitParser = new TokenParser(Object.keys(DIGIT_DICTIONARY));
  const total = rows.reduce((sum, row) => sum + getCalibrationValueFromRow(row, digitParser), 0);
  console.log(total);
};

main();
