import { ResultType } from "@/types/result.type";

export enum MessageType {
  StartA = "StartForAuthorized",
  StartU = "StartForUnauthorized",
  MessageForAll = "MessageForAll",
  MessageForA = "MessageForAuthorized",
  MessageForU = "MessageForUnauthorized",
}

export enum ButtonType {
  LINK = "Link",
  POLL = "Poll",
}

export type Button = {
  id: number;
  text: string;
  type: ButtonType;
  link?: string;
  poll?: string;
};

export type CreateButton = Omit<Button, "id">;

export type Message = {
  id: number;
  name?: string;
  message: string;
  message_img?: string;
  thx_message?: string;
  thx_img?: string;
  type: MessageType;
  is_send?: boolean;
  created_at: Date;
  archived: boolean;
  buttons: {
    buttons: Button[];
  }[];
  results?: ResultType[];
};

export type CreateMessage = Omit<
  Message,
  "id" | "buttons" | "created_at" | "archived"
> & {
  buttons: {
    buttons: CreateButton[];
  }[];
};
