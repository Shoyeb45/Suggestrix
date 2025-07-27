# Suggestrix

Suggestrix is an intelligent autocomplete and autosuggestion web app built using **React** and **TypeScript**. At its core, it features a custom implementation of the **Trie (prefix tree)** data structure, enabling fast and efficient prefix-based search suggestions as the user types.

--
## 🧠 Understanding the Code — Custom Trie with Autosuggest + AutoCorrect

The heart of Suggestrix is a **custom Trie (prefix tree)** data structure, implemented fully from scratch in TypeScript. Below is an overview of the core components:

--

### 🔹 `TrieNode` Class

Each node represents a single character in the Trie. It includes:

- `children`: A `Map` to store child nodes (`Map<string, TrieNode>`)
- `topWords`: Stores the top 5 suggestions at that node (used for quick autosuggestions)
- `freq`: Frequency of the word based on insertion
- `searchFreq`: How many times users searched for that word
- `wordEnd`: A flag to mark if the current node completes a valid word

--

### 🔹 Word Ranking: `compareEntries()`

This function compares two suggestion entries:
1. Sorts by `searchFreq` (descending)
2. If equal, sorts by `freq` (descending)
3. If still equal, sorts alphabetically (`localeCompare`)

This ensures the most relevant and frequently used suggestions appear first.

--

### 🔹 `insert(word, frequency)`

Inserts a new word into the Trie:
- Traverses or creates each character node
- Updates the `freq` and `wordEnd` flag
- Maintains `topWords` at each node in the path for fast lookup

> Example: Inserting "code" and "coder" creates a path `c → o → d → e → r`.

--

### 🔹 `updateTopWords(node, word, searchFreq, freq)`

Keeps only the **top 5 suggestions** at each node based on ranking criteria.
- Prevents expensive traversals during user typing
- Ensures suggestions are relevant and quick

--

### 🔹 `isValidPrefix(prefix)`

Checks if a given prefix exists in the Trie. Useful for:
- Early termination of suggestion generation
- Client-side validation

--

### 🔹 `getTopSuggestions(prefix)`

Returns the top 5 suggestions under the given prefix from the stored `topWords` at the final node.

--

### 🔹 `searchUpdate(word)`

When a user clicks or types a word, this function:
- Increments its `searchFreq`
- Rebalances top suggestions for nodes along the path

This makes the system **learn user behavior** over time.

---

### 🔹 `getCorrect(word, maxDist)`

Implements a **fuzzy search** (like spellcheck/autocorrect):
- Uses **Dynamic Programming + DFS** to calculate **Levenshtein distance**
- Only returns words within `maxDist` (edit distance threshold)
- Uses `prevRow/currentRow` matrix to track cost of insertion, deletion, substitution

Returns the top 5 most relevant "close matches" even when the user mistypes.

--


## Features

- Real-time autosuggestions
- Trie data structure implemented from scratch (no external libraries)
- Type-safe development with TypeScript
- Clean and simple UI using modern React practices
- Extensible design for scaling to larger datasets

--

## Tech Stack

- React
- Express
- TypeScript
- HTML & CSS (tailwind)
- Trie (custom logic)

--

## How to Run Locally

1. **Clone the repository:**

   ```bash
         git clone https://github.com/Najma099/Suggestrix.git
         cd Suggestrix
   ```
2.Install dependencies in each sub-folder(Frontend & Backend):

   ```bash
      npm install
   ```
3.Start the development server:

   ```bash
      npm start
   ```
---
#### Open http://localhost:3000 in your browser to view the app.


## Live Demo
Live Demo Link — https://suggestrix.vercel.app/


## ✨ Final Thoughts

I learned a great deal while building this project — especially the power of data structures like Tries in real-world applications like search and suggestion systems. Implementing everything from scratch gave me deep insight into **ranking systems**, **autocomplete UX**, and **search optimization**.

This project is very close to my heart, and I truly enjoyed writing every line of it ‪‪❤︎‬.  
— **Najma**

