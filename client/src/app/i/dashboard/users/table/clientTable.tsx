"use client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clientColumns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clientService from "@/services/client.service";

export default function ClientTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: () => clientService.getAll(perPage, page, search, showBlockedUsers || null),
  });
  const table = useReactTable({
    data: data?.data || [],
    columns: clientColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  const goToPreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const goToNextPage = () => {
    if (data) if (data.count > perPage * page) setPage(page + 1);
  };
  useEffect(() => {
    refetch()
  }, [page, perPage, search, showBlockedUsers]);
  return (
    <div>
      <div className="flex gap-2 items-center mb-5">
      <Input
        className="w-80"
        placeholder="Введіть username:"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />
     <Button onClick={() => setShowBlockedUsers(!showBlockedUsers)}>{showBlockedUsers ? "Показати всіх користувачів" : "Показати користувачів які заблокували бота"}</Button>
      </div>
      <div className="rounded-md border bg-background overflow-hidden mb-5 shadow">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={clientColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <p className="text-muted-foreground">Всього: {data?.count}</p>
          <div>
            <Select
              value={String(perPage)}
              onValueChange={(value) => {
                setPage(1);
                setPerPage(Number(value));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <p className="text-sm text-muted-foreground">
            Сторінка {page}{" "}
            {data ? " із " + Math.ceil(data.count / perPage) : ""}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={!data || page * perPage >= data.count}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
