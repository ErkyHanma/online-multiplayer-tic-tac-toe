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
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Button } from "../ui/button";
import Divider from "../Divider";
import { useState } from "react";
import { useNavigate } from "react-router";

const OnlinePageForm = () => {
  const [option, setOption] = useState<string>("");

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof OnlinePageFormSchema>>({
    resolver: zodResolver(OnlinePageFormSchema),
    defaultValues: {
      room: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof OnlinePageFormSchema>) => {
    console.log(values);
    console.log(option);
  };

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

        <ToggleGroup className=" gap-2 flex-col flex w-full" type="single">
          <Divider />

          <ToggleGroupItem className=" bg-gray-950 w-full" value="Multiplayer">
            <button
              onClick={() => {
                navigate("/game");
                setOption("Create Room");
              }}
            >
              Create Room
            </button>
          </ToggleGroupItem>
          <Divider />
          <ToggleGroupItem
            className=" bg-gray-950  w-full"
            value="Online Multiplayer"
          >
            <button
              onClick={() => {
                navigate("/game");
                setOption("Join random player");
              }}
            >
              Join random player
            </button>
          </ToggleGroupItem>
        </ToggleGroup>
      </form>
    </Form>
  );
};

export default OnlinePageForm;
