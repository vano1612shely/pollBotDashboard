import { ResultType } from "@/types/result.type";
import { ChatMessage } from "@/types/chat.type";

export type ClientType = {
  id: number;
  created_at: Date;
  custom_name?: string;
  telegram_id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_activated: boolean;
  results?: ResultType[];
  messages?: ChatMessage[];
  img_link?: string;
  last_message_id?: number;
  last_message: ChatMessage;
};
