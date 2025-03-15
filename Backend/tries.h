#ifndef TRIE_H
#define TRIE_H

#include <iostream>
#include <vector>
using namespace std;

struct TrieNode {
    TrieNode *children[26];
    int frequency;
    bool isEnd;

    TrieNode() {
        isEnd = false;
        frequency = 0;
        for (int i = 0; i < 26; i++)
            children[i] = nullptr;
    }
};

#endif