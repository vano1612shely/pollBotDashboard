"use client";
import { useSocket } from "@/providers/socketProvider";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, CheckCheck, Send, Smile } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker from "emoji-picker-react";
import { ChatMessage, ChatMessageType } from "@/types/chat.type";
import chatService from "@/services/chat.service";
import { Card } from "@/components/ui/card";
import { clsx } from "clsx";
import { useInView } from "react-intersection-observer";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import clientService from "@/services/client.service";

export default function Chat({ client_id }: { client_id?: number | null }) {
  const { socket } = useSocket();
  const { data: client } = useQuery({
    queryKey: ["clientChat", client_id],
    queryFn: () => clientService.getById(client_id as number),
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { mutate: setView, data: viewUpdate } = useMutation({
    mutationKey: ["view", client_id],
    mutationFn: (id: number) => chatService.readMessages(id),
  });
  const { mutate: deleteChat, data: deleteData } = useMutation({
    mutationKey: ["delete_chat", client_id],
    mutationFn: (id: number) => chatService.delete(id),
  });
  const {
    mutate: sendMessage,
    isPending: isSended,
    data,
  } = useMutation({
    mutationKey: ["sendMessage", client_id],
    mutationFn: (message: string) =>
      chatService.create({
        client_telegram_id: client ? client.telegram_id : -1,
        message: message,
      }),
  });
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const { ref, inView } = useInView({
    threshold: 1.0,
  });
  useEffect(() => {
    if (data) {
      setMessage("");
    }
  }, [data]);
  useEffect(() => {
    if (inView && messages.length > 0) {
      if (!messages[messages.length - 1].read)
        setView(messages[messages.length - 1].id);
    }
  }, [inView, messages]);
  const getData = async () => {
    if (client_id) {
      const messages = await chatService.getByClientId(client_id);
      setMessages(messages);
    }
  };
  useEffect(() => {
    if (viewUpdate) {
      getData();
    }
  }, [viewUpdate]);
  useEffect(() => {
    if (deleteData) {
      getData();
    }
  }, [deleteData]);
  useEffect(() => {
    getData();
    socket.emit("joinToChat", { chat_id: client_id });
    socket.on("newMessage", (payload) => {
      if (payload.client_id == client_id) {
        setMessages((prevState) => [...prevState, payload.message]);
      }
    });
    return () => {
      socket.off("joinToChat");
      socket.off("newMessage");
    };
  }, [client_id]);
  if (!client_id) {
    return (
      <div className="w-full flex border rounded-lg h-[800px]">
        <p className="m-auto">Виберіть чат</p>
      </div>
    );
  }
  const insertEmoji = (variable: string) => {
    setMessage((prev) => prev + variable);
  };
  return (
    <div className="w-full flex border rounded-lg flex-col p-2 h-[800px]">
      <div className="w-full rounded border p-3 mb-5 flex justify-between items-center">
        {client?.username}
        {client && <Button variant="destructive" onClick={() => deleteChat(client.id)}>Видалити чат</Button>}
      </div>
      <div className="flex-1 flex flex-col gap-2 overflow-y-scroll">
        {messages.map((message, index) => {
          return (
            <Card
              key={index}
              className={clsx(
                "p-2 bg-blue-200 w-[300px] relative pb-5",
                message.type == ChatMessageType.BOT && "ml-auto bg-muted",
              )}
            >
              <p className="text-lg">{message.message}</p>
              <div className="absolute bottom-1 right-1 flex gap-1 items-center">
                <span className="text-sm text-muted-foreground">
                  {dayjs(message.createdAt).format("DD.MM HH:mm")}
                </span>
                {message.read ? (
                  <CheckCheck className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </div>
            </Card>
          );
        })}
        <div ref={messagesEndRef} />
        <div ref={ref} style={{ height: "1px" }} />
      </div>
      <div className="flex gap-1">
        <div className="relative w-full">
          <Input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(message);
              }
            }}
            placeholder="Введіть повідомлення: "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Popover open={openEmoji} onOpenChange={setOpenEmoji}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                size="sm"
                className="bg-transparent border-none absolute right-0.5 top-0.5 "
              >
                <Smile />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[300px] mr-14 border-none bg-transparent shadow-none p-0"
              side="left"
            >
              <EmojiPicker
                lazyLoadEmojis={true}
                onEmojiClick={(emoji) => {
                  insertEmoji(emoji.emoji);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          className="flex"
          onClick={() => sendMessage(message)}
          disabled={isSended}
        >
          <Send className="w-4 h-4 m-auto"></Send>
        </Button>
      </div>
    </div>
  );
}
