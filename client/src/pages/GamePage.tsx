import Square from "@/components/Square";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import GameOptions from "@/components/ui/GameOptions";
import { O_PLAYER, winCombs, X_PLAYER } from "@/constants";
import { useState } from "react";

const GamePage = () => {
  const name = localStorage.getItem("name");

  const [boardData, setBoardData] = useState<string[]>(Array(9).fill(""));
  const [isPlayerTurn, setIsplayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | undefined | null>("");

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

  function determineWinner(board: string[]) {
    for (let i = 0; i < winCombs.length; i++) {
      const arr = winCombs[i];

      if (
        board[arr[0]] &&
        board[arr[0]] === board[arr[1]] &&
        board[arr[1]] === board[arr[2]]
      ) {
        return board[arr[0]];
      }
    }

    // Check for a draw
    if (!board.includes("")) {
      return "Draw";
    }

    return null;
  }

  console.log(winner);

  const handlePlayAgain = () => {
    setBoardData(Array(9).fill(""));
    setWinner("");
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-12">
      <div className="flex h-screen w-full flex-col items-center gap-6 border-gray-900 dark:border-gray-700 bg-inherit p-8 md:rounded-lg lg:h-[550px] lg:w-[800px] lg:border-2">
        <div className="flex w-full items-end justify-center gap-1 border-b-2 border-gray-900 py-2 dark:border-gray-700">
          {winner ? (
            <p className="text-xl font-medium">{`${winner === X_PLAYER || winner === O_PLAYER ? `Player ${winner} wins` : winner}`}</p>
          ) : (
            <p className="text-xl font-medium">
              {isPlayerTurn ? X_PLAYER : O_PLAYER} Turn
            </p>
          )}
        </div>

        <div className="flex w-full justify-center md:w-[70%] lg:w-[60%]">
          <div className="w-full flex-1">
            <div
              className={`grid h-[350px] grid-cols-3 ${winner && "bg-gray-300 dark:bg-gray-900"}`}
            >
              {boardData.map((item, idx) => (
                <Square
                  key={idx}
                  value={item}
                  OnClick={() => handleClick(idx)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex w-full items-center justify-between border-t-2 border-gray-900 dark:border-gray-700 py-4">
          <p className="font-semibold">{name}</p>
          {winner && (
            <button
              onClick={handlePlayAgain}
              className="absolute left-1/2 top-8 mx-auto -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-950 bg-inherit p-2 font-semibold hover:bg-gray-300 dark:border-gray-800 dark:hover:bg-gray-900"
            >
              Play Again
            </button>
          )}
          <div className="flex items-center justify-center gap-2">
            <ThemeSwitcher />
            <GameOptions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
