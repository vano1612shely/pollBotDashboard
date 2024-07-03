import { ClientType } from "@/types/client.type";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { clsx } from "clsx";
import dayjs from "dayjs";
import Image from "next/image";
export default function UserInfo({ user }: { user: ClientType }) {
  return (
    <>
      <Card className="p-5">
        <CardTitle className="mb-5">Інформація про клієнта</CardTitle>
        <CardContent className="flex gap-3">
          {user.img_link && (
            <div>
              <Image
                src={user.img_link}
                alt="user_img"
                width={300}
                height={300}
                className="rounded-[50%] h-[200px] w-[200px]"
              />
            </div>
          )}
          <div className="grid gap-3">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p>Кастомне ім'я: {user.custom_name}</p>
            <p>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Ім'я в телеграмі: {user.first_name} {user.last_name}
            </p>
            <p>
              Username:{" "}
              <Link
                href={`https://t.me/${user.username}`}
                className="text-blue-500 hover:underline"
              >
                @{user.username}
              </Link>
            </p>
            <p>
              Верефікований?:{" "}
              <span
                className={clsx(
                  user.is_activated ? "text-green-700" : "text-red-700",
                )}
              >
                {user.is_activated ? "Так" : "Ні"}
              </span>
            </p>
            <p>
              Дата першої взаємодії:{" "}
              {dayjs(user.created_at).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
