import { X_PLAYER, O_PLAYER } from "@/constants";
import Square from "./Square";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useLocation } from "react-router";
import Chat from "./Chat";
import { boardUpdated, OnlineBoardProps, playerProps } from "@/lib/types";

import GameOptions from "./ui/GameOptions";
import Counter from "./ui/Counter";
import { useToast } from "@/hooks/use-toast";
import PlayAgainBtn from "./PlayAgainBtn";

const OnlineBoard = ({ playersData }: OnlineBoardProps) => {
  const [boardData, setBoardData] = useState<string[]>(Array(9).fill(""));
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  const roomCode = location.pathname.split("/")[2];

  useEffect(() => {
    const handleCurrentPlayer = ({
      name,
      id,
    }: {
      name: string;
      id: string;
    }) => {
      console.log(`El primer turno es para ${name}`);
      // console.log(playersData);
      // console.log(id);
      // console.log(playersData?.you.id);
      // console.log(id == playersData?.you.id);
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

    const handlePlayAgainRequest = (player: playerProps) => {
      console.log(player);
      toast({
        title: `${player.name} wants to play again?`,
        description: (
          <button
            onClick={() => {
              socket.emit("play-again", roomCode);
            }}
            className=" bg-gray-900 font-semibold p-1 px-3 rounded-lg hover:bg-gray-800 border"
          >
            Accept
          </button>
        ),
      });
    };

    const handlePlayAgain = (player: playerProps) => {
      setBoardData(Array(9).fill(""));
      setWinner(null);

      if (player.id == playersData?.you.id) {
        setIsYourTurn(true);
      } else {
        setIsYourTurn(false);
      }
    };

    socket.on("current-player", handleCurrentPlayer);
    socket.on("board-update", handleBoardUpdate);
    socket.on("play-again-request", handlePlayAgainRequest);
    socket.on("play-again", handlePlayAgain);

    return () => {
      socket.off("current-player", handleCurrentPlayer);
      socket.off("board-update", handleBoardUpdate);
      socket.off("play-again-request", handlePlayAgainRequest);
      socket.off("play-again", handlePlayAgain);
    };
  }, [playersData]);

  const handleClick = (index: number) => {
    const newBoard = [...boardData];

    if (newBoard[index] !== "" || !isYourTurn || winner) return;

    newBoard[index] = playersData?.you.isX ? X_PLAYER : O_PLAYER;
    setIsYourTurn((prev) => !prev);

    setBoardData(newBoard);

    socket.emit("player-move", {
      board: newBoard,
      roomCode: roomCode,
      playerId: playersData?.you.id,
    });
  };

  return (
    <div className="p-8  min-h-s' w-full lg:w-[1000px] items-center gap-6 bg-black  md:rounded-lg flex flex-col ">
      <div className="w-full  flex flex-col gap-1">
        <div className="flex justify-between items-end border-b-4 pb-2 border-b-gray-700">
          <p className="text-lg font-medium ">{` ${
            winner
              ? `Player ${winner} wins`
              : isYourTurn
                ? "Your turn"
                : ` Player ${
                    playersData?.enemy.isX ? X_PLAYER : O_PLAYER
                  } is picking`
          }`}</p>
          {!winner ? (
            <Counter isYourTurn={isYourTurn} setIsYourTurn={setIsYourTurn} />
          ) : (
            <PlayAgainBtn roomCode={roomCode} playersData={playersData} />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8  md:flex-row w-full justify-center ">
        <div className="w-full">
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
        <Chat roomCode={roomCode} playerData={playersData.you} />
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
