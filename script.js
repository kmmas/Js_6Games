document.getElementById("gameForm").addEventListener('change', function (e) {
    let game = e.target.value;
    document.getElementById("mainmenu").style.setProperty('display', 'none');
    document.getElementById("container").style.setProperty('display', 'flex');
    switch (game) {
        case '1':
            new Chess();
            break;
        case '2':
            new EightQueens();
            break;
        case '3':
            new Connect4();
            break;
        case '4':
            new Sudoku();
            break;
        case '5':
            new TicTacToe();
            break;
        case '6':
            new Checkers();
            break;
    }
}, { once: true });
/**
 * is used to take input from the user
 * 
 * it returns a promise that is resolved when the user
 * click "Enter" (i.e., when the user finishes entering the input)
 * @returns {Promise<string>} a promise that we can wait on
 *                            until it is resolved
 */
function getUserInput() {
    return new Promise((resolve) => {
        document.onkeydown = function (e) {
            if (e.key === "Enter") {
                let x = document.getElementById("gameInput").value;
                document.getElementById("gameInput").value = '';
                resolve(x);
            }
        }
    });
}
class ChessState {

    board;
    turns;

    constructor() {
        this.turns = 1;
        this.board = Array.from(Array(8), () => new Array(8).fill(" "));
        for (let i = 0; i < 8; i++) {
            this.board[1][i] = "♟︎";
            this.board[6][i] = "♙";
        }
        this.board[0][0] = "♜";
        this.board[0][7] = "♜";
        this.board[0][1] = "♞";
        this.board[0][6] = "♞";
        this.board[0][2] = "♝";
        this.board[0][5] = "♝";
        this.board[0][3] = "♛";
        this.board[0][4] = "♚";
        this.board[7][0] = "♖";
        this.board[7][7] = "♖";
        this.board[7][1] = "♘";
        this.board[7][6] = "♘";
        this.board[7][2] = "♗";
        this.board[7][5] = "♗";
        this.board[7][3] = "♕";
        this.board[7][4] = "♔";
    }

