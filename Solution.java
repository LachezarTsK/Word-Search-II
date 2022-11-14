
import java.util.ArrayList;
import java.util.List;

public class Solution {

    private static final char VISITED = '\u0000';
    private static final int[][] moves = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    private List<String> allWordsOnBoard;
    private int rows;
    private int columns;

    public List<String> findWords(char[][] board, String[] dictionary) {
        rows = board.length;
        columns = board[0].length;
        allWordsOnBoard = new ArrayList<>();

        final Trie trie = new Trie();
        addAllWordsInDictionaryToTrie(dictionary, trie);

        for (int row = 0; row < rows; ++row) {
            for (int column = 0; column < columns; ++column) {
                findAllWordsOnBoard(board, trie.rootTrieNode, new StringBuilder(), row, column);
            }
        }
        return allWordsOnBoard;
    }

    private void addAllWordsInDictionaryToTrie(String[] dictionary, Trie trie) {
        for (String word : dictionary) {
            trie.addWord(word);
        }
    }

    private void findAllWordsOnBoard(char[][] board, TrieNode previousNode, StringBuilder word, int row, int column) {
        if (previousNode == null || previousNode.branches[board[row][column] - 'a'] == null) {
            return;
        }

        TrieNode nextNode = previousNode.branches[board[row][column] - 'a'];
        char letter = board[row][column];
        word.append(letter);
        board[row][column] = VISITED;

        if (nextNode.isEndOfWord) {
            allWordsOnBoard.add(word.toString());
            //all words are unique: assign 'false' to 'isEndOfWord' instead of storing the results in a HashSet.
            nextNode.isEndOfWord = false;
        }

        for (int[] move : moves) {
            int nextRow = row + move[0];
            int nextColumn = column + move[1];
            if (isInBoard(nextRow, nextColumn) && board[nextRow][nextColumn] != VISITED) {
                findAllWordsOnBoard(board, nextNode, word, nextRow, nextColumn);
            }
        }

        word.deleteCharAt(word.length() - 1);
        board[row][column] = letter;
        if (nextNode.isLeaf) {
            //cut leaf in order to shorten the time for next searches.
            previousNode.branches[board[row][column] - 'a'] = null;
        }
    }

    private boolean isInBoard(int row, int column) {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }
}

class TrieNode {

    private static final int ALPHABET_SIZE = 26;
    TrieNode[] branches = new TrieNode[ALPHABET_SIZE];
    boolean isLeaf = true;
    boolean isEndOfWord;
}

class Trie {

    final TrieNode rootTrieNode = new TrieNode();

    void addWord(String word) {
        TrieNode current = rootTrieNode;

        for (int indexWord = 0; indexWord < word.length(); ++indexWord) {
            int indexBranches = word.charAt(indexWord) - 'a';
            if (current.branches[indexBranches] == null) {
                current.isLeaf = false;
                current.branches[indexBranches] = new TrieNode();
            }
            current = current.branches[indexBranches];
        }
        current.isEndOfWord = true;
    }

    boolean wordFound(String word) {
        TrieNode current = rootTrieNode;

        for (int indexWord = 0; indexWord < word.length(); ++indexWord) {
            int indexBranches = word.charAt(indexWord) - 'a';
            if (current.branches[indexBranches] == null) {
                break;
            }
            current = current.branches[indexBranches];
            if (current.isEndOfWord) {
                return true;
            }
        }
        return false;
    }
}
