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
import { useToast } from "@/hooks/use-toast";

const OnlinePageForm = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const { toast } = useToast();

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

    socket.on("error", ({ message }) => {
      toast({
        title: "Error:",
        description: message,
        variant: "destructive",
      });
    });

    socket.on("join", handleJoin);

    return () => {
      socket.off("join", handleJoin);
    };
  }, [navigate]);

  return (
    <Form {...form}>
      <form
        className="gap- flex w-[300px] flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel className="ml-1">Room Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="AXSEFDV"
                    className="border bg-inherit dark:focus:border-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full">Join Room</Button>
        </div>

        <div className="flex w-full flex-col items-center">
          <Divider />

          <button
            className="w-full rounded-lg border bg-inherit p-3 hover:bg-accent"
            onClick={() => {
              navigate(
                `/roomgame?name=${encodeURIComponent(
                  name ?? "",
                )}&roomCode=${encodeURIComponent(GenerateRoomCode())}`,
              );
            }}
          >
            Create Room
          </button>
        </div>
      </form>
    </Form>
  );
};

export default OnlinePageForm;