    getPlayer(piecePosition) {
        let piece = this.board[piecePosition[0]][piecePosition[1]];
        if (piece === " ")
            return 0
        if (["♙", "♗", "♘", "♕", "♔", "♖"].includes(piece))
            return 1;
        return 2;
    }
    whoseTurn() {
        if (this.turns % 2 === 0)
            return 2;
        return 1;
    }
    isLStep(startPosition, endPosition) {
        let rowDiff = endPosition[0] - startPosition[0];
        let colDiff = endPosition[1] - startPosition[1];
        if (rowDiff === 0 || colDiff === 0)
            return false;
        if (Math.abs(rowDiff) + Math.abs(colDiff) === 3)
            return true;
    }
    isKingStep(startPosition, endPosition) {
        let rowDiff = endPosition[0] - startPosition[0];
        let colDiff = endPosition[1] - startPosition[1];
        if (Math.abs(rowDiff) > 1 || Math.abs(colDiff) > 1)
            return false;
        else
            return true;
    }
    isPawnStep(startPosition, endPosition) {
        let rowDiff = endPosition[0] - startPosition[0];
        let colDiff = endPosition[1] - startPosition[1];
        let player = this.getPlayer(startPosition);
        if (player === 1) {
            if (rowDiff === -2 && startPosition[0] === 6 && this.getPlayer(endPosition) === 0)
                return true;
            if (rowDiff != -1)
                return false;
            switch (colDiff) {
                case 0:
                    if (this.getPlayer(endPosition) !== 0)
                        return false;
                    break;
                case 1:
                case -1:
                    if (this.getPlayer(endPosition) !== 2)
                        return false;
                    break;
            }
        } else {
            if (rowDiff === 2 && startPosition[0] === 1 && this.getPlayer(endPosition) === 0)
                return true;
            if (rowDiff != 1)
                return false;
            switch (colDiff) {
                case 0:
                    if (this.getPlayer(endPosition) !== 0)
                        return false;
                    break;
                case 1:
                case -1:
                    if (this.getPlayer(endPosition) !== 1)
                        return false;
                    break;
            }
        }
        return true;
    }
    isVertical(startPosition, endPosition) {
        let rowDiff = endPosition[0] - startPosition[0];
        let colDiff = endPosition[1] - startPosition[1];
        if (colDiff != 0)
            return false;
        let step;
        if (rowDiff > 0)
            step = 1;
        else
            step = -1;
        let newRowDiff = step;
        while (newRowDiff != rowDiff) {
            if (this.board[startPosition[0] + newRowDiff][startPosition[1]] !== " ")
                return false;
            newRowDiff += step;
        }
        return true;
    }
    isHorizontal(startPosition, endPosition) {
        let rowDiff = endPosition[0] - startPosition[0];
        let colDiff = endPosition[1] - startPosition[1];
        if (rowDiff != 0)
            return false;
        let step;
        if (colDiff > 0)
            step = 1;
        else
            step = -1;

        let newColDiff = step;
        while (newColDiff != colDiff) {
            if (this.board[startPosition[0]][startPosition[1] + newColDiff] !== " ")
                return false;
            newColDiff += step;
        }
        return true;
    }
    isDiagonal(startPosition, endPosition) {
        let rowDiff = endPosition[0] - startPosition[0];
        let colDiff = endPosition[1] - startPosition[1];
        if (Math.abs(rowDiff) != Math.abs(colDiff))
            return false;

        let rowStep;
        let colStep;

        if (rowDiff > 0)
            rowStep = 1;
        else
            rowStep = -1;

        if (colDiff > 0)
            colStep = 1;
        else
            colStep = -1;

        let newRowDiff = rowStep;
        let newColDiff = colStep;

        while (newRowDiff != rowDiff) {
            if (this.board[startPosition[0] + newRowDiff][startPosition[1] + newColDiff] !== " ")
                return false;
            newRowDiff += rowStep
            newColDiff += colStep;
        }
        return true;
    }
    isValidMoves(startPosition, endPosition) {
        let player = this.getPlayer(startPosition);
        if (this.getPlayer(endPosition) === player || player !== this.whoseTurn())
            return false;
        let piece = this.board[startPosition[0]][startPosition[1]];
        switch (piece) {
            case "♟︎":
            case "♙":
                return this.isPawnStep(startPosition, endPosition);
            case "♜":
            case "♖":
                return this.isHorizontal(startPosition, endPosition) || this.isVertical(startPosition, endPosition);
            case "♝":
            case "♗":
                return this.isDiagonal(startPosition, endPosition);
            case "♛":
            case "♕":
                return this.isHorizontal(startPosition, endPosition) || this.isVertical(startPosition, endPosition) || this.isDiagonal(startPosition, endPosition);
            case "♚":
            case "♔":
                return this.isKingStep(startPosition, endPosition);
            case "♞":
            case "♘":
                return this.isLStep(startPosition, endPosition);
        }
    }
}

class TicTacToeState {
    board;
    turns;
    constructor() {
        this.turns = 1;
        this.board = Array.from(Array(3), () => new Array(3).fill(0));
    }

    whoseTurn() {
        if (this.turns % 2 === 0)
            return 2;
        return 1;
    }

    isPositionEmpty(position) {
        if (this.board[position[0]][position[1]] === 0)
            return true;
        else
            return false;
    }
}
class Connect4State {
    board;
    turns;
    constructor() {
        this.turns = 1;
        this.board = Array.from(Array(6), () => new Array(7).fill(0));
    }

    whoseTurn() {
        if (this.turns % 2 === 0)
            return 2;
        return 1;
    }

    isPositionEmpty(position) {
        if (this.board[position[0]][position[1]] === 0)
            return true;
        else
            return false;
    }

