#include "Tries.h"
#include <queue>

Tries::Tries() {
    root = new TrieNode();
}

void Tries::insert(string word) {
    TrieNode* node = root;
    for(char ch : word) {
        if(node->children.count(ch) == 0) {
            node->children[ch] = new TrieNode();
        }
        node = node->children[ch];
    }
    node->isEnd = true;
    node->frequency++;
}

bool Tries::search(string word) {
    TrieNode* node = root;
    for(char ch : word) {
        if(node->children.count(ch) == 0) {
            return false;
        }
        node = node->children[ch];
    }
    return node->isEnd;
}

vector<string> Tries::getSuggestions(string prefix) {
    TrieNode* node = root;
    priority_queue<pair<int, string>> suggestions;
    for(char ch : prefix) {
        if(node->children.count(ch) == 0) {
            return {}; 
        }
        node = node->children[ch];
    }

    dfs(node, prefix, suggestions);
    
    vector<string> result;
    int limit = min(4, (int)suggestions.size());  
    for(int i = 0; i < limit; i++) {
        result.push_back(suggestions.top().second); 
        suggestions.pop();
    }

    return result;
}

void Tries::dfs(TrieNode* node, string word, priority_queue<pair<int, string>>& suggestions) {
    if(node->isEnd) {
        suggestions.push({node->frequency, word});
    }

    for(auto& child : node->children) {
        dfs(child.second, word + child.first, suggestions);
    }
}
