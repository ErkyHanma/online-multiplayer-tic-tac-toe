import OnlineBoard from "@/components/OnlineBoard";
import { socket } from "@/socket";
import { playersProps } from "@/lib/types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSocket } from "@/context/useSocket";

const OnlineGamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [playersData, setPlayersData] = useState<playersProps | null>(null);
  const { isConnected } = useSocket();

  if (!isConnected) {
    navigate("/online");
  }

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
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-6">
        <OnlineBoard playersData={playersData} />
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center text-5xl">
      Joining...
    </div>
  );
};

export default OnlineGamePage;