    doMoveIfValid(col) {
        for (let i = 0; i < 6; i++) {
            if (this.board[5 - i][col] === 0) {
                this.board[5 - i][col] = this.whoseTurn();
                this.turns++;
                return true;
            }
        }
        return false;
    }
}
class EightQueensState {
    queensPositions;
    constructor() {
        this.queensPositions = [];
    }
    isSharingCol(position1, position2) {
        let colDiff = position2[1] - position1[1];
        if (colDiff != 0)
            return false;
        return true;
    }
    isSharingRow(position1, position2) {
        let rowDiff = position2[0] - position1[0];
        if (rowDiff != 0)
            return false;
        return true;
    }
    isSharingDiagonal(position1, position2) {
        let rowDiff = position2[0] - position1[0];
        let colDiff = position2[1] - position1[1];
        if (Math.abs(rowDiff) != Math.abs(colDiff))
            return false;
        return true;
    }
    isSharing(position1, position2) {
        return this.isSharingCol(position1, position2)
            || this.isSharingRow(position1, position2)
            || this.isSharingDiagonal(position1, position2);
    }
    moveIsValid(position) {
        if (this.queensPositions.length === 8)
            return false;
        for (let i = 0; i < this.queensPositions.length; i++) {
            if (this.isSharing(this.queensPositions[i], position))
                return false;
        }
        return true;
    }
    addQueen(position) {
        this.queensPositions.push(position);
    }
    isEmpty(position) {
        for (let i = 0; i < this.queensPositions.length; i++) {
            let pos = this.queensPositions[i];
            if (position[0] === pos[0] && position[1] === pos[1])
                return false;
        }
        return true;
    }
    removeQueen(position) {
        for (let i = 0; i < this.queensPositions.length; i++) {
            let pos = this.queensPositions[i];
            if (position[0] === pos[0] && position[1] === pos[1]) {
                this.queensPositions.splice(i, 1);
                break;
            }
        }
    }
}
/**
 * an abstract Game engine class.
 * needless to say, you can't make an instance of that class.
 * @class GameEngine
 * @abstract
 */
class GameEngine {

    constructor() {
        if (new.target === GameEngine) {
            throw new TypeError("Cannot make instance of an abstract class");
        }
        this.run();
    }

    /**
     *  @returns {*} the initial state 
     */
    initializer() { }

    /**
     * Draws a game state
     * @param {*} state the state of the game
     */
    drawer(state) { }

    /**
     * @param {*} state the state of the game
     * @param {string} input the input given by a player
     * @returns {{state: any, valid: boolean}} an object containing the -maybe- new state and a boolean value 
     *                                         indicating if the player input was valid or not 
     */
    controller(state, input) { }

    /**
     * contains the main game loop
     * it is async so that it can waits for
     * the input if needed.
     * @async
     */
    async run() {
        let state = this.initializer();
        let valid;
        this.drawer(state);
        while (true) {
            let input = await getUserInput();
            ({ state, valid } = this.controller(state, input));
            if (valid)
                this.drawer(state);
            else
                alert("invalid input");
        }
    }
    
}
/**
 * @class
 * @extends GameEngine
 * @see {@linkcode GameEngine}
 * @see {@linkcode ChessState}
 */
class Chess extends GameEngine {

    /** @override */
    initializer() {
        return new ChessState();
    }

