import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";
import useBotStore from "@/store/bot.store";
import { BotStatus, BotType } from "@/types/bot.type";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function BotControls() {
  const bot = useBotStore((state) => state.bot);
  const { restart, stop, start } = useBotStore((state) => state);
  const startHandler = async () => {
    const res = await start();
    if (res) {
      toast.success("Bot started");
    } else {
      toast.error("Unknown error");
    }
  };
  const stopHandler = async () => {
    const res = await stop();
    if (res) {
      toast.success("Bot stopped");
    } else {
      toast.error("Unknown error");
    }
  };
  const restartHandler = async () => {
    const res = await restart();
    if (res) {
      toast.success("Bot restarted");
    } else {
      toast.error("Unknown error");
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Управління ботом:</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-5">
          <Button
            disabled={bot?.status == BotStatus.ACTIVE || !bot}
            onClick={startHandler}
            className="bg-green-700 hover:bg-green-600"
          >
            <Play />
          </Button>
          <Button
            variant="destructive"
            disabled={bot?.status == BotStatus.INACTIVE || !bot}
            onClick={stopHandler}
          >
            <Pause />
          </Button>
          <Button variant="secondary" onClick={restartHandler} disabled={!bot}>
            <RotateCcw />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
