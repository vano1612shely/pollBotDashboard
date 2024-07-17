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
  Menu as MenuIcon, // Import Menu icon
} from "lucide-react";
import { useSocket } from "@/providers/socketProvider";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

export default function Menu() {
  const [count, setCount] = useState(0);
  const { socket } = useSocket();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control menu visibility
  const sound = new Audio("/sounds/telegram.mp3");
  useEffect(() => {
    socket.on("unreadMessages", (c) => {
      if (c > count) {
        sound.play();
      }
      setCount(c);
    });

    return () => {
      socket.off("unreadMessages");
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden" // Position the button on the top right for mobile view
        onClick={toggleMenu}
      >
        <MenuIcon className="h-6 w-6" />
      </button>
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-muted/40 md:relative md:z-auto md:bg-transparent md:inset-auto transition-all duration-300 pt-10 md:pt-0 bg-white",
          {
            block: isMenuOpen,
            "hidden md:block": !isMenuOpen,
          },
        )}
      >
        <div className="flex h-full max-h-screen flex-col gap-2 fixed md:w-[220px] lg:w-[280px] bg-muted/40 border-r">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/i/dashboard"
              className="flex items-center gap-2 font-semibold"
              onClick={toggleMenu}
            >
              <Bot className="h-6 w-6" />
              <span className="">Poll Bot</span>
            </Link>
          </div>
          <div className="md:flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/i/dashboard/users"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={toggleMenu}
              >
                <Users className="h-4 w-4" />
                Користувачі
              </Link>
              <Link
                href="/i/dashboard/polls"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={toggleMenu}
              >
                <Vote className="h-4 w-4" />
                Опитування та повідомлення
              </Link>
              <Link
                href="/i/dashboard/buttons"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={toggleMenu}
              >
                <SquarePlus className="h-4 w-4" /> Кнопки
              </Link>
              <Link
                href="/i/dashboard/chat"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={toggleMenu}
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
          <div className="md:mt-auto p-4">
            <Link
              href="/i/dashboard/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              onClick={toggleMenu}
            >
              <Settings className="h-4 w-4" />
              Налаштування
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