    /** @override */
    drawer(state) {
        let ele = document.getElementById("draw");
        ele.replaceChildren();
        let charRow = ele.appendChild(document.createElement("tr"));
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 8; i++) {
            let char = charRow.appendChild(document.createElement("td"));
            char.classList.add("guide");
            char.append(String.fromCharCode('a'.charCodeAt(0) + i));
        }
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 8; i++) {
            // append row to the table
            let row = ele.appendChild(document.createElement("tr"));
            // adding number column (one by one)
            let numberCol = row.appendChild(document.createElement("td"));
            numberCol.classList.add("guide");
            numberCol.append(8 - i);
            for (let j = 0; j < 8; j++) {
                // appending item to the row
                let item = row.appendChild(document.createElement("td"));
                // organizing colors
                let coloring = (i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0);
                item.style.setProperty('background-color', coloring ? 'grey' : 'white');
                // appending the piece
                item.append(state.board[i][j]);
                // organizing borders
                if (i === 0)
                    item.style.setProperty('border-top', '1px solid black');
                if (i === 7)
                    item.style.setProperty('border-bottom', '1px solid black');
                if (j === 0)
                    item.style.setProperty('border-left', '1px solid black');
                if (j === 7)
                    item.style.setProperty('border-right', '1px solid black');
            }
            numberCol = row.appendChild(document.createElement("td"));
            numberCol.classList.add("guide");
            numberCol.append(8 - i);
        }
        // adding char row
        charRow = ele.appendChild(document.createElement("tr"));
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 8; i++) {
            let char = charRow.appendChild(document.createElement("td"));
            char.classList.add("guide");
            char.append(String.fromCharCode('a'.charCodeAt(0) + i));
        }
        charRow.appendChild(document.createElement("td")).classList.add("guide");
    }

    /** @override */
    controller(state, input) {
        const regex = /^[1-8][a-h] [1-8][a-h]$/;
        if (!regex.test(input))
            return { state: state, valid: false };
        let tmp = this.formulateInput(input);
        let startPosition = tmp[0];
        let endPosition = tmp[1];
        if (state.isValidMoves(startPosition, endPosition)) {
            state.turns++;
            state.board[endPosition[0]][endPosition[1]] = state.board[startPosition[0]][startPosition[1]];
            state.board[startPosition[0]][startPosition[1]] = " ";
            return { state: state, valid: true };
        } else {
            return { state: state, valid: false };
        }
    }

    formulateInput(input) {
        let tmp = input.trim().split(" ");
        let startPosition = this.getIndexesFromString(tmp[0]);
        let endPosition = this.getIndexesFromString(tmp[1]);
        return [startPosition, endPosition];
    }

    getIndexesFromString(input) {
        let row = 8 - Number(input.charAt(0));
        let col = input.charCodeAt(1) - "a".charCodeAt(0);
        return [row, col];
    }
}

/**
 * @class
 * @extends GameEngine
 * @see {@linkcode GameEngine}
 */
class TicTacToe extends GameEngine {

    /** @override */
    initializer() {
        return new TicTacToeState();
    }

    /** @override */
    drawer(state) {
        let ele = document.getElementById("draw");
        ele.replaceChildren();
        let charRow = ele.appendChild(document.createElement("tr"));
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 3; i++) {
            let char = charRow.appendChild(document.createElement("td"));
            char.classList.add("guide");
            char.append(String.fromCharCode('a'.charCodeAt(0) + i));
        }
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 3; i++) {
            // append row to the table
            let row = ele.appendChild(document.createElement("tr"));
            // adding number column (one by one)
            let numberCol = row.appendChild(document.createElement("td"));
            numberCol.classList.add("guide");
            numberCol.append(3 - i);
            for (let j = 0; j < 3; j++) {
                // appending item to the row
                let item = row.appendChild(document.createElement("td"));
                // organizing
                switch (state.board[i][j]) {
                    case 0:
                        item.append(" ");
                        item.style.setProperty('color', 'white');
                        break;
                    case 1:
                        item.append("X");
                        item.style.setProperty('color', 'red');
                        break;
                    case 2:
                        item.append("O");
                        item.style.setProperty('color', 'blue');
                        break;
                }
                // organizing borders
                item.style.setProperty('border', '1px solid black');
            }
            numberCol = row.appendChild(document.createElement("td"));
            numberCol.classList.add("guide");
            numberCol.append(3 - i);
        }
        // adding char row
        charRow = ele.appendChild(document.createElement("tr"));
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 3; i++) {
            let char = charRow.appendChild(document.createElement("td"));
            char.classList.add("guide");
            char.append(String.fromCharCode('a'.charCodeAt(0) + i));
        }
        charRow.appendChild(document.createElement("td")).classList.add("guide");
    }

    /** @override */
    controller(state, input) {
        const regex = /^[1-3][a-c]$/;
        if (!regex.test(input))
            return { state: state, valid: false };
        let position = this.getIndexesFromString(input.trim());
        if (!state.isPositionEmpty(position)) {
            return { state: state, valid: false };
        }
        else {
            state.board[position[0]][position[1]] = state.whoseTurn();
            state.turns++;
            return { state: state, valid: true };
        }
    }

    getIndexesFromString(input) {
        let row = 3 - Number(input.charAt(0));
        let col = input.charCodeAt(1) - "a".charCodeAt(0);
        return [row, col];
    }
}

