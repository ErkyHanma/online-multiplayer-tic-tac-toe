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

  const viewportRef = useRef<HTMLDivElement>(null);

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

    socket.on("chat-message-received", handleEvent);

    return () => {
      socket.off("chat-message-received", handleEvent);
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
      className="relative flex w-full flex-col justify-center rounded-md border-2 border-gray-900 md:max-w-[400px]"
    >
      <ScrollArea className="h-[300px] w-full rounded-xl">
        <ScrollAreaViewport ref={viewportRef} className="h-full p-4">
          {messages.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <div
                className={`mb-2 flex max-w-[250px] flex-col rounded-md p-2 text-white ${
                  item.playerId === playerData.id
                    ? "ml-auto bg-blue-400"
                    : "mr-auto bg-gray-500 text-end"
                }`}
              >
                <p className="break-words">{item.message}</p>
              </div>
            </div>
          ))}
        </ScrollAreaViewport>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <div className="flex gap-2 p-2">
        <Input
          placeholder="Type your message..."
          className="w-full border-2 border-gray-900 bg-inherit dark:focus-within:text-white"
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button className="flex cursor-pointer items-center justify-center rounded-lg bg-zinc-700 p-2 opacity-90 hover:bg-zinc-600 focus:border-none">
          <img src="/public/sent-stroke-rounded.svg" alt="" />
        </button>
      </div>
    </form>
  );
};

export default Chat;
