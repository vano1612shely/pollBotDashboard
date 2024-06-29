import { Message } from "@/types/message.type";
import { ClientType } from "@/types/client.type";

export type ResultType = {
  message_id: number;
  client_id: number;
  result: string;
  date: Date;
  message: Message;
  client: ClientType;
};
