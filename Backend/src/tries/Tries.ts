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

  private levenshteinDistance(s: string, t: string): number {
    const m = s.length;
    const n = t.length;
  
    if (m < n) return this.levenshteinDistance(t, s);
  
    let prev = Array(n + 1).fill(0);
    let curr = Array(n + 1).fill(0);
  
    for (let j = 0; j <= n; j++) prev[j] = j;
  
    for (let i = 1; i <= m; i++) {
      curr[0] = i;
      for (let j = 1; j <= n; j++) {
        if (s[i - 1] === t[j - 1]) {
          curr[j] = prev[j - 1];
        } else {
          curr[j] = 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
        }
      }
      [prev, curr] = [curr, prev];
    }
  
    return prev[n];
  }


  getCorrect(word: string, maxDist = 2): SuggestionEntry[] {
    const results: SuggestionEntry[] = [];

    const dfs = (node: TrieNode, currentWord: string) => {
      if (node.wordEnd) {
        const dist = this.levenshteinDistance(word, currentWord);
        if (dist <= maxDist) {
          results.push({
            word: currentWord,
            freq: node.freq,
            searchFreq: node.searchFreq,
          });
        }
      }
      for (const [ch, child] of node.children) {
        dfs(child, currentWord + ch);
      }
    };

    dfs(this.root, "");
    results.sort(compareEntries);
    return results.slice(0, 5);
  }
}
export { Trie };
