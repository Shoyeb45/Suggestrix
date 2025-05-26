import express, { RequestHandler } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import { Trie } from "../dist/tries/Tries";
import config from '../config';

const app = express();
const trie = new Trie();

fs.createReadStream('./src/db/ngram_freq_dict.csv')
  .pipe(csv())
  .on('data', (row: { word: string; count: string }) => {
    trie.insert(row.word, parseInt(row.count, 10));
  })
  .on('end', () => {
    console.log('CSV file processed and Trie built');
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  });

const suggestionHandler: RequestHandler = (req, res) => {
  const wordParam = req.query.word;
  const maxDistanceParam = req.query.maxDistance;

  const word = typeof wordParam === 'string' ? wordParam : '';
  const maxDistance = typeof maxDistanceParam === 'string' ? parseInt(maxDistanceParam, 10) : 2;

  if (word.trim() === '') {
    const top = trie.getTopWords();
    res.json({ type: 'top', suggestions: top });
    return;
  }

  if (trie.isvalid(word)) {
    const suggestions = trie.getSuggestion(word);
    res.json({ type: 'autocomplete', suggestions });
    return;
  } else {
    const corrections = trie.getCorrections(word, maxDistance);
    res.json({ type: 'autocorrect', suggestions: corrections });
    return;
  }
};


app.get('/suggestion', suggestionHandler);
