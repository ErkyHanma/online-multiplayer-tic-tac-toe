import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { homeFormSchema } from "@/lib/zod";
import { Label } from "../ui/label";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useNavigate } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const HomeForm = () => {
  const [mode, setMode] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (value: z.infer<typeof homeFormSchema>) => {
    console.log(mode);
    console.log(value);

    if (mode.length === 0 || mode === null) return;

    if (mode === "Multiplayer") {
      navigate(`/game`);
    } else {
      navigate(`/online`);
    }
  };

  const form = useForm<z.infer<typeof homeFormSchema>>({
    resolver: zodResolver(homeFormSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col w-[300px] gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex items-start flex-col ">
              <FormLabel className="ml-1">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Juan"
                  className=" focus:border-white border-0"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-start w-full flex-col gap-3">
          <Label>Select Mode</Label>
          <ToggleGroup className=" gap-2 flex-col flex w-full" type="single">
            <ToggleGroupItem
              className=" bg-gray-950 w-full"
              onClick={() => setMode("Multiplayer")}
              value="Multiplayer"
            >
              Multiplayer
            </ToggleGroupItem>
            <ToggleGroupItem
              className=" bg-gray-950 w-full"
              onClick={() => setMode("Online Multiplayer")}
              value="Online Multiplayer"
            >
              Online Multiplayer
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Button>Start</Button>
      </form>
    </Form>
  );
};

export default HomeForm;
