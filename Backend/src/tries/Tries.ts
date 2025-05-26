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
      if (!node.children.has(ch)) return; // word not found
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
    const dp: number[][] = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s[i - 1] === t[j - 1]) dp[i][j] = dp[i - 1][j - 1];
        else
          dp[i][j] =
            1 +
            Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
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
