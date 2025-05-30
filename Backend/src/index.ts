import express, { RequestHandler } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import cors from 'cors';
import { Trie } from "../dist/tries/Tries.js";
import config from '../config.js';

const app = express();
const trie = new Trie();
app.use(cors({
  origin: 'https://suggestrix.vercel.app'
}))

fs.createReadStream('./src/db/ngram_freq_dict_top_80.csv')
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

  if (trie.isValidPrefix(word)) {
    if (trie.isEndWord(word)) {
      trie.searchUpdate(word); 
    }
    const suggestions = trie.getTopSuggestions(word);
    res.json({ type: 'autocomplete', suggestions });
    return;
  } else {
    const corrections = trie.getCorrect(word, maxDistance);
    res.json({ type: 'autocorrect', suggestions: corrections });
    return;
  }
};


app.get('/suggestion', suggestionHandler);
