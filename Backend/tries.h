

#include <vector>
#include <string>
#include <queue>
#include "TriesNode.h" 

class Tries{
    public:
        Tries();
        void insert(string word);
        bool search(string word);
        vector < string > getSuggestion(string prefix);

    private:
        TrieNode* root;
        void dfs(TrieNode* node, string word, priority_queue < pair < int, string > > &suggestion);
};

