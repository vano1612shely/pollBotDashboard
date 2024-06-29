"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Message, MessageType } from "@/types/message.type";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import messageService from "@/services/message.service";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePollTableContext } from "@/app/i/dashboard/polls/table/pollTableContext";
import toast from "react-hot-toast";
import clientService from "@/services/client.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Archive, Eye, MoreVertical, Pause, Play } from "lucide-react";
import { clsx } from "clsx";

export const messageColumns: ColumnDef<Message>[] = [
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
    accessorKey: "name",
    header: "Назва",
    cell: ({ row }) => {
      return (
        <Link
          href={`/i/dashboard/polls/${row.original.id}`}
          className="hover:underline"
        >
          {row.original.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "is_send",
    header: "Відправлено?",
  },
  {
    accessorKey: "created_at",
    header: "Дата створення",
    cell: ({ row }) => {
      return <p>{dayjs(row.original.created_at).format("YYYY/MM/DD HH:mm")}</p>;
    },
  },
  {
    accessorKey: "",
    header: "Відправити повідомлення",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { mutate, data } = useMutation({
        mutationKey: ["sendMessage", row.original.id],
        mutationFn: () => messageService.sendMessage(row.original.id),
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { refetch } = useQuery({
        queryKey: ["polls"],
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (data) {
          toast.success("Повідомлення відправленно");
          refetch();
        }
      }, [data]);
      if (row.original.is_send) {
        return <></>;
      }
      return (
        <Button
          className="bg-green-700 hover:bg-green-600"
          onClick={() => mutate()}
        >
          Відправити
        </Button>
      );
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
        mutationKey: ["archive", row.original.id],
        mutationFn: () => messageService.archive(row.original.id),
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { refetch } = useQuery({ queryKey: ["polls"] });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (data) {
          refetch();
        }
      }, [data]);
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
                className={clsx("flex items-center gap-2")}
                onClick={() => mutate()}
              >
                <Archive className="w-4 h-4" />
                {!row.original.archived ? "Архівувати" : "Вилучити з архіву"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
