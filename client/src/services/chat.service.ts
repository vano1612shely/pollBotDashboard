import { ClientType } from "@/types/client.type";
import { api } from "@/services/api";
import {
  ChatMessage,
  ChatMessageType,
  CreateChatMessage,
} from "@/types/chat.type";

class ChatService {
  async getByClientId(id: number): Promise<ChatMessage[]> {
    const res = await api.get(`/chat/${id}`);
    return res.data;
  }

  async readMessages(last_message_id: number): Promise<boolean> {
    const res = await api.get(`/chat/read/${last_message_id}`);
    return res.data;
  }

  async create(data: CreateChatMessage): Promise<ChatMessage> {
    console.log(data);
    const res = await api.post("/chat", {
      message: data.message,
      client_telegram_id: Number(data.client_telegram_id),
      type: ChatMessageType.BOT,
    });
    return res.data;
  }
}

const chatService = new ChatService();
export default chatService;
