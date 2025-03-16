#ifndef TRIE_H
#define TRIE_H

#include <vector>
#include <string>
#include <queue>
#include "TriesNode.h" 

class Tries{
    public:
        Tries();
        void insert(string word);
        void search(string word);
        vector < string > getSuggestion(string prefix);

    private:
        TrieNode* root;
        void dfs(TrieNode* node, string word, vector < pair < int, string > > &suggestion);
};
#endif