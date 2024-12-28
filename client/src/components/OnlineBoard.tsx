import { X_PLAYER, O_PLAYER } from "@/lib/constants";
import Square from "./Square";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useLocation } from "react-router";
import Chat from "./Chat";
import { boardUpdated, OnlineBoardProps } from "@/types";

const OnlineBoard = ({ playersData }: OnlineBoardProps) => {
  const [boardData, setBoardData] = useState<string[]>(Array(9).fill(""));
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleCurrentPlayer = ({
      name,
      id,
    }: {
      name: string;
      id: string;
    }) => {
      console.log(`El primer turno es para ${name}`);
      if (id === playersData.you.id) {
        setIsPlayerTurn(true);
      }
    };

    const handleBoardUpdate = ({
      newBoard,
      nextPlayer,
      winner,
    }: boardUpdated) => {
      setBoardData(newBoard);

      if (nextPlayer.id === playersData.you.id) {
        setIsPlayerTurn(true);
      }

      if (winner) {
        console.log("Llego");
        setWinner(winner);
      }
    };

    socket.on("current-player", handleCurrentPlayer);
    socket.on("board-update", handleBoardUpdate);

    return () => {
      socket.off("current-player", handleCurrentPlayer);
    };
  }, [playersData]);

  const handleClick = (index: number) => {
    const newBoard = [...boardData];

    if (newBoard[index] !== "" || !isPlayerTurn || winner) return;

    if (newBoard[index] === "") {
      if (isPlayerTurn) {
        newBoard[index] = playersData.you.isX ? X_PLAYER : O_PLAYER;
        setIsPlayerTurn((prev) => !prev);

        setBoardData(newBoard);

        socket.emit("player-move", {
          board: newBoard,
          roomCode: location.pathname.split("/")[2],
          playerId: playersData.you.id,
        });
      }
    }
  };

  if (winner) {
    console.log(`The winner is ${winner}`);
  }

  return (
    <div className="p-8 w-[1000px] items-center gap-6 bg-black min-h-[500px] rounded-lg flex flex-col ">
      <div className="w-full flex flex-col gap-1">
        <div className="flex justify-between">
          <p>
            <span>{` ${playersData.you.name} (You)`} </span> vs
            <span>{` ${playersData.enemy.name}`}</span>
          </p>
          <p>{`Current turn: ${
            isPlayerTurn ? playersData.you.name : playersData.enemy.name
          }`}</p>
        </div>

        <div className="w-[100%] h-[4px] bg-gray-700"></div>
      </div>

      <div className="flex w-full justify-center ">
        <div className="w-full flex-1 ">
          <div className="grid-cols-3 grid h-[350px]">
            {boardData.map((item, idx) => (
              <Square key={idx} value={item} OnClick={() => handleClick(idx)} />
            ))}
          </div>
        </div>
        <Chat />
      </div>
    </div>
  );
};

export default OnlineBoard;
