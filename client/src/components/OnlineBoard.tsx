import { winCombs, X_PLAYER, O_PLAYER } from "@/lib/constants";
import Square from "./Square";
import { useState } from "react";
import { socket } from "@/socket";
import { useLocation } from "react-router";

type playerProps = {
  name: string;
  id: string;
  isX: boolean;
};

type OnlineBoardProps = {
  playerData: playerProps;
};

const OnlineBoard = ({ playerData }: OnlineBoardProps) => {
  const [boardData, setBoardData] = useState<string[]>(Array(9).fill(""));
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [winner, setWinner] = useState<string | undefined>("");
  const location = useLocation();

  // This event recieve the currentPlayer data and if the currentPlayer is === to your name it turns isPlayerTurn to true
  socket.on("current-player", ({ name, id }) => {
    console.log(`El primer turno es para ${name}`);
    console.log(id === playerData.id);
    if (id === playerData.id) {
      setIsPlayerTurn(true);
    }
  });

  socket.on("board-update", ({ newBoard, nextPlayer }) => {
    setBoardData(newBoard);
    if (nextPlayer.id === playerData.id) {
      setIsPlayerTurn(true);
    }
  });

  const handleClick = (index: number) => {
    const newBoard = [...boardData];

    if (winner) return;

    if (newBoard[index] === "") {
      if (isPlayerTurn) {
        newBoard[index] = playerData.isX ? X_PLAYER : O_PLAYER;
        setIsPlayerTurn((prev) => !prev);

        setBoardData(newBoard);

        socket.emit("player-move", {
          board: newBoard,
          roomCode: location.pathname.split("/")[2],
          playerId: playerData.id,
        });
        setWinner(determineWinner(newBoard));
      }
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

export default OnlineBoard;
