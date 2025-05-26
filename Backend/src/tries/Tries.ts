import { SuggestionEntry } from "../Type/SuggestionEntry";

export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  freq: number = 0;
  searchFreq: number = 0;
  topWord: SuggestionEntry[] = [];
  wordEnd: boolean = false;
}

export class Trie {
  private root: TrieNode = new TrieNode();

  private compareSuggestion(a: SuggestionEntry, b: SuggestionEntry): number {
    if (b.SearchFreq !== a.SearchFreq) return b.SearchFreq - a.SearchFreq;
    if (b.freq !== a.freq) return b.freq - a.freq;
    return a.word.localeCompare(b.word);
  }

  private updateNode(node: TrieNode, word: string) {
    node.topWord = node.topWord.filter(entry => entry.word !== word);
    const entry: SuggestionEntry = {
      word,
      SearchFreq: node.searchFreq,
      freq: node.freq
    };
    node.topWord.push(entry);
    node.topWord.sort(this.compareSuggestion);
    if (node.topWord.length > 5) {
      node.topWord.pop();
    }
  }
  
  getTopWords(): SuggestionEntry[] {
    return this.root.topWord.slice(0, 5);
  }

  insert(word: string, freq: number) {
    let node = this.root;
    const path: TrieNode[] = [node];

    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
      path.push(node);
    }
    node.wordEnd = true;
    node.freq += freq;

    path.forEach(n => this.updateNode(n, word));
  }

  getSuggestion(word: string): SuggestionEntry[] {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) return [];
      node = node.children.get(ch)!;
    }
    return node.topWord;
  }

  isvalid(prefix: string): boolean {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return true;
  }

  updateSearchFreq(word: string) {
    let node = this.root;
    const path: TrieNode[] = [node];
    for (const ch of word) {
      if (!node.children.has(ch)) return;
      node = node.children.get(ch)!;
      path.push(node);
    }
    node.searchFreq++;
    path.forEach(n => this.updateNode(n, word));
  }

  getCorrections(word: string, maxDist: number): SuggestionEntry[] {
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
          SearchFreq: node.searchFreq
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

    results.sort(this.compareSuggestion);
    return results.slice(0, 5);
  }
}
