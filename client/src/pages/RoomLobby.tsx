import PageLogo from "@/components/PageLogo";
import CopyIcon from "@/components/ui/CopyIcon";
import { socket } from "@/socket";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const RoomLobby = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState<string | null>();

  socket.emit("create-room", {
    name: searchParams.get("name"),
    roomCode: searchParams.get("roomCode"),
  });

  useEffect(() => {
    setRoomCode(searchParams.get("roomCode"));

    socket.on("join", (value) => {
      console.log(`${value.name} has join`);
      setTimeout(() => {
        navigate(`/onlineGame/${searchParams.get("roomCode")}`);
      }, 1000);
    });

    return () => {
      socket.off("join");
    };
  }, [searchParams]);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-14">
      <PageLogo />
      <div className="flex mb-20 gap-4 flex-col items-center">
        <h1 className="text-3xl font-semibold">This is your Room Code</h1>
        <strong className="text-gray-400">{roomCode}</strong>
        <CopyIcon text={roomCode} />
      </div>

      <p className="text-xl">Waiting for another player...</p>
    </div>
  );
};

export default RoomLobby;
