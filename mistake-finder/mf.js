'use strict'
const fs =require("fs");
const dictpath = process.argv[2];
const dict = fs.readFileSync(dictpath,'utf8').split(' ');
const textpath = process.argv[3];
const text = fs.readFileSync(textpath,'utf8').split('\n');
const symbs = ['.', '!', '?', ',', ':', ';'];

function getEditDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    let matrix = [], i;
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1,
                Math.min(matrix[i][j - 1] + 1,
                matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
};

const similarFinder = (word) => {
  let similars = [];
  for (let i = 0; i < dict.length; i++) {
    if (getEditDistance(word, dict[i]) < 2) {
      similars.push(dict[i]);
    }
  }
  return ('Возможно вы имели ввиду: ' + similars);
}

const checkLine = (line, li) => {
  let words = line.split(' ');
  for (let i = 0; i < words.length; i++) {
    let word = words[i], wl = word.length - 1;
    if (symbs.indexOf(word[wl]) + 1) {
      word = word.substring(0, wl);
    }
    if ((word !== '') && (dict.indexOf(word.toLowerCase()) === -1)) {
      console.log((li + 1) + ', ' + (line.indexOf(word) + 1) + ' ' + word + '  ' + similarFinder(word));
    }
  }
}

const scanner = () => {
  for (let i = 0; i < text.length; i++) {
    checkLine(text[i], i);
  }
}

scanner();
