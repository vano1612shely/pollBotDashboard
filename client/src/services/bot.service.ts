import { api, apiClassic } from "@/services/api";
import { BotType, CreateBot } from "@/types/bot.type";

class BotService {
  async createOrUpdate(data: CreateBot): Promise<BotType> {
    const res = await api.post(`/bot`, data);
    return res.data;
  }
  async getBot(): Promise<BotType> {
    const res = await api.get(`/bot`);
    return res.data;
  }
  async start(): Promise<boolean> {
    const res = await api.get(`/bot/start`);
    return res.data;
  }
  async stop(): Promise<boolean> {
    const res = await api.get(`/bot/stop`);
    return res.data;
  }
  async restart(): Promise<boolean> {
    const res = await api.get(`/bot/restart`);
    return res.data;
  }
}
const botService = new BotService();
export default botService;
