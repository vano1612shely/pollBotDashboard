import { ClientType } from "@/types/client.type";
export enum ChatMessageType {
  CLIENT = "client",
  BOT = "bot",
}
export type ChatMessage = {
  id: number;
  message: string;
  createdAt: Date;
  client: ClientType;
  client_id: number;
  read: boolean;
  type: ChatMessageType;
};

export type CreateChatMessage = {
  message: string;
  client_telegram_id: number;
};
