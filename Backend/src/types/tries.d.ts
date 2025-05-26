declare module '../dist/tries/Tries' {
  export class Trie {
    insert(word: string, count: number): void;
    isvalid(word: string): boolean;
    getSuggestion(word: string): string[];
    getCorrections(word: string, maxDistance: number): string[];
    getTopWords(): string[];
  }
}
