"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Eye,
  MoreVertical,
  Pause,
  Pencil,
  Play,
  Trash,
  Watch,
  Ban
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ClientType } from "@/types/client.type";
import { clsx } from "clsx";
import clientService from "@/services/client.service";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export const clientColumns: ColumnDef<ClientType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="rounded"
      />
    ),
    cell: ({ row }) => (
      <div className="h-[20px]">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="rounded"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "telegram_id",
    header: "Telegram Id",
    cell: ({ row }) => {
      return (
        <Link
          href={`/i/dashboard/users/${row.original.id}`}
          className="text-blue-500 hover:underline"
        >
          {row.original.telegram_id}
        </Link>
      );
    },
  },
  {
    accessorKey: "custom_name",
    header: "Кастомне ім'я",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [name, setName] = useState<string | undefined>(
        row.original.custom_name,
      );
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { mutate, data } = useMutation({
        mutationKey: ["setCustomName", row.original.id],
        mutationFn: (name: string) =>
          clientService.setCustomName(row.original.id, name),
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { refetch } = useQuery({ queryKey: ["clients"] });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (data) {
          refetch();
        }
      }, [data]);
      return (
        <p className="flex gap-3 items-center">
          {row.original.custom_name}{" "}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Edit />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-3">
              <Input
                placeholder="Введіть ім'я:"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button onClick={() => mutate(name as string)}>Зберегти</Button>
            </PopoverContent>
          </Popover>
        </p>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      return (
        <Link
          href={`https:/t.me/${row.original.username}`}
          className="text-blue-500 hover:underline"
        >
          @{row.original.username}
        </Link>
      );
    },
  },
  {
    accessorKey: "first_name",
    header: "Ім'я",
  },
  {
    accessorKey: "last_name",
    header: "Прізвище",
  },
  {
    accessorKey: "is_activated",
    header: "Верифікований?",
    cell: ({ row }) => {
      return (
        <p
          className={clsx(
            row.original.is_activated ? "text-green-700" : "text-red-700",
          )}
        >
          {row.original.is_activated ? "Так" : "Ні"}
        </p>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Створено",
    cell: ({ row }) => {
      return <p>{dayjs(row.original.created_at).format("YYYY/MM/DD HH:mm")}</p>;
    },
  },
  {
    accessorKey: "",
    header: "Дії",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [open, setOpen] = useState(false);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { mutate, data } = useMutation({
        mutationKey: ["setActiveStatus", row.original.id],
        mutationFn: () =>
          clientService.setActiveStatus(
            row.original.id,
            !row.original.is_activated,
          ),
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { mutate: deleteClient, data: deleteData } = useMutation({
        mutationKey: ["delete", row.original.id],
        mutationFn: () => clientService.delete(row.original.id),
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { mutate: blockClient, data: blockData } = useMutation({
        mutationKey: ["block", row.original.id],
        mutationFn: () => clientService.blockClient(row.original.id),
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { refetch } = useQuery({ queryKey: ["clients"] });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (data) {
          refetch();
        }
      }, [data]);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (deleteData) {
          refetch();
        }
      }, [deleteData]);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (blockData) {
          refetch();
        }
      }, [blockData]);
      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className={clsx(
                  "flex items-center gap-2",
                  row.original.is_activated ? "text-red-700" : "text-green-700",
                )}
                onClick={() => mutate()}
              >
                {row.original.is_activated ? (
                  <p className="flex gap-2 items-center">
                    <Pause className="w-4 h-4" />
                    Вимкнути верифікацію
                  </p>
                ) : (
                  <p className="flex gap-2 items-center">
                    <Play className="w-4 h-4" />
                    Верифікувати
                  </p>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-700"
                onClick={() => deleteClient()}
              >
                <Trash className="w-4 h-4" />
                Видалити
              </DropdownMenuItem>
              <DropdownMenuItem
                  className="flex items-center gap-2 text-red-700"
                  onClick={() => blockClient()}
              >
                <Ban className="w-4 h-4" />
                {row.original.is_blocked ? "Розблокувати" : "Заблокувати"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  className={clsx("flex items-center gap-2")}
                  href={`/i/dashboard/users/${row.original.id}`}
                >
                  <Eye className="w-4 h-4" />
                  Переглянути
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
