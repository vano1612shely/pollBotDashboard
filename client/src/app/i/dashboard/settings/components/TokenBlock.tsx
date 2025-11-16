"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import BotService from "@/services/bot.service";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CreateBot } from "@/types/bot.type";
import { errorCatch } from "@/services/error";
import useBotStore from "@/store/bot.store";
import { Label } from "@/components/ui/label";

export default function TokenBlock() {
  const {
    mutateAsync,
    error: createError,
  } = useMutation({
    mutationKey: ["createUpdateBot"],
    mutationFn: (data: CreateBot) => BotService.createOrUpdate(data),
  });
  const bot = useBotStore((state) => state.bot);
  const [data, setData] = useState<CreateBot>({
    token: "",
    chat_ids: [],
  });
  const [chatIdsInput, setChatIdsInput] = useState("");

  const normalizeChatIds = (value: string) =>
    value
      .split(/[,\\s]+/)
      .map((id) => id.trim())
      .filter((id) => id.length);

  useEffect(() => {
    if (createError) {
      toast.error(errorCatch(createError));
    }
  }, [createError]);

  useEffect(() => {
    if (bot) {
      setData({ chat_ids: bot.chat_ids ?? [], token: bot.token });
      setChatIdsInput((bot.chat_ids ?? []).join(", "));
    }
  }, [bot]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Налаштування бота:</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3">
          <div>
            <Label htmlFor="token">Токен бота</Label>
            <Input
              id="token"
              placeholder="Введіть токен"
              value={data.token}
              onChange={(e) => setData({ ...data, token: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="chat_id">
              ID чатів адмінів (через кому або пробіл)
            </Label>
            <Input
              id="chat_id"
              placeholder="Наприклад: 12345, 67890"
              value={chatIdsInput}
              onChange={(e) => {
                setChatIdsInput(e.target.value);
                setData({
                  ...data,
                  chat_ids: normalizeChatIds(e.target.value),
                });
              }}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button
          onClick={() => {
            toast.promise(
              mutateAsync({
                token: data.token,
                chat_ids: normalizeChatIds(chatIdsInput),
              }),
              {
                loading: "Зберігаємо...",
                success: <b>Збережено</b>,
                error: <b>Сталася помилка</b>,
              },
            );
          }}
          className="bg-green-700 hover:bg-green-600"
        >
          Зберегти
        </Button>
      </CardFooter>
    </Card>
  );
}
