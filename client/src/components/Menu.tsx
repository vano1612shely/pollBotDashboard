import Link from "next/link";
import { Bot, Home, Settings, SquarePlus, Users, Vote } from "lucide-react";

export default function Menu() {
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
