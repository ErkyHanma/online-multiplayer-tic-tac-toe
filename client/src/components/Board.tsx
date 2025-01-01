import { O_PLAYER, winCombs, X_PLAYER } from "@/constants";
import Square from "./Square";
import { useState } from "react";

const Board = () => {
  const [boardData, setBoardData] = useState<string[]>(Array(9).fill(""));
  const [isPlayerTurn, setIsplayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | undefined>("");

  const handleClick = (index: number) => {
    const newBoard = [...boardData];

    if (winner) return;

    if (newBoard[index] === "") {
      if (isPlayerTurn) {
        newBoard[index] = X_PLAYER;
        setIsplayerTurn((prev) => !prev);
      } else {
        newBoard[index] = O_PLAYER;
        setIsplayerTurn((prev) => !prev);
      }

      setBoardData(newBoard);
      setWinner(determineWinner(newBoard));
    }
  };

  const determineWinner = (board: string[]) => {
    for (let i = 0; i < winCombs.length; i++) {
      const arr = winCombs[i];

      if (
        board[arr[0]] &&
        board[arr[0]] === board[arr[1]] &&
        board[arr[1]] === board[arr[2]]
      ) {
        setTimeout(() => {
          alert(`${board[arr[0]]} is the winner`);
        }, 500);

        return board[arr[0]];
      }
    }
  };

  return (
    <div className="w-full flex-1 ">
      <div className="grid-cols-3 grid h-[350px]">
        {boardData.map((item, idx) => (
          <Square key={idx} value={item} OnClick={() => handleClick(idx)} />
        ))}
      </div>
    </div>
  );
};

export default Board;
