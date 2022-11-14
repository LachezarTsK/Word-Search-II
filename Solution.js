
/**
 * @param {character[][]} board
 * @param {string[]} dictionary
 * @return {string[]}
 */
var findWords = function (board, dictionary) {
    this.VISITED = '\u0000';
    this.ASCII_SMALL_CASE_A = 97;
    this.moves = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    this.rows = board.length;
    this.columns = board[0].length;
    this.allWordsOnBoard = [];

    const trie = new Trie();
    addAllWordsInDictionaryToTrie(dictionary, trie);

    for (let row = 0; row < this.rows; ++row) {
        for (let column = 0; column < this.columns; ++column) {
            findAllWordsOnBoard(board, trie.rootTrieNode, [], row, column);
        }
    }
    return allWordsOnBoard;
};

/**
 * @param {string[]} dictionary 
 *  @param {Trie} trie 
 * @return {void}
 */
function addAllWordsInDictionaryToTrie(dictionary, trie) {
    for (let word of dictionary) {
        trie.addWord(word);
    }
}

/**
 * @param {character[][]} board
 * @param {TrieNode} previousNode
 * @param {string[]} word 
 * @param {number} row
 * @param {number} column
 * @return {boolean}
 */
function findAllWordsOnBoard(board, previousNode, word, row, column) {
    if (previousNode === null || previousNode.branches[indexInBranches(board[row][column])] === null) {
        return;
    }

    let letter = board[row][column];
    let nextNode = previousNode.branches[indexInBranches(letter)];
    word.push(letter);
    board[row][column] = this.VISITED;

    if (nextNode.isEndOfWord) {
        this.allWordsOnBoard.push(word.join(''));
        //all words are unique: assign 'false' to 'isEndOfWord' instead of storing the results in a HashSet.
        nextNode.isEndOfWord = false;
    }

    for (let move of this.moves) {
        let nextRow = row + move[0];
        let nextColumn = column + move[1];
        if (isInBoard(nextRow, nextColumn) && board[nextRow][nextColumn] !== this.VISITED) {
            findAllWordsOnBoard(board, nextNode, word, nextRow, nextColumn);
        }
    }

    word.pop();
    board[row][column] = letter;
    if (nextNode.isLeaf) {
        //cut leaf in order to shorten the time for next searches.
        previousNode.branches[indexInBranches(letter)] = null;
    }
}

/**
 * @param {number} row
 * @param {number} column
 * @return {boolean}
 */
function isInBoard(row, column) {
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns;
}

/**
 * @param {character} letter
 * @return {number}
 */
function indexInBranches(letter) {
    return letter.codePointAt(0) - this.ASCII_SMALL_CASE_A;
}

class TrieNode {

    static ALPHABET_SIZE = 26;
    branches = new Array(TrieNode.ALPHABET_SIZE).fill(null);
    isLeaf = true;
    isEndOfWord = false;
}

class Trie {

    static  ASCII_SMALL_CASE_A = 97;
    rootTrieNode = new TrieNode();

    /**
     * @param {string} word
     * @return {void}
     */
    addWord(word) {
        let current = this.rootTrieNode;

        for (let indexWord = 0; indexWord < word.length; ++indexWord) {
            let indexBranches = word.codePointAt(indexWord) - Trie.ASCII_SMALL_CASE_A;
            if (current.branches[indexBranches] === null) {
                current.isLeaf = false;
                current.branches[indexBranches] = new TrieNode();
            }
            current = current.branches[indexBranches];
        }
        current.isEndOfWord = true;
    }

    /**
     * @param {string} word
     * @return {boolean}
     */
    wordFound(word) {
        let current = this.rootTrieNode;

        for (let indexWord = 0; indexWord < word.length; ++indexWord) {
            let indexBranches = word.codePointAt(indexWord) - Trie.ASCII_SMALL_CASE_A;
            if (current.branches[indexBranches] === null) {
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
