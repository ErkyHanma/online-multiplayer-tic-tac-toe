import Logo from "@/components/Logo";
import ReturnHome from "@/components/ReturnHome";
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

    socket.on("join-room", (value) => {
      console.log(`${value.name} has join`);
      setTimeout(() => {
        navigate(`/onlineGame/${searchParams.get("roomCode")}`);
      }, 1000);
    });

    return () => {
      socket.off("join-room");
    };
  }, [searchParams]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-14">
      <ReturnHome route="/online" roomCode={roomCode} />
      <Logo />
      <div className="mb-20 flex flex-col items-center gap-4">
        <h1 className="text-3xl font-semibold">This is your Room Code</h1>
        <strong className="text-gray-400">{roomCode}</strong>
        <CopyIcon text={roomCode} />
      </div>

      <div className="flex items-end justify-end gap-2 text-xl">
        <span> Waiting for another player</span>
        <span className="loader pb-4"></span>
      </div>
    </div>
  );
};

export default RoomLobby;
