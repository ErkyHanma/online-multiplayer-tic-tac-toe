import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useLocation, useNavigate } from "react-router";

const GameOptions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle user room exit
  const handleClick = () => {
    if (location.pathname === "/game") {
      navigate("/");
    } else {
      navigate("/online");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <img
                className="duration-100 dark:text-white dark:invert"
                src="\settings-icon.svg"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-white"> Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <button>Rules</button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={handleClick}>Exit Game</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GameOptions;
