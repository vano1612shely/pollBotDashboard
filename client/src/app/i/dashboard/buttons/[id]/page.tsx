"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import buttonsService from "@/services/buttons.service";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Loader2, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ButtonPage({ params }: { params: { id: number } }) {
  const { data, isLoading } = useQuery({
    queryKey: ["button", params.id],
    queryFn: () => buttonsService.getById(Number(params.id)),
  });
  const { mutate, data: mutateData } = useMutation({
    mutationKey: ["deleteButton", params.id],
    mutationFn: () => buttonsService.delete(Number(params.id)),
  });
  useEffect(() => {
    if (!isLoading && !data) {
      redirect("/i/dashboard/buttons");
    }
  }, [data]);
  useEffect(() => {
    if (mutateData) {
      redirect("/i/dashboard/buttons");
    }
  }, [mutateData]);
  if (!data) {
    return (
      <div className="flex w-full h-full">
        <Loader2 className="w-32 h-32 animate-spin m-auto" />
      </div>
    );
  }
  return (
    <>
      <Card className="grid gap-3 p-5">
        <Label>Назва</Label>
        <div className="flex justify-between items-center">
          <h1>{data.name}</h1>
          <Button variant="destructive" onClick={() => mutate()}>
            Видалити
            <Trash />
          </Button>
        </div>
      </Card>
      <Card className="grid gap-3 p-5">
        <Label>Кнопки</Label>
        <div className="flex flex-col gap-3">
          {data?.buttons.map((buttonsRow, index) => {
            return (
              <div className="flex gap-3" key={index}>
                {buttonsRow.buttons.map((button, idx) => {
                  return (
                    <div
                      className="border border-primary rounded p-2 min-w-[100px] hover:bg-muted cursor-pointer hover:border-green-700 duration-200 flex-1 text-center"
                      key={idx}
                    >
                      {button.text}:{button.link || button.poll}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
