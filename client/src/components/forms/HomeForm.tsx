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
    if (mode.length === 0 || mode === null) return;

    localStorage.setItem("name", value.name);

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
        className="flex w-[350px] flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="ml-1">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Juan"
                  className="border bg-inherit  dark:focus:border-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full flex-col items-start gap-3">
          <Label>Select Mode</Label>
          <ToggleGroup className="flex w-full flex-col gap-2" type="single">
            <ToggleGroupItem
              className="w-full border bg-inherit"
              onClick={() => setMode("Multiplayer")}
              value="Multiplayer"
            >
              Multiplayer
            </ToggleGroupItem>
            <ToggleGroupItem
              className="w-full border bg-inherit"
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
