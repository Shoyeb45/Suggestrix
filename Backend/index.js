import express from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import { Trie } from './src/tries/Tries.js';
import config from './config.js';

const app = express();
const trie = new Trie();

fs.createReadStream('./src/db/ngram_freq_dict.csv')
  .pipe(csv())
  .on('data', (row) => {
    trie.insert(row.word, parseInt(row.count, 10));
  })
  .on('end', () => {
    console.log('CSV file processed and Trie built');
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  });

app.get('/suggestion', (req, res) => {
  const { word = '', maxDistance = 2 } = req.query;

  if (word.trim() === '') {
    const top = trie.getTopWords();
    return res.json({ type: 'top', suggestions: top });
  }

  if (trie.isvalid(word)) {
    const suggestions = trie.getSuggestion(word);
    return res.json({ type: 'autocomplete', suggestions });
  } else {
    const corrections = trie.getCorrections(word, parseInt(maxDistance, 10));
    return res.json({ type: 'autocorrect', suggestions: corrections });
  }
});
