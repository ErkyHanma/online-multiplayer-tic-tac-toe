import { playersProps } from "@/lib/types";
import { socket } from "@/socket";

const PlayAgainBtn = ({
  roomCode,
  playersData,
}: {
  roomCode: string;
  playersData: playersProps;
}) => {
  const handleClick = () => {
    socket.emit("play-again-request", {
      playerData: playersData.you,
      roomCode: roomCode,
    });
  };

  return (
    <button
      onClick={handleClick}
      className=" bg-gray-950 font-semibold p-2 rounded-lg hover:bg-gray-900 border"
    >
      Play Again
    </button>
  );
};

export default PlayAgainBtn;
