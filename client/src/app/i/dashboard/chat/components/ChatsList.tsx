"use client";
import { useQuery } from "@tanstack/react-query";
import clientService from "@/services/client.service";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSocket } from "@/providers/socketProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clsx } from "clsx";
import { ChatMessage } from "@/types/chat.type";
import { ClientType } from "@/types/client.type";
export default function ChatsList({
  client_id,
}: {
  client_id?: number | null;
}) {
  const { socket } = useSocket();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["chats"],
    queryFn: () => clientService.getWithMessage(),
  });
  const [usersList, setUsersList] = useState<
    (ClientType & { messages: ChatMessage[] })[]
  >([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    socket.on("newMessage", (payload) => {
      refetch();
    });
    socket.on("messegeRead", (payload) => {
      refetch();
    });
    return () => {
      socket.off("joinToChat");
    };
  }, []);
  useEffect(() => {
    if (data) {
      setUsersList(data.reverse());
    }
  }, [data]);
  if (!data && isLoading) {
    return <div className="h-full w-full"></div>;
  }
  if (!data) {
    return (
      <div className="h-full w-full border rounded-lg">Чати не знайдено</div>
    );
  }

  return (
    <div className="h-full w-full border rounded-lg p-2">
      <Input
        placeholder="Введіть username або кастомне ім'я користувача:"
        className="mb-5"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="w-full h-full">
        {usersList.map((client, index) => {
          if (
            client.username.includes(search.replace("@", "")) ||
            client.custom_name?.includes(search)
          )
            return (
              <li key={index}>
                <Link
                  href={{
                    query: {
                      id: client.id,
                    },
                  }}
                  className={clsx(
                    "flex items-center gap-2 p-2 rounded hover:bg-blue-200 duration-200 cursor-pointer border",
                    client_id === client.id && "bg-blue-200",
                  )}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={client.img_link} />
                      <AvatarFallback>
                        {client.first_name && client.first_name[0]}
                        {client.last_name && client.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {client.messages.length > 0 && !client.messages[0].read && (
                      <div className="absolute w-3 h-3 bg-red-700 rounded-[50%] top-0 right-0"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-md flex gap-2 leading-0">
                      <span>{client.custom_name}</span>{" "}
                      <span>@{client.username}</span>
                    </p>
                    <div className="pl-2 text-muted-foreground flex gap-2 items-center leading-0">
                      {client.messages &&
                        client.messages.length > 0 &&
                        client.messages[0].message}
                    </div>
                  </div>
                </Link>
              </li>
            );
        })}
      </ul>
    </div>
  );
}
