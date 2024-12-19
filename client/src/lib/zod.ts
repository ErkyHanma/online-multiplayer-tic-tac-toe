import { z } from "zod";

export const homeFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name is too long",
    }),
});

export const OnlinePageFormSchema = z.object({
  room: z
    .string()
    .toUpperCase()
    .min(7, {
      message: "Room code must be 7 characters.",
    })
    .max(7, {
      message: "Room code must be 7 characters.",
    }),
});
