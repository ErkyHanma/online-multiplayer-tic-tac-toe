import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OnlinePageFormSchema } from "@/lib/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Divider from "../Divider";
import { useNavigate } from "react-router";
import { GenerateRoomCode } from "@/lib/utils";
import { useEffect } from "react";
import { socket } from "@/socket";

const OnlinePageForm = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const form = useForm<z.infer<typeof OnlinePageFormSchema>>({
    resolver: zodResolver(OnlinePageFormSchema),
    defaultValues: {
      room: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof OnlinePageFormSchema>) => {
    // Event emitted  to the server sending name and roomCode
    socket.emit("join-room", { name: name, roomCode: values.room });
  };

  useEffect(() => {
    if (!socket) return;

    const handleJoin = ({ roomCode }: { roomCode: string }) => {
      setTimeout(() => {
        navigate(`/onlineGame/${roomCode}`);
      }, 1000);
    };

    socket.on("join", handleJoin);

    return () => {
      socket.off("join", handleJoin);
    };
  }, [navigate]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-[300px] gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="gap-3 flex-col flex">
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem className="flex items-start flex-col ">
                <FormLabel className="ml-1">Room Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="AXSEFDV"
                    className=" focus:border-white border-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full">Join Room</Button>
        </div>

        <div className="items-center gap-2 flex-col flex w-full">
          <Divider />

          <button
            className=" bg-gray-950 w-full p-3 rounded-lg hover:bg-gray-900 border"
            onClick={() => {
              navigate(
                `/roomgame?name=${encodeURIComponent(
                  name ?? ""
                )}&roomCode=${encodeURIComponent(GenerateRoomCode())}`
              );
            }}
          >
            Create Room
          </button>
          <Divider />
          <button
            className=" bg-gray-950  w-full p-3 rounded-lg hover:bg-gray-900 border"
            onClick={() => {
              navigate("/game");
            }}
          >
            Join random player
          </button>
        </div>
      </form>
    </Form>
  );
};

export default OnlinePageForm;
