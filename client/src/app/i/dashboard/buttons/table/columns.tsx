"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ButtonType } from "@/types/button.type";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import buttonsService from "@/services/buttons.service";
import { useEffect } from "react";
import Link from "next/link";

export const buttonColumns: ColumnDef<ButtonType>[] = [
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
          href={`/i/dashboard/buttons/${row.original.id}`}
          className="text-blue-500 hover:underline"
        >
          {row.original.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "delete",
    header: "Видалити",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { mutate, data } = useMutation({
        mutationKey: ["deleteButton", row.original.id],
        mutationFn: () => buttonsService.delete(row.original.id),
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { refetch } = useQuery({
        queryKey: ["buttons"],
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (data) refetch();
      }, [data]);
      return (
        <Button variant="destructive" onClick={() => mutate()}>
          <Trash />
        </Button>
      );
    },
  },
];
