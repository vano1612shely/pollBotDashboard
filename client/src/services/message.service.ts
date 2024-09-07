import { api, apiClassic } from "@/services/api";
import { BotType, CreateBot } from "@/types/bot.type";
import { CreateMessage, Message, MessageType } from "@/types/message.type";
import { ClientType } from "@/types/client.type";
import { ResultType } from "@/types/result.type";

class MessageService {
  async create(data: CreateMessage): Promise<Message> {
    const res = await api.post(`/messages`, data);
    return res.data;
  }
  async getByType(type: MessageType): Promise<Message[]> {
    const res = await api.get(`/messages/byType/${type}`);
    return res.data;
  }
  async getAll(
    per_page?: number | null,
    page?: number | null,
    search?: string | null,
  ): Promise<{ count: number; data: Message[] }> {
    const res = await api.get(`/messages`, {
      params: {
        per_page: per_page,
        page: page,
        search: search,
      },
    });
    return res.data;
  }
  async getActivity(
      id: number,
      per_page?: number | null,
      page?: number | null,
      search?: string | null,
  ): Promise<{ count: number; data: any[] }> {
    const res = await api.get(`/messages/activity/${id}`, {
      params: {
        per_page: per_page,
        page: page,
        search: search,
      },
    });
    return res.data;
  }
  async getArchived(
    per_page?: number | null,
    page?: number | null,
    search?: string | null,
  ): Promise<{ count: number; data: Message[] }> {
    const res = await api.get(`/messages/archived`, {
      params: {
        per_page: per_page,
        page: page,
        search: search,
      },
    });
    return res.data;
  }
  async getById(id: number): Promise<Message> {
    const res = await api.get(`/messages/${id}`);
    return res.data;
  }

  async archive(id: number): Promise<boolean> {
    const res = await api.post(`/messages/archive/${id}`);
    return res.data;
  }

  async getResults(
    id: number,
    per_page?: number | null,
    page?: number | null,
    search?: string | null,
  ): Promise<{ count: number; data: ResultType[] }> {
    const res = await api.get(`/messages/results/${id}`, {
      params: {
        per_page: per_page,
        page: page,
        search: search,
      },
    });
    return res.data;
  }

  async sendMessage(id: number) {
    const res = await api.post(`/messages/send/${id}`);
    return res.data;
  }
}
const messageService = new MessageService();
export default messageService;
