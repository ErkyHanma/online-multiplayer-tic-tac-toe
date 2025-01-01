import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { socket } from "@/socket";
import { playerProps } from "@/lib/types";
import { ScrollArea, ScrollAreaViewport } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "./ui/scroll-area";

type ChatProps = {
  roomCode: string;
  playerData: playerProps;
};

const Chat = ({ roomCode, playerData }: ChatProps) => {
  const [message, setMessage] = useState<string | undefined>("");
  const [messages, setMessages] = useState<
    {
      message: string | undefined;
      playerName: string;
      playerId: string | undefined;
    }[]
  >([]);

  const viewportRef = useRef<HTMLDivElement>(null); // Create a ref for the ScrollAreaViewport

  useEffect(() => {
    const handleEvent = ({
      message,
      playerName,
      playerId,
    }: {
      message: string;
      playerName: string;
      playerId: string;
    }) => {
      setMessages((prev) => [
        ...prev,
        { message: message, playerName: playerName, playerId: playerId },
      ]);
    };

    socket.on("chat-message-2", handleEvent);

    return () => {
      socket.off("chat-message-2", handleEvent);
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages update
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message?.trim()) return; // Prevent sending empty messages

    setMessages((prev) => [
      ...prev,
      {
        message: message,
        playerName: playerData.name,
        playerId: playerData.id,
      },
    ]);

    socket.emit("chat-message", {
      message: message,
      roomCode: roomCode,
      playerName: playerData.name,
      playerId: playerData.id,
    });

    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" w-full flex-col border rounded-md relative flex justify-center"
    >
      <ScrollArea className="h-[300px] w-full rounded-xl ">
        <ScrollAreaViewport ref={viewportRef} className="h-full  p-4">
          {messages.map((item, idx) => (
            <div key={idx} className="flex  flex-col ">
              <div
                className={`flex flex-col max-w-[300px]  mb-2 p-2 rounded-md ${
                  item.playerId === playerData.id
                    ? "mr-auto bg-blue-400"
                    : "ml-auto text-end bg-gray-500"
                }`}
              >
                <p className="font-bold text-xs">{item.playerName}</p>
                <p className=" break-words">{item.message}</p>
              </div>
            </div>
          ))}
        </ScrollAreaViewport>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <div className="p-2">
        <Input
          placeholder="Message"
          className="w-[95%]"
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </div>
    </form>
  );
};

export default Chat;
