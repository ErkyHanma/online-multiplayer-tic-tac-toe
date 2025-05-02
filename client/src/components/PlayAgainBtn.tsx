import { useState } from "react";
import { playersProps } from "@/lib/types";
import { socket } from "@/socket";

const PlayAgainBtn = ({
  roomCode,
  playersData,

}: {
  roomCode: string;
  playersData: playersProps;

}) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    if (isDisabled) return;

    // Disable the button to prevent multiple clicks
    setIsDisabled(true);

    // Emit the socket event
    socket.emit("play-again-request", {
      playerData: playersData.you,
      roomCode: roomCode,
    });

    setTimeout(() => setIsDisabled(false), 5000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`rounded-lg border-2 bg-inherit p-2 font-semibold hover:bg-gray-200 dark:border-gray-800 dark:hover:bg-gray-900 ${
        isDisabled && "cursor-not-allowed opacity-50"
      }`}
    >
      {isDisabled ? "Waiting..." : "Play Again"}
    </button>
  );
};

export default PlayAgainBtn;
