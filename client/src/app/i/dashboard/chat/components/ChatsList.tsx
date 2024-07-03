"use client";
import { useQuery } from "@tanstack/react-query";
import clientService from "@/services/client.service";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSocket } from "@/providers/socketProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function ChatsList() {
  const { socket } = useSocket();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["chats"],
    queryFn: () => clientService.getWithMessage(),
  });
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
        {data.map((client, index) => {
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
                  className="flex items-center gap-2 p-2 rounded hover:bg-muted-foreground duration-200 cursor-pointer border"
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={client.img_link} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {!client.messages[0].read && (
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