class Connect4 extends GameEngine {
    initializer() {
        return new Connect4State();
    }
    drawer(state) {
        let ele = document.getElementById("draw");
        ele.replaceChildren();
        for (let i = 0; i < 6; i++) {
            // append row to the table
            let row = ele.appendChild(document.createElement("tr"));
            for (let j = 0; j < 7; j++) {
                // appending item to the row
                let item = row.appendChild(document.createElement("td"));
                // appending the number
                item.append(document.createTextNode('⬤'));
                switch (state.board[i][j]) {
                    case 0:
                        item.style.setProperty('color', 'white');
                        break;
                    case 1:
                        item.style.setProperty('color', '#ffff00');
                        break;
                    case 2:
                        item.style.setProperty('color', '#ff0000');
                        break;

                }
                item.style.setProperty('background-color', '#0070BF');
            }
        }
        // adding char row
        let charRow = ele.appendChild(document.createElement("tr"));
        for (let i = 0; i < 7; i++) {
            let char = charRow.appendChild(document.createElement("td"));
            char.classList.add("guide");
            char.append(String.fromCharCode('a'.charCodeAt(0) + i));
        }
    }
    controller(state, input) {
        const regex = /^[a-g]$/;
        if (!regex.test(input))
            return { state: state, valid: false };
        let col = input.charCodeAt(0) - "a".charCodeAt(0);
        return { state: state, valid: state.doMoveIfValid(col) };
    }
}

class EightQueens extends GameEngine {

    initializer() {
        return new EightQueensState();
    }

    drawer(state) {
        let ele = document.getElementById("draw");
        ele.replaceChildren();
        let charRow = ele.appendChild(document.createElement("tr"));
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 8; i++) {
            let char = charRow.appendChild(document.createElement("td"));
            char.classList.add("guide");
            char.append(String.fromCharCode('a'.charCodeAt(0) + i));
        }
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 8; i++) {
            // append row to the table
            let row = ele.appendChild(document.createElement("tr"));
            // adding number column (one by one)
            let numberCol = row.appendChild(document.createElement("td"));
            numberCol.classList.add("guide");
            numberCol.append(8 - i);
            for (let j = 0; j < 8; j++) {
                // appending item to the row
                let item = row.appendChild(document.createElement("td"));
                // organizing colors
                let coloring = (i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0);
                item.style.setProperty('background-color', coloring ? 'grey' : 'white');
                // appending the piece
                if (!state.isEmpty([i, j]))
                    item.append("♛");
                // organizing borders
                if (i === 0)
                    item.style.setProperty('border-top', '1px solid black');
                if (i === 7)
                    item.style.setProperty('border-bottom', '1px solid black');
                if (j === 0)
                    item.style.setProperty('border-left', '1px solid black');
                if (j === 7)
                    item.style.setProperty('border-right', '1px solid black');
            }
            numberCol = row.appendChild(document.createElement("td"));
            numberCol.classList.add("guide");
            numberCol.append(8 - i);
        }
        // adding char row
        charRow = ele.appendChild(document.createElement("tr"));
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 8; i++) {
            let char = charRow.appendChild(document.createElement("td"));
            char.classList.add("guide");
            char.append(String.fromCharCode('a'.charCodeAt(0) + i));
        }
        charRow.appendChild(document.createElement("td")).classList.add("guide");
    }

    controller(state, input) {
        const deleteRegex = /^-[1-8][a-h]$/;
        if (deleteRegex.test(input)) {
            let toBeDeleted = this.getIndexesFromString(input.substring(1));
            if (state.isEmpty(toBeDeleted)) {
                return { state: state, valid: false };
            } else {
                state.removeQueen(toBeDeleted);
                return { state: state, valid: true };
            }
        }
        const regex = /^[1-8][a-h]$/;
        if (!regex.test(input))
            return { state: state, valid: false };
        let newQueenPosition = this.getIndexesFromString(input);
        if (!state.isEmpty(newQueenPosition) || !state.moveIsValid(newQueenPosition)) {
            return { state: state, valid: false };
        }
        else {
            state.addQueen(newQueenPosition);
            return { state: state, valid: true };
        }
    }
    getIndexesFromString(input) {
        let row = 8 - Number(input.charAt(0));
        let col = input.charCodeAt(1) - "a".charCodeAt(0);
        return [row, col];
    }
}

