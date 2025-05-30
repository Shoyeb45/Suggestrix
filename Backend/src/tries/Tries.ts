import { SuggestionEntry } from "../Type/SuggestionEntry";

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  topWords: SuggestionEntry[] = [];
  freq = 0;
  searchFreq = 0;
  wordEnd = false;
}

function compareEntries(a: SuggestionEntry, b: SuggestionEntry): number {
  if (b.searchFreq !== a.searchFreq) return b.searchFreq - a.searchFreq;
  if (b.freq !== a.freq) return b.freq - a.freq;
  return a.word.localeCompare(b.word);
}

class Trie {
  root = new TrieNode();

  private updateTopWords(node: TrieNode, word: string, searchFreq: number, freq: number) {
    node.topWords = node.topWords.filter(entry => entry.word !== word);
    node.topWords.push({ word, searchFreq, freq });
    node.topWords.sort(compareEntries);
    if (node.topWords.length > 5) node.topWords.pop();
  }

  insert(word: string, frequency: number) {
    let node = this.root;
    const path: TrieNode[] = [node];

    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
      path.push(node);
    }

    node.wordEnd = true;
    node.freq += frequency;

    for (const n of path) {
      this.updateTopWords(n, word, node.searchFreq, node.freq);
    }
  }

  isValidPrefix(prefix: string): boolean {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return true;
  }

  isEndWord(word: string): boolean {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return node.wordEnd;
  }

  getTopSuggestions(prefix: string): SuggestionEntry[] {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return [];
      node = node.children.get(ch)!;
    }
    return [...node.topWords];
  }

  searchUpdate(word: string) {
    let node = this.root;
    const path: TrieNode[] = [node];
    for (const ch of word) {
      if (!node.children.has(ch)) return; 
      node = node.children.get(ch)!;
      path.push(node);
    }
    if (!node.wordEnd) return;

    node.searchFreq++;
    for (const n of path) {
      this.updateTopWords(n, word, node.searchFreq, node.freq);
    }
  }

  getCorrect(word: string, maxDist: number): SuggestionEntry[] {
    const results: SuggestionEntry[] = [];
  
    const dfs = (node: TrieNode, char: string, prevRow: number[], wordSoFar: string) => {
      const columns = word.length + 1;
      const currentRow = [prevRow[0] + 1];
  
      for (let i = 1; i < columns; i++) {
        const insertCost = currentRow[i - 1] + 1;
        const deleteCost = prevRow[i] + 1;
        const replaceCost = word[i - 1] === char ? prevRow[i - 1] : prevRow[i - 1] + 1;
        currentRow.push(Math.min(insertCost, deleteCost, replaceCost));
      }
  
      if (node.wordEnd && currentRow[word.length] <= maxDist) {
        results.push({
          word: wordSoFar,
          freq: node.freq,
          searchFreq: node.searchFreq
        });
      }
  
      if (Math.min(...currentRow) <= maxDist) {
        for (const [nextChar, child] of node.children) {
          dfs(child, nextChar, currentRow, wordSoFar + nextChar);
        }
      }
    };
  
    const rootRow = Array(word.length + 1).fill(0).map((_, i) => i);
    for (const [char, child] of this.root.children) {
      dfs(child, char, rootRow, char);
    }
  
    results.sort(compareEntries); 
    return results.slice(0, 5); 
  }
}
export { Trie };
