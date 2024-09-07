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

export const ingoreColumns: ColumnDef<any>[] = [
  {
    accessorKey: "client",
    header: "Клієнт",
    cell: ({ row }) => {
      return (
        <Link
          href={`https://t.me/${row.original.client?.username}`}
          className="text-blue-500 hover:underline"
        >
          @{row.original.client?.username}
        </Link>
      );
    },
  },
  {
    accessorKey: "client_id",
    header: "Ім'я клієнта",
    cell: ({ row }) => {
      return (
        <Link
          href={`/i/dashboard/users/${row.original.client_id}`}
          className="hover:underline"
        >
          {row.original.client?.custom_name || row.original.client?.first_name}
        </Link>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Дата/час відправки повідомлення",
    cell: ({ row }) => {
      return <p>{dayjs(row.original.created_at).format("DD/MM/YYYY HH:mm:ss")}</p>;
    },
  },
];
