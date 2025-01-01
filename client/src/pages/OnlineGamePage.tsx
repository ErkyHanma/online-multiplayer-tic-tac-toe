import PageLogo from "@/components/PageLogo";
import OnlineBoard from "@/components/OnlineBoard";
import { socket } from "@/socket";
import { playersProps } from "@/lib/types";
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

  if (playersData) {
    return (
      <div className="min-h-screen relative  gap-6 w-full flex flex-col items-center justify-center">
        <OnlineBoard playersData={playersData} />
      </div>
    );
  }

  return (
    <div className="h-screen text-5xl flex items-center justify-center">
      Joining...
    </div>
  );
};

export default OnlineGamePage;
