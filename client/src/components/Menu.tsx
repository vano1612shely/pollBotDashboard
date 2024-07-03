"use client";
import Link from "next/link";
import {
  Bot,
  Home,
  MessageCircle,
  MessageSquareText,
  Settings,
  SquarePlus,
  Users,
  Vote,
} from "lucide-react";
import { useSocket } from "@/providers/socketProvider";
import { useEffect, useState } from "react";

export default function Menu() {
  const [count, setCount] = useState(0);
  const { socket } = useSocket();
  useEffect(() => {
    socket.on("unreadMessages", (c) => setCount(c));

    return () => {
      socket.off("unreadMessages");
    };
  }, []);
  return (
    <div className="hidden border-r bg-muted/40 md:block relative">
      <div className="flex h-full max-h-screen flex-col gap-2 fixed md:w-[220px] lg:w-[280px]">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/i/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <Bot className="h-6 w-6" />
            <span className="">Poll Bot</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {/*<Link*/}
            {/*  href="/i/dashboard"*/}
            {/*  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"*/}
            {/*>*/}
            {/*  <Home className="h-4 w-4" />*/}
            {/*  Панель*/}
            {/*</Link>*/}
            <Link
              href="/i/dashboard/users"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Користувачі
            </Link>
            <Link
              href="/i/dashboard/polls"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Vote className="h-4 w-4" />
              Опитування та повідомлення
            </Link>
            <Link
              href="/i/dashboard/buttons"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <SquarePlus className="h-4 w-4" /> Кнопки
            </Link>
            <Link
              href="/i/dashboard/chat"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <MessageSquareText className="h-4 w-4" />
              Чат
              {count > 0 && (
                <div className="bg-red-700 w-[20px] h-[20px] text-sm text-white rounded-[50%] flex ml-auto">
                  <p className="m-auto">{count}</p>
                </div>
              )}
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Link
            href="/i/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Settings className="h-4 w-4" />
            Налаштування
          </Link>
        </div>
      </div>
    </div>
  );
}
