import { socket } from "@/socket";
import { useNavigate } from "react-router";

const ReturnHome = ({
  route,
  roomCode,
}: {
  route: string;
  roomCode: string | null | undefined;
}) => {
  const navigate = useNavigate();

  return (
    <button
      className="absolute left-4 top-4 transition duration-150 hover:scale-110"
      onClick={() => {
        if (route === "/online") {
          socket.emit("leave-room", { playerId: socket.id, roomCode });
        }

        navigate(route);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </button>
  );
};

export default ReturnHome;
