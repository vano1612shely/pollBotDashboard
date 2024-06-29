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
import { ResultType } from "@/types/result.type";

export const resultColumns: ColumnDef<ResultType>[] = [
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
    accessorKey: "message",
    header: "Назва повідомлення",
    cell: ({ row }) => {
      return (
        <Link
          href={`/i/dashboard/polls/${row.original.message_id}`}
          className="text-blue-500 hover:underline"
        >
          {row.original.message.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Дата/час відправлення повідомлення",
    cell: ({ row }) => {
      return (
        <p>
          {dayjs(row.original.message.created_at).format("DD/MM/YYYY HH:mm")}
        </p>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Дата/час відповіді",
    cell: ({ row }) => {
      return <p>{dayjs(row.original.date).format("DD/MM/YYYY HH:mm")}</p>;
    },
  },
  {
    accessorKey: "result",
    header: "Вибір",
    cell: ({ row }) => {
      return <p>{row.original.result}</p>;
    },
  },
];
