"use client";
import TokenBlock from "@/app/i/dashboard/settings/components/TokenBlock";
import StartMessage from "@/app/i/dashboard/settings/components/StartMessage";
import BotControls from "@/app/i/dashboard/settings/components/BotControls";
import { useQuery } from "@tanstack/react-query";
import BotService from "@/services/bot.service";
import { useEffect } from "react";
import useBotStore from "@/store/bot.store";
import toast from "react-hot-toast";
import { errorCatch } from "@/services/error";
import { MessageType } from "@/types/message.type";

export default function SettingsPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["bot"],
    queryFn: () => BotService.getBot(),
  });
  const setBot = useBotStore((state) => state.setBot);
  useEffect(() => {
    if (error) {
      toast.error(errorCatch(error));
    }
  }, [error]);
  useEffect(() => {
    if (data) {
      setBot(data);
    }
  }, [data]);
  return (
    <>
      <div className="grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Налаштування</h1>
      </div>
      <TokenBlock />
      <BotControls />
      <StartMessage
        type={MessageType.StartU}
        title="Повідомлення для нових користувачів"
        description="Створіть повідомлення для користувачів, які до цього не
            користувались ботом і не є верифікованими"
      />
      <StartMessage
        type={MessageType.StartA}
        title="Повідомлення для верифікованих користувачів"
        description="Створіть повідомлення для користувачів, які вже верифіковані"
      />
    </>
  );
}