#ifndef TRIE_H
#define TRIE_H

#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

struct TrieNode {
    unordered_map < char, TrieNode> children;
    int frequency;
    bool isEnd;

    TrieNode() {
        isEnd = false;
        frequency = 0;
    }
};

#endif