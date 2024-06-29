import { z } from "zod";
import { ButtonType, MessageType } from "@/types/message.type";

export const buttonSchema = z.object({
  text: z.string().min(1, "Назва кнопки обов'язкова"),
  link: z.string().optional(),
  type: z.nativeEnum(ButtonType).default(ButtonType.POLL),
  poll: z.string().optional(),
});

export const rowSchema = z.object({
  buttons: z.array(buttonSchema),
});

export const formSchema = z
  .object({
    buttons: z.array(rowSchema),
    message: z.string().min(1, "Текст повідомлення обов'язковий"),
    type: z.nativeEnum(MessageType).default(MessageType.MessageForU),
    name: z.string().min(1, "Назва не можу бути пустою"),
    thx_message: z.string().optional(),
  })
  .refine((data) => data.message !== "<p></p>", {
    path: ["message"],
    message: "Текст повідомлення обов'язковий",
  });

export type FormValues = z.infer<typeof formSchema>;