class SudokuState {
    board = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 1, 4, 3, 6, 5, 8, 9, 7],
        [3, 6, 5, 8, 9, 7, 2, 1, 4],
        [8, 9, 7, 2, 1, 4, 3, 6, 5],
        [5, 3, 1, 6, 4, 2, 9, 7, 8],
        [6, 4, 2, 9, 7, 8, 5, 3, 1],
        [9, 7, 8, 5, 3, 1, 6, 4, 2]
    ];

    unchangeable;

    constructor() {
        this.unchangeable = Array.from(Array(9), () => new Array(9).fill(true));
        this.randomizeBoard();
        this.removeElements(51);
    }

    isValid(position, value) {
        let row = position[0];
        let col = position[1];
        for (let i = 0; i < 9; i++) {
            if (this.board[row][i] === value || this.board[i][col] === value) {
                return false;
            }
            let subRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
            let subCol = Math.floor(col / 3) * 3 + (i % 3);
            if (this.board[subRow][subCol] === value) {
                return false;
            }
        }
        return true;
    }

    getRandomNumber(limit) {
        return Math.floor(Math.random() * limit);
    }

    randomizeBoard() {
        let iterations = this.getRandomNumber(11);
        for (let i = 0; i < iterations; i++) {

            let s1 = this.getRandomNumber(3);
            let s2 = this.getRandomNumber(3);

            if (s1 === s2)
                continue;

            if (i % 2 === 0)
                this.swapHorizontalSections(s1, s2);
            else
                this.swapVerticalSections(s1, s2);

            let sec = (i % 3) * 3;
            this.swapCols(sec + s1, sec + s2);
            this.swapRows(sec + s1, sec + s2);
        }
    }

    removeElements(num) {
        let number = 0;
        while (number < num) {
            let row = this.getRandomNumber(9);
            let col = this.getRandomNumber(9);
            if (this.board[row][col] !== 0) {
                number++;
                this.board[row][col] = 0;
                this.unchangeable[row][col] = false;
            }
        }
    }

    swapRows(row1, row2) {
        for (let i = 0; i < 9; i++) {
            let tmp = this.board[row1][i];
            this.board[row1][i] = this.board[row2][i];
            this.board[row2][i] = tmp;
        }
    }

    swapCols(col1, col2) {
        for (let i = 0; i < 9; i++) {
            let tmp = this.board[i][col1];
            this.board[i][col1] = this.board[i][col2];
            this.board[i][col2] = tmp;
        }
    }

    swapHorizontalSections(section1, section2) {
        let s1 = section1 * 3;
        let s2 = section2 * 3;
        for (let i = 0; i < 3; i++) {
            this.swapRows(s1 + i, s2 + i);
        }
    }

    swapVerticalSections(section1, section2) {
        let s1 = section1 * 3;
        let s2 = section2 * 3;
        for (let i = 0; i < 3; i++) {
            this.swapCols(s1 + i, s2 + i);
        }
    }
}

class Sudoku extends GameEngine {

    initializer() {
        return new SudokuState();
    }

