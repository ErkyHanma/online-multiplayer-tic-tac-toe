import type { Board } from "./types";

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function determineWinner(board: Board) {
  for (let i = 0; i < winningCombinations.length; i++) {
    const arr = winningCombinations[i];

    if (
      board[arr[0]] &&
      board[arr[0]] === board[arr[1]] &&
      board[arr[1]] === board[arr[2]]
    ) {
      return board[arr[0]];
    }
  }

  // Check for a draw
  if (!board.includes(null) && !board.includes("")) {
    return "Draw"; // All spaces are filled and no winner
  }

  return null;
}

export default determineWinner;
