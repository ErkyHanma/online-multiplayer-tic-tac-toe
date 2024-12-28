import Icon from "@/components/Icon";
import OnlineBoard from "@/components/OnlineBoard";
import { socket } from "@/socket";
import { playersProps } from "@/types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

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
      <OnlineBoard playersData={playersData} />
    </div>
  );
};

export default OnlineGamePage;
