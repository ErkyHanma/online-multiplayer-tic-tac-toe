import { X_PLAYER, O_PLAYER } from "@/constants";
import Square from "./Square";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useLocation } from "react-router";
import Chat from "./Chat";
import { boardUpdated, OnlineBoardProps } from "@/lib/types";

import GameOptions from "./ui/GameOptions";
import Counter from "./ui/Counter";

const OnlineBoard = ({ playersData }: OnlineBoardProps) => {
  const [boardData, setBoardData] = useState<string[]>(Array(9).fill(""));
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const location = useLocation();

  console.log(playersData);

  useEffect(() => {
    const handleCurrentPlayer = ({
      name,
      id,
    }: {
      name: string;
      id: string;
    }) => {
      console.log(`El primer turno es para ${name}`);
      if (id == playersData?.you.id) {
        setIsYourTurn(true);
      }
    };

    const handleBoardUpdate = ({
      newBoard,
      nextPlayer,
      winner,
    }: boardUpdated) => {
      setBoardData(newBoard);

      if (nextPlayer.id === playersData?.you.id) {
        setIsYourTurn(true);
      }

      if (winner) {
        setWinner(winner);
        setIsYourTurn(false);
      }
    };

    socket.on("current-player", handleCurrentPlayer);
    socket.on("board-update", handleBoardUpdate);

    return () => {
      socket.off("current-player", handleCurrentPlayer);
      socket.off("board-update", handleBoardUpdate);
    };
  }, []);

  const handleClick = (index: number) => {
    const newBoard = [...boardData];

    if (newBoard[index] !== "" || !isYourTurn || winner) return;

    newBoard[index] = playersData?.you.isX ? X_PLAYER : O_PLAYER;
    setIsYourTurn((prev) => !prev);

    setBoardData(newBoard);

    socket.emit("player-move", {
      board: newBoard,
      roomCode: location.pathname.split("/")[2],
      playerId: playersData?.you.id,
    });
  };

  console.log(isYourTurn);

  return (
    <div className="p-8 w-[1000px]  items-center gap-6 bg-black min-h-[550px] rounded-lg flex flex-col ">
      <div className="w-full flex flex-col gap-1">
        <div className="flex justify-between border-b-4 pb-2 border-b-gray-700">
          <p className="text-lg font-medium ">{` ${
            winner
              ? `Player ${winner} wins`
              : isYourTurn
                ? "Your turn"
                : ` Player ${
                    playersData?.enemy.isX ? X_PLAYER : O_PLAYER
                  } is picking`
          }`}</p>

          {!winner && (
            <Counter isYourTurn={isYourTurn} setIsYourTurn={setIsYourTurn} />
          )}
        </div>
      </div>

      <div className="flex w-full justify-center ">
        <div className="w-full flex-1 ">
          <div
            className={`grid-cols-3 grid ${!isYourTurn && "bg-disable"}   h-[350px]`}
          >
            {boardData.map((item, idx) => (
              <Square
                key={idx}
                value={item}
                isYourTurn={isYourTurn}
                OnClick={() => handleClick(idx)}
              />
            ))}
          </div>
        </div>
        <Chat />
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between border-t-4 pt-2 border-gray-700">
          <p>
            <span>{` ${playersData?.you.name} (You)`} </span> vs
            <span>{` ${playersData?.enemy.name}`}</span>
          </p>
          <GameOptions />
        </div>
      </div>
    </div>
  );
};

export default OnlineBoard;
