# Suggestrix 
This project implements an auto-suggest & auto-complete system using Trie and MySQL.

## Features
- Suggests top 4 words for a given prefix.
- Stores search history and ranks words by frequency.

##File Structure
📂 AutoSuggest-AutoCorrect
│── 📂 backend
│   │── 📂 database
│   │   │── schema.sql        # SQL script to create & populate tables
│   │   │── db_config.h       # Database connection config (C++ MySQL)
│   │   │── db_config.cpp     # Database connection logic
│   │── 📂 trie
│   │   │── trie.h            # Trie class header file
│   │   │── trie.cpp          # Trie class implementation
│   │   │── trie_test.cpp     # Unit tests for Trie
│   │── main.cpp              # Main backend logic
│   │── server.cpp            # Backend API server (optional, for deployment)
│   │── CMakeLists.txt        # Build file for C++ (if using CMake)
│── 📂 frontend
│   │── index.html            # Main web page
│   │── style.css             # Styling for UI
│   │── script.js             # JavaScript to handle AJAX requests
│── 📂 data
│   │── wordlist.txt          # Large dictionary of words (from Wikipedia API)
│   │── preprocessing.py      # Cleans & imports words into MySQL
│   │── 📂 api
│   │   │── fetch_wikipedia.py  # Python script to fetch data from Wikipedia API
│   │   │── process_data.py      # Filters, cleans, and prepares data
│── 📂 docs
│   │── README.md             # Project overview and instructions
│   │── LICENSE               # Open-source license file (MIT or custom)
│── .gitignore                # Ignore unnecessary files
│── requirements.txt          # Dependencies for Python scripts
