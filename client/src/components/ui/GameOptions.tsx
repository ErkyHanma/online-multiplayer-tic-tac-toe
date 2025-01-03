import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";

const GameOptions = () => {
  const navigate = useNavigate();

  // Function to handle user room exit
  const handleClick = () => {
    navigate("/online");
  };

  return (
    <div className="cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <img src="\settings-icon.svg" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <button>Change Theme</button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button>Rules</button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button onClick={handleClick}>Exit Game</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default GameOptions;
