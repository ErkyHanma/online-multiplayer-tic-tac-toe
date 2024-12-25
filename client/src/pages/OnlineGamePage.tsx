import Chat from "@/components/Chat";
import Icon from "@/components/Icon";
import OnlineBoard from "@/components/OnlineBoard";
import { socket } from "@/socket";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

type playersProps = {
  enemy: {
    name: string;
    id: string;
    isX: boolean;
  };
  you: {
    name: string;
    id: string;
    isX: boolean;
  };
};

const OnlineGamePage = () => {
  const location = useLocation();
  const [playersData, setPlayersData] = useState<playersProps | null>(null);

  useEffect(() => {
    socket.emit("game-started", {
      roomCode: location.pathname.split("/")[2],
      playerId: socket.id,
    });

    socket.on("player-data", (values) => {
      setPlayersData(values);
    });

    // Clean up the socket listener to avoid memory leaks
    return () => {
      socket.off("player-data");
    };
  }, [location.pathname]);

  if (!playersData) {
    return (
      <div className="h-screen text-5xl flex items-center justify-center">
        Joining...
      </div>
    );
  }

  return (
    <div className="h-screen  gap-12 w-full flex flex-col items-center justify-center">
      <Icon />
      <div className="p-8 w-[1000px] items-center gap-6 bg-black min-h-[500px] rounded-lg flex flex-col ">
        <div className="w-full flex flex-col gap-1">
          <p>{`${playersData?.you.name} (You) vs ${playersData?.enemy.name}`}</p>
          <div className="w-[100%] h-[4px] bg-gray-700"></div>
        </div>

        <div className="flex w-full justify-center ">
          {/* Render OnlineBoard only when playersData is available */}
          <OnlineBoard playerData={playersData.you} />
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default OnlineGamePage;
