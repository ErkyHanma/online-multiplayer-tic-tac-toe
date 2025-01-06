import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { socket } from "@/socket";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";

import { useLocation, useNavigate } from "react-router";

const GameOptions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const roomCode = location.pathname.split("/")[2];

  // Function to handle user room exit
  const handleClick = () => {
    if (location.pathname === "/game") {
      navigate("/");
    } else {
      socket.emit("leave-room", { playerId: socket.id, roomCode: roomCode });
      navigate("/online");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex">
        <img
          className="duration-100 dark:text-white dark:invert"
          src="\settings-icon.svg"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[280px]">
        <div className="flex flex-col p-2">
          <DropdownMenuLabel className="text-md font-bold">
            Rules
          </DropdownMenuLabel>
          <p className="text-sm text-gray-400">
            Tic Tac Toe is a two-player strategy game on a 3x3 grid. The goal is
            to align three symbols (X or O) horizontally, vertically, or
            diagonally before your opponent.
          </p>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button className="w-full self-start" onClick={handleClick}>
            Exit Game
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GameOptions;
