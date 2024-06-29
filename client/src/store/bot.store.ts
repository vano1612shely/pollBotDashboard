import { create } from "zustand";
import { BotType } from "@/types/bot.type";
import botService from "@/services/bot.service";
type BotStore = {
  bot: BotType | null;
  setBot: (bot: BotType) => void;
  start: () => Promise<boolean>;
  stop: () => Promise<boolean>;
  restart: () => Promise<boolean>;
};
const useBotStore = create<BotStore>((set) => ({
  bot: null,
  setBot: (bot) =>
    set((state) => ({
      bot: bot,
    })),
  start: async () => {
    const res = await botService.start();
    if (res) {
      const bot = await botService.getBot();
      set((state) => ({ bot: bot }));
    }
    return res;
  },
  stop: async () => {
    const res = await botService.stop();
    if (res) {
      const bot = await botService.getBot();
      set((state) => ({ bot: bot }));
    }
    return res;
  },
  restart: async () => {
    const res = await botService.restart();
    if (res) {
      const bot = await botService.getBot();
      set((state) => ({ bot: bot }));
    }
    return res;
  },
}));

export default useBotStore;