    drawer(state) {
        let ele = document.getElementById("draw");
        ele.replaceChildren();
        let charRow = ele.appendChild(document.createElement("tr"));
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 9; i++) {
            let char = charRow.appendChild(document.createElement("td"));
            char.classList.add("guide");
            char.append(String.fromCharCode('a'.charCodeAt(0) + i));
        }
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 9; i++) {
            // append row to the table
            let row = ele.appendChild(document.createElement("tr"));
            // adding number column (one by one)
            let numberCol = row.appendChild(document.createElement("td"));
            numberCol.classList.add("guide");
            numberCol.append(9 - i);
            for (let j = 0; j < 9; j++) {
                // appending item to the row
                let item = row.appendChild(document.createElement("td"));
                // appending the number
                if (state.board[i][j] !== 0)
                    item.append(state.board[i][j]);
                else
                    item.append(" ");
                if (state.unchangeable[i][j])
                    item.style.setProperty('font-weight', 'bolder');
                // organizing borders
                item.style.setProperty('border', '1px solid black');
                if (i === 0)
                    item.style.setProperty('border-top', '3px solid black');
                if (i === 8 || i === 2 || i === 5)
                    item.style.setProperty('border-bottom', '3px solid black');
                if (j === 0)
                    item.style.setProperty('border-left', '3px solid black');
                if (j === 8 || j === 2 || j === 5)
                    item.style.setProperty('border-right', '3px solid black');
            }
            numberCol = row.appendChild(document.createElement("td"));
            numberCol.classList.add("guide");
            numberCol.append(9 - i);
        }
        // adding char row
        charRow = ele.appendChild(document.createElement("tr"));
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 9; i++) {
            let char = charRow.appendChild(document.createElement("td"));
            char.classList.add("guide");
            char.append(String.fromCharCode('a'.charCodeAt(0) + i));
        }
        charRow.appendChild(document.createElement("td")).classList.add("guide");
    }

    controller(state, input) {
        const deleteRegex = /^-[1-9][a-i]$/;
        if (deleteRegex.test(input)) {
            let toBeDeleted = this.getIndexesFromString(input.substring(1));
            if (state.unchangeable[toBeDeleted[0]][toBeDeleted[1]]) {
                return { state: state, valid: false };
            } else {
                if (state.board[toBeDeleted[0]][toBeDeleted[1]] !== 0) {
                    state.board[toBeDeleted[0]][toBeDeleted[1]] = 0;
                    return { state: state, valid: true };
                } else {
                    return { state: state, valid: false };
                }
            }
        }
        const regex = /^[1-9][a-i] [1-9]$/;
        if (!regex.test(input))
            return { state: state, valid: false };
        let [position, value] = this.formulateInput(input);
        console.log(state.board[position[0]][position[1]]);
        if (state.board[position[0]][position[1]] === 0 && state.isValid(position, value)) {
            state.board[position[0]][position[1]] = value;
            return { state: state, valid: true };
        } else {
            return { state: state, valid: false };
        }
    }
    formulateInput(input) {
        let tmp = input.trim().split(" ");
        let position = this.getIndexesFromString(tmp[0]);
        let value = Number(tmp[1]);
        return [position, value];
    }
    getIndexesFromString(input) {
        let row = 9 - Number(input.charAt(0));
        let col = input.charCodeAt(1) - "a".charCodeAt(0);
        return [row, col];
    }
}

class CheckersState {
    board;
    turns;
    constructor() {
        this.turns = 1;
        this.board = Array.from(Array(8), () => new Array(8).fill(0));
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (i <= 2 && ((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0))) {
                    this.board[i][j] = 2;
                } else if (i >= 5 && ((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0))) {
                    this.board[i][j] = 1;
                }
            }
        }
    }
    DoifValid(startPosition, endPosition) {

        let player = this.board[startPosition[0]][startPosition[1]];

        if (this.board[endPosition[0]][endPosition[1]] !== 0 || player !== this.whoseTurn())
            return false;

        let rowDiff = endPosition[0] - startPosition[0];
        let colDiff = endPosition[1] - startPosition[1];

        if (Math.abs(colDiff) === 1 && rowDiff === 1 && player === 2) {
            this.board[startPosition[0]][startPosition[1]] = 0;
            this.board[endPosition[0]][endPosition[1]] = 2;
            return true;
        }

        if (Math.abs(colDiff) === 1 && rowDiff === -1 && player === 1) {
            this.board[startPosition[0]][startPosition[1]] = 0;
            this.board[endPosition[0]][endPosition[1]] = 1;
            return true;
        }

        if (Math.abs(colDiff) === 2 && rowDiff === 2 && player === 2) {
            if (this.board[startPosition[0] + 1][startPosition[1] + Math.sign(colDiff)] === 1) {
                this.board[startPosition[0]][startPosition[1]] = 0;
                this.board[startPosition[0] + 1][startPosition[1] + Math.sign(colDiff)] = 0;
                this.board[endPosition[0]][endPosition[1]] = 2;
                return true;
            }
        }

        if (Math.abs(colDiff) === 2 && rowDiff === -2 && player === 1) {
            if (this.board[startPosition[0] - 1][startPosition[1] + Math.sign(colDiff)] === 2) {
                this.board[startPosition[0]][startPosition[1]] = 0;
                this.board[startPosition[0] - 1][startPosition[1] + Math.sign(colDiff)] = 0;
                this.board[endPosition[0]][endPosition[1]] = 1;
                return true;
            }
        }

        return false;
    }
    whoseTurn() {
        if (this.turns % 2 === 0)
            return 2;
        return 1;
    }
}

