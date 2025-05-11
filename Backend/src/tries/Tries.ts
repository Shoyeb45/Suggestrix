import { SuggestionEntry } from "../Type/SuggestionEntry";

export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  freq: number;
  searchFreq: number = 0;
  topWord: SuggestionEntry[] = [];
  wordEnd: boolean = false;
};

export class Trie {
  private root:TrieNode = new TrieNode();
  
  private compareSuggestion(a: SuggestionEntry, b:SuggestionEntry):number {
    if (b.SearchFreq !== a.SearchFreq) return b.SearchFreq - a.SearchFreq;
    if (b.freq !== a.freq) return b.freq - a.freq;
    return a.word.localeCompare(b.word);
  }
  
  private updateNode(node:TrieNode, word: string) {
    node.topWord = node.topWord.filter(entry => entry.word != word);
    const entry: SuggestionEntry = {
      word: word,
      SearchFreq: node.searchFreq,
      freq: node.freq
    }
    node.topWord.push(entry);
    node.topWord.sort(this.compareSuggestion);
    if(node.topWord.length > 5) {
      node.topWord.pop();
    }
  };
  
  insert(word: string, freq: number) {
    let node = this.root;
    const path: TrieNode[] = [node];
    
    for(const char of word) {
      if(!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
      path.push(node);
    }
    node.wordEnd = true;
    node.freq += freq;
    
    path.forEach(node => this.updateNode(node, word));
  };
  
  getSuggestion(word: string): SuggestionEntry[] {
    let node = this.root;
    for(const ch of word) {
      if (!node.children.has(ch)) return [];
      node = node.children.get(ch)!;
    }
    return node.topWord; 
  }
  
  isvalid(prefix: string):boolean {
    let node = this.root;
    for(const ch of prefix) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return true;
  }
  
  updateSearchFreq(word: string) {
    let node = this.root;
    const path: TrieNode[] = [node];
    for(const ch of word) {
      if (!node.children.has(ch)) {
        return;
      }
      node = node.children.get(ch)!;
      path.push(node);
    }
    node.searchFreq++;
    path.forEach(n => this.updateNode(n, word));
  }
}