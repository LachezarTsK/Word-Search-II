
#include <array>
#include <memory>
#include <string>
#include <vector>
using namespace std;

struct TrieNode {
    inline static const int ALPHABET_SIZE {26};
    array<shared_ptr<TrieNode>, ALPHABET_SIZE> branches{};
    bool isLeaf {true};
    bool isEndOfWord {false};
};

class Trie {
    
public:
    const shared_ptr<TrieNode> rootTrieNode {make_shared<TrieNode>()};

    //C++20: ...addWord(string_view word)
    void addWord(const string& word) const {
        shared_ptr<TrieNode> current{ rootTrieNode};

        for (const auto& letter : word) {
            int indexBranches = letter - 'a';
            if (current->branches[indexBranches] == nullptr) {
                current->isLeaf = false;
                current->branches[indexBranches] = make_shared<TrieNode>();
            }
            current = current->branches[indexBranches];
        }
        current->isEndOfWord = true;
    }

    //C++20: ...addWord(string_view word)
    bool wordFound(const string& word) const {
        shared_ptr<TrieNode> current{ rootTrieNode};

        for (const auto& letter : word) {
            int indexBranches = letter - 'a';
            if (current->branches[indexBranches] == nullptr) {
                break;
            }
            current = current->branches[indexBranches];
            if (current->isEndOfWord) {
                return true;
            }
        }
        return false;
    }
};

class Solution {
    
    inline static const char VISITED = '\u0000';
    inline static const array<array<int, 2>, 4> moves{{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}};
    vector<string> allWordsOnBoard;
    size_t rows;
    size_t columns;

public:
    vector<string> findWords(vector<vector<char>>& board, const vector<string>& dictionary) {
        rows = board.size();
        columns = board[0].size();

        const Trie trie{};
        addAllWordsInDictionaryToTrie(dictionary, trie);

        for (int row = 0; row < rows; ++row) {
            for (int column = 0; column < columns; ++column) {
                string word{};
                findAllWordsOnBoard(board, trie.rootTrieNode, word, row, column);
            }
        }
        return allWordsOnBoard;
    }

private:
    void addAllWordsInDictionaryToTrie(const vector<string>& dictionary, const Trie& trie) const {
        for (const auto& word : dictionary) {
            trie.addWord(word);
        }
    }

    void findAllWordsOnBoard(vector<vector<char>>& board, shared_ptr<TrieNode> previousNode, string& word, int row, int column) {
        if (previousNode == nullptr || previousNode->branches[board[row][column] - 'a'] == nullptr) {
            return;
        }

        shared_ptr<TrieNode> nextNode = previousNode->branches[board[row][column] - 'a'];
        char letter = board[row][column];
        word.push_back(letter);
        board[row][column] = VISITED;

        if (nextNode->isEndOfWord) {
            allWordsOnBoard.push_back(word);
            //all words are unique: assign 'false' to 'isEndOfWord' instead of storing the results in a HashSet.
            nextNode->isEndOfWord = false;
        }

        for (const auto move : moves) {
            int nextRow = row + move[0];
            int nextColumn = column + move[1];
            if (isInBoard(nextRow, nextColumn) && board[nextRow][nextColumn] != VISITED) {
                findAllWordsOnBoard(board, nextNode, word, nextRow, nextColumn);
            }
        }

        word.pop_back();
        board[row][column] = letter;
        if (nextNode->isLeaf) {
            //cut leaf in order to shorten the time for next searches.
            previousNode->branches[board[row][column] - 'a'] = nullptr;
        }
    }

    bool isInBoard(int row, int column) const {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }
};
