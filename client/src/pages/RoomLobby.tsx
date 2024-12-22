import Icon from "@/components/Icon";
import { socket } from "@/socket";
import { useNavigate, useSearchParams } from "react-router";

const RoomLobby = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  socket.emit("create-room", {
    name: searchParams.get("name"),
    roomCode: searchParams.get("roomCode"),
  });

  socket.on("hola", (value) => {
    alert(`${value} has join`);
    setTimeout(() => {
      navigate(`/game/${searchParams.get("roomCode")}`);
    }, 1000);
  });

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-14">
      <Icon />
      <div className="flex mb-20 gap-4 flex-col items-center">
        <h1 className="text-3xl font-semibold">This is your Room Code</h1>
        <strong className="text-gray-400">
          {searchParams.get("roomCode")}
        </strong>
      </div>

      <p className="text-xl">Waiting for another player...</p>
    </div>
  );
};

export default RoomLobby;
