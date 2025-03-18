#include <iostream>
#include <unordered_map>
#include <set>
#include <vector>
#include <stack>
#include <fstream>
#include <string>
#include <sstream>
#include <algorithm>
#include <utility>
#include <cctype>
using namespace std;

// Custom comparator for ordering words based on searchFreq, then freq, then lexicographically
struct WordComparator {
    bool operator()(const pair<pair<int, int>, string>& a, const pair<pair<int, int>, string>& b) const {
        if (a.first.first != b.first.first) {
            return a.first.first > b.first.first; 
        }
        if (a.first.second != b.first.second) {
            return a.first.second > b.first.second;
        }
        return a.second < b.second; 
    }
};

// Trie Node structure
struct TrieNode {
    unordered_map<char, TrieNode*> children;
    set<pair<pair<int, int>, string>, WordComparator> topWords; // Stores top 5 words
    int freq = 0;  // Data frequency
    int searchFreq = 0;  // Search frequency
    bool wordEnd = false;                                  
};

// Trie class for autocomplete
class Trie {
private:
    TrieNode* root;

    // Helper function to update the top words at a node
    void updateTopWords(TrieNode* node, const string& word, int searchFreq, int freq) {
        // Remove old entry if it exists
        for (auto it = node->topWords.begin(); it != node->topWords.end(); ) {
            if (it->second == word) {
                it = node->topWords.erase(it);
            } else {
                ++it;
            }
        }

        // Insert updated frequency
        node->topWords.insert({{searchFreq, freq}, word});

        // Maintain only top 5 elements
        if (node->topWords.size() > 5) {
            node->topWords.erase(prev(node->topWords.end())); // Remove lowest-ranked word
        }
    }

public:
    Trie() { root = new TrieNode(); }

    // Insert a word into Trie
    void insert(const string& word, int frequency) {
        TrieNode* node = root;
        stack<TrieNode*> path; // Store path to update parents
        path.push(root);  // Include root in the path

        for (char ch : word) {
            if (!node->children[ch]) {
                node->children[ch] = new TrieNode();
            }
            node = node->children[ch];
            path.push(node);
        }

        node->wordEnd = true;
        node->freq += frequency;

        // Update topWords for the entire path
        while (!path.empty()) {
            TrieNode* pathNode = path.top();
            path.pop();
            updateTopWords(pathNode, word, node->searchFreq, node->freq);
        }
    }

    // Check if a prefix exists in the trie
    bool isValidPrefix(const string &prefix) {
        TrieNode *node = root;
        for (char ch : prefix) {
            if (!node->children.count(ch)) return false;
            node = node->children[ch];
        }
        return true;
    }

    // Check if a word is a complete word in the trie
    bool isEndWord(const string &word) {
        TrieNode *node = root;
        for (char ch : word) {
            if (!node->children.count(ch)) return false;
            node = node->children[ch];
        }
        return node->wordEnd;
    }

    // Search for top suggestions for a given prefix
    vector<tuple<string, int, int>> getTopSuggestions(const string& prefix) {
        TrieNode* node = root;
        vector<tuple<string, int, int>> result;

        for (char ch : prefix) {
            if (!node->children[ch]) return result; // No suggestions
            node = node->children[ch];
        }

        // Collect top 5 words from the current node
        for (const auto& p : node->topWords) {
            result.push_back(make_tuple(p.second, p.first.first, p.first.second));
        }
        return result;
    }

    // Update search frequency when a user selects a suggestion
    void searchUpdate(const string& word) {
        TrieNode* node = root;
        stack<TrieNode*> path; // Track visited nodes
        path.push(root);  // Include root in the path
    
        for (char ch : word) {
            if (!node->children[ch]) return; // Word not found
            node = node->children[ch];
            path.push(node);
        }
    
        if (node->wordEnd) {
            TrieNode* wordNode = node;
            wordNode->searchFreq++; // Increase search frequency
    
            // Update topWords in all ancestor nodes using updateTopWords
            while (!path.empty()) {
                TrieNode* pathNode = path.top();
                path.pop();
                updateTopWords(pathNode, word, wordNode->searchFreq, wordNode->freq);
            }
        }
    }    
    
};

// Function to trim whitespace and quotes from a string
std::string trim(const std::string &str) {
    size_t first = str.find_first_not_of(" \"");
    if (first == std::string::npos) return "";
    size_t last = str.find_last_not_of(" \"");
    return str.substr(first, last - first + 1);
}

// Function to parse JSON-like key-value pairs from a file into a vector
std::vector<std::pair<std::string, int>> parseJsonToVector(const std::string &filename) {
    std::ifstream file(filename);
    if (!file) {
        std::cerr << "Error opening file: " << filename << std::endl;
        return {};
    }

    std::string jsonStr, line;
    while (std::getline(file, line)) {
        jsonStr += line; // Read entire file into a string
    }

    // Remove `{` and `}`
    jsonStr.erase(std::remove(jsonStr.begin(), jsonStr.end(), '{'), jsonStr.end());
    jsonStr.erase(std::remove(jsonStr.begin(), jsonStr.end(), '}'), jsonStr.end());

    std::vector<std::pair<std::string, int>> dataVector;
    std::stringstream ss(jsonStr);
    std::string pairStr;

    // Parse key-value pairs
    while (std::getline(ss, pairStr, ',')) {
        size_t colonPos = pairStr.find(':');
        if (colonPos == std::string::npos) continue;

        std::string key = trim(pairStr.substr(0, colonPos));
        int value = std::stoi(trim(pairStr.substr(colonPos + 1)));

        dataVector.emplace_back(key, value);
    }

    return dataVector;
}

// Driver function to test the Trie
int main() {
    Trie trie;
    vector<pair<string, int>> corpus = parseJsonToVector("./../Databse/wikipedia_word_freq.json");

    for (auto x: corpus) trie.insert(x.first, x.second);

    cout << "Initial suggestions for 'a':\n";
    vector<tuple<string, int, int>> suggestions = trie.getTopSuggestions("a");
    
    for (auto &s : suggestions) 
        cout << get<0>(s) << " (SearchFreq: " << get<1>(s) << ", Freq: " << get<2>(s) << ") ";
    
    cout << "\n\n";

    string prefix, word;
    
    while (1) {
        cout << "Enter a prefix (or 'exit' to quit): ";
        cin >> prefix;
        
        if (prefix == "exit") break;

        if (!trie.isValidPrefix(prefix)) {
            cout << "Invalid prefix\n";
            continue;
        }

        suggestions = trie.getTopSuggestions(prefix);
        cout << "Top suggestions for '" << prefix << "':\n";
        
        if (suggestions.empty()) cout << "No suggestions found.\n";
        else {
            for (auto &s : suggestions) 
                cout << get<0>(s) << " (SearchFreq: " << get<1>(s) << ", Freq: " << get<2>(s) << ")\n";
            cout << "\n";
        }

        if (trie.isEndWord(prefix)) {
            trie.searchUpdate(prefix);
            cout << "Search frequency updated for '" << prefix << "'\n";
        }
    }
    return 0;
}
