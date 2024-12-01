"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import messageService from "@/services/message.service";
import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import dayjs from "dayjs";
import { clsx } from "clsx";
import { Message } from "@/types/message.type";
import { Button } from "@/components/ui/button";
import Image from "next/image"
import {cn} from "@/lib/utils";
export default function PollInfo({ data }: { data: Message }) {
  const { mutate, data: mutationData } = useMutation({
    mutationKey: ["sendMessage", data.id],
    mutationFn: () => messageService.sendMessage(data.id),
  });
  const { refetch } = useQuery({ queryKey: ["message", data.id] });
  useEffect(() => {
    editor?.commands.setContent(data?.message || "");
    editor2?.commands.setContent(data?.thx_message || "");
  }, [data]);
  useEffect(() => {
    if (mutationData) {
      refetch();
    }
  }, [mutationData]);
  const editor = useEditor({
    extensions: [StarterKit.configure()],
    content: data?.message || "",
    editable: false,
    editorProps: {
      attributes: {
        class:
          "h-[250px] overflow-y-auto p-2 outline-none border w-full rounded",
      },
    },
  });
  const editor2 = useEditor({
    extensions: [StarterKit.configure()],
    content: data?.thx_message || "",
    editable: false,
    editorProps: {
      attributes: {
        class:
          "h-[250px] overflow-y-auto p-2 outline-none w-full rounded border",
      },
    },
  });
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-5">
          <p>Назва: {data.name}</p>
          <p className="flex items-center gap-3">
            Відправленно?:{" "}
            <span
              className={clsx(data.is_send ? "text-green-700" : "text-red-700")}
            >
              {data.is_send ? "Так" : "Ні"}
            </span>
            {!data.is_send && (
              <Button onClick={() => mutate()}>Відправити</Button>
            )}
          </p>
        </Card>
        <Card className="p-5">
          Дата створення: {dayjs(data?.created_at).format("YYYY/MM/DD HH:mm")} <br/>
          Кількість вдало відправлених повідомлень: <span className={cn(data.sendedCount === data.totalCount?"text-green-600":"text-red-600")}>{data.sendedCount}/{data.totalCount}</span>
        </Card>
      </div>
      <Card className="grid gap-3 p-5">
        <Label>Повідомлення</Label>
        <EditorContent editor={editor} />
        <Label>Зображення</Label>
        {data?.message_img  ? <Image alt="msg_img" src={data.message_img} width={200} height={200}></Image> : ""}
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
      <Card className="grid gap-3 p-5">
        <Label>Повідомлення після здійснення вибору</Label>
        <EditorContent editor={editor2} />
        <Label>Зображення</Label>
        {data?.thx_img  ? <Image alt="msg_img" src={data.thx_img} width={200} height={200}></Image> : ""}
      </Card>
    </div>
  );
}
