# **Autocomplete System**

## **Project Overview**
This project is an **efficient autocomplete search engine** using **Trie data structure** with optimized data storage and ranking based on **search frequency** and **word frequency** and at the end **lexicographically**. It suggests the top words dynamically based on user interactions. Currently it autoComplete just a word with future plan of making it work for phrases. 

---

## Note
For now, I am writing code in `test.cpp`. Once I am a little satisfied with the implementation, I will create separate header files (`.h`) and C++ files (`.cpp`).

### How to Compile and Run:
Use the following command to compile and execute the code:

```sh
g++ -std=c++11 -o test test.cpp && ./test

g++ -std=c++17 -o test test.cpp && ./test

```
---
## **Features**
- **Fast Autocomplete Suggestions**: Provides top word suggestions in real-time.
- **Search Ranking**: Prioritizes words based on search frequency.
- **Compressed Trie Storage**: Optimized data structure for space efficiency.
- **Dynamic Updates**: Learns from user searches and updates rankings.
- **JSON Data Parsing**: Loads initial word frequency data from a JSON file.
- **Frontend Integration**: HTML/CSS/JavaScript for UI.

---

## **Tech Stack**
### **Backend**
- **C++**: Implements Trie with optimized storage and ranking.
- **JSON Parsing**: Reads word frequency data.

### **Frontend**
- **HTML/CSS/JavaScript**: Provides a lightweight and interactive UI.

---

## **Installation & Usage**
### **1. Clone the Repository**
```sh
    git clone https://github.com/Najma099/Suggestrix
    cd Suggestrix
```

### **2. Compile & Run Backend**
```sh
    g++ -o Suggestrix main.cpp
    ./Suggestrix
```

### **3. Run Frontend**
- Open `index.html` in a browser.
- Start typing in the search box to see suggestions.

---

## **Future Improvements**
-  **Auto Correction** ()
-  **Better Ranking Algorithm** (TF-IDF based ranking)

---

## **Notes:**
Thank you for visiting this repository. This project is very close to my heart, and I have plans to improve and further optimize it. Please reach out to me with your valuable suggestions and feedback.

Cheers! Happy Coding!
Najma

