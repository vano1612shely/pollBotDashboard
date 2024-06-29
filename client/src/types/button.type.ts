import { Button, CreateButton } from "@/types/message.type";

export type ButtonType = {
  id: number;
  name: string;
  buttons: {
    buttons: Button[];
  }[];
};

export type CreateButtonType = Omit<ButtonType, "id" | "buttons"> & {
  buttons: {
    buttons: CreateButton[];
  }[];
};