class Checkers extends GameEngine {

    /** @override */
    initializer() {
        return new CheckersState();
    }

    /** @override */
    drawer(state) {
        let ele = document.getElementById("draw");
        ele.replaceChildren();
        let charRow = ele.appendChild(document.createElement("tr"));
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 8; i++) {
            let char = charRow.appendChild(document.createElement("td"));
            char.classList.add("guide");
            char.append(String.fromCharCode('a'.charCodeAt(0) + i));
        }
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 8; i++) {
            // append row to the table
            let row = ele.appendChild(document.createElement("tr"));
            // adding number column (one by one)
            let numberCol = row.appendChild(document.createElement("td"));
            numberCol.classList.add("guide");
            numberCol.append(8 - i);
            for (let j = 0; j < 8; j++) {
                // appending item to the row
                let item = row.appendChild(document.createElement("td"));
                // organizing colors
                let coloring = (i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0);
                item.style.setProperty('background-color', coloring ? 'grey' : 'white');
                // appending the piece
                switch (state.board[i][j]) {
                    case 0:
                        item.append(" ");
                        break;
                    case 1:
                        item.append("⬤");
                        item.style.setProperty('color', 'red');
                        break;
                    case 2:
                        item.append("⬤");
                        item.style.setProperty('color', 'black');
                        break;
                }
                // organizing borders
                if (i === 0)
                    item.style.setProperty('border-top', '1px solid black');
                if (i === 7)
                    item.style.setProperty('border-bottom', '1px solid black');
                if (j === 0)
                    item.style.setProperty('border-left', '1px solid black');
                if (j === 7)
                    item.style.setProperty('border-right', '1px solid black');
            }
            numberCol = row.appendChild(document.createElement("td"));
            numberCol.classList.add("guide");
            numberCol.append(8 - i);
        }
        // adding char row
        charRow = ele.appendChild(document.createElement("tr"));
        charRow.appendChild(document.createElement("td")).classList.add("guide");
        for (let i = 0; i < 8; i++) {
            let char = charRow.appendChild(document.createElement("td"));
            char.classList.add("guide");
            char.append(String.fromCharCode('a'.charCodeAt(0) + i));
        }
        charRow.appendChild(document.createElement("td")).classList.add("guide");
    }

    /** @override */
    controller(state, input) {
        const regex = /^[1-8][a-h] [1-8][a-h]$/;
        if (!regex.test(input))
            return { state: state, valid: false };
        let tmp = this.formulateInput(input);
        let startPosition = tmp[0];
        let endPosition = tmp[1];
        if (state.DoifValid(startPosition, endPosition)) {
            state.turns++;
            return { state: state, valid: true };
        } else {
            return { state: state, valid: false };
        }
    }

    formulateInput(input) {
        let tmp = input.trim().split(" ");
        let startPosition = this.getIndexesFromString(tmp[0]);
        let endPosition = this.getIndexesFromString(tmp[1]);
        return [startPosition, endPosition];
    }

    getIndexesFromString(input) {
        let row = 8 - Number(input.charAt(0));
        let col = input.charCodeAt(1) - "a".charCodeAt(0);
        return [row, col];
    }
}