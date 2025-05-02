import { X_PLAYER, O_PLAYER, playAudio } from "@/constants";
import Square from "./Square";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useLocation, useNavigate } from "react-router";
import Chat from "./Chat";
import { boardUpdated, OnlineBoardProps, playerProps } from "@/lib/types";
import GameOptions from "./GameOptions";
import Counter from "./Counter";
import { useToast } from "@/hooks/use-toast";
import PlayAgainBtn from "./PlayAgainBtn";
import ThemeSwitcher from "./ThemeSwitcher";
import { playSound } from "@/lib/utils";

const OnlineBoard = ({ playersData }: OnlineBoardProps) => {
  const [boardData, setBoardData] = useState<string[]>(Array(9).fill(null));
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast, dismiss } = useToast();
  const roomCode = location.pathname.split("/")[2];

  useEffect(() => {
    const handleCurrentPlayerTurn = ({ id }: { id: string }) => {
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
      toast({
        title: `${player.name} wants to play again?`,
        description: (
          <button
            onClick={() => {
              socket.emit("play-again", roomCode);
              dismiss();
            }}
            className="rounded-lg border bg-gray-900 p-1 px-3 font-semibold hover:bg-gray-800"
          >
            Accept
          </button>
        ),
      });
    };

    const handlePlayAgain = (player: playerProps) => {
      // Reset game
      setBoardData(Array(9).fill(null));
      setWinner(null);

      if (player.id == playersData?.you.id) {
        setIsYourTurn(true);
      } else {
        setIsYourTurn(false);
      }
    };

    const handlePlayerDiscconect = (value: playerProps) => {
      toast({
        title: `Player ${value.name} left the room`,
        description: `Returning to the lobby ...`,
      });

      setTimeout(() => {
        navigate("/online");
      }, 5000);
    };

    socket.on("current-player-turn", handleCurrentPlayerTurn);
    socket.on("board-update", handleBoardUpdate);
    socket.on("play-again-request", handlePlayAgainRequest);
    socket.on("play-again", handlePlayAgain);
    socket.on("player-disconnect", handlePlayerDiscconect);

    return () => {
      socket.off("current-player-turn", handleCurrentPlayerTurn);
      socket.off("board-update", handleBoardUpdate);
      socket.off("play-again-request", handlePlayAgainRequest);
      socket.off("play-again", handlePlayAgain);
      socket.off("player-disconnect", handlePlayerDiscconect);
    };
  }, [playersData, roomCode, navigate, toast, dismiss]);

  const handleClick = (index: number) => {
    const newBoard = [...boardData];

    if (newBoard[index] !== null || !isYourTurn || winner) return;
    playSound(playAudio);

    newBoard[index] = playersData?.you.isPlayerX ? X_PLAYER : O_PLAYER;
    setIsYourTurn((prev) => !prev);

    setBoardData(newBoard);

    socket.emit("player-move", {
      board: newBoard,
      roomCode: roomCode,
      playerId: playersData?.you.id,
    });
  };

  return (
    <div className="flex w-full flex-col items-center gap-6 border-gray-900 bg-inherit p-8 dark:border-gray-700 md:rounded-lg md:border-2 lg:w-[1000px]">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-end justify-between border-b-2 border-gray-900 pb-2 dark:border-gray-700">
          <p className="text-lg font-medium">
            {winner
              ? winner === "Draw"
                ? "Draw"
                : winner === (playersData?.you.isPlayerX ? X_PLAYER : O_PLAYER)
                  ? "You Win"
                  : "You Lose"
              : isYourTurn
                ? `Your turn (${playersData?.you.isPlayerX ? X_PLAYER : O_PLAYER})`
                : `Player (${playersData?.enemy.isPlayerX ? X_PLAYER : O_PLAYER}) is picking`}
          </p>

          {!winner ? (
            <Counter isYourTurn={isYourTurn} setIsYourTurn={setIsYourTurn} />
          ) : (
            <PlayAgainBtn roomCode={roomCode} playersData={playersData} />
          )}
        </div>
      </div>

      <div className="flex w-full flex-col justify-center gap-8 md:flex-row">
        <div className="w-full">
          <div
            className={`grid grid-cols-3 ${!isYourTurn && "bg-gray-300 dark:bg-gray-900"} h-[300px] sm:h-[350px]`}
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

      <div className="mt-2 flex w-full flex-col gap-2">
        <div className="flex justify-between border-t-2 border-gray-900 pt-2 dark:border-gray-700">
          <p className="font-semibold">
            <span>{` ${playersData?.you.name} (You)`} </span> vs
            <span>{` ${playersData?.enemy.name}`}</span>
          </p>
          <div className="flex items-center justify-center gap-2">
            <ThemeSwitcher />
            <GameOptions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineBoard;
