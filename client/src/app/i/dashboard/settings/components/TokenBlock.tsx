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
import { useMutation, useQuery } from "@tanstack/react-query";
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
    data: createData,
  } = useMutation({
    mutationKey: ["createUpdateBot"],
    mutationFn: (data: CreateBot) => BotService.createOrUpdate(data),
  });
  const bot = useBotStore((state) => state.bot);
  const [data, setData] = useState<CreateBot>({
    token: "",
    chat_id: "",
  });
  useEffect(() => {
    if (createError) {
      toast.error(errorCatch(createError));
    }
  }, [createError]);
  useEffect(() => {
    if (bot) setData({ chat_id: bot.chat_id, token: bot.token });
  }, [bot]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Токен бота та чат:</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3">
          <div>
            <Label htmlFor="token">Токен бота</Label>
            <Input
              id="token"
              placeholder="токен бота:"
              value={data.token}
              onChange={(e) => setData({ ...data, token: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="chat_id">Id чату</Label>
            <Input
              id="chat_id"
              placeholder="Id чату:"
              value={data.chat_id}
              onChange={(e) => setData({ ...data, chat_id: e.target.value })}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button
          disabled={!bot}
          onClick={() => {
            toast.promise(
              mutateAsync({ token: data.token, chat_id: data.chat_id }),
              {
                loading: "Збереження...",
                success: <b>Збережено</b>,
                error: <b>Помилка</b>,
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
