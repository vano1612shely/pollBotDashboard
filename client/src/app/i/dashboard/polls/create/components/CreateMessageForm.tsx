"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import TextEditor from "@/components/TextEditor";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "./messageSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import messageService from "@/services/message.service";
import { ButtonType, CreateMessage, MessageType } from "@/types/message.type";
import toast from "react-hot-toast";
import { errorCatch } from "@/services/error";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormDescription,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import Link from "next/link";
import CreateMessageButtons from "@/app/i/dashboard/polls/create/components/CreateMessageButtons";
import fileService from "@/services/file.service";
import { Upload } from "@/components/ui/upload";
interface StartMessageProps {
  title: string;
  description: string;
}
export default function CreateMessageForm(props: StartMessageProps) {
  const {
    mutate,
    isPending,
    error: mutateError,
    data: mutateData,
  } = useMutation({
    mutationKey: ["createMessage"],
    mutationFn: (data: CreateMessage) => messageService.create(data),
  });
  const { mutate: sendMessage } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: (id: number) => messageService.sendMessage(id),
  });
  const [imageFormMsg, setImageForMsg] = useState<string>("");
  const [imageForThx, setImageForThx] = useState<string>("");
  const {
    mutate: uploadImageForMessage,
    data: loadedImageForMessage,
    isPending: awaitImageForMessage,
  } = useMutation({
    mutationKey: ["uploadImageForMessage"],
    mutationFn: (image: File) => fileService.upload(image),
  });
  useEffect(() => {
    if (loadedImageForMessage) {
      form.setValue("message_img", loadedImageForMessage.full_link);
      setImageForMsg(loadedImageForMessage.full_link);
    }
  }, [loadedImageForMessage]);
  const {
    mutate: uploadImageForThx,
    data: loadedImageForThx,
    isPending: awaitImageForThx,
  } = useMutation({
    mutationKey: ["uploadImageForThx"],
    mutationFn: (image: File) => fileService.upload(image),
  });
  useEffect(() => {
    if (loadedImageForThx) {
      form.setValue("thx_img", loadedImageForThx.full_link);
      setImageForThx(loadedImageForThx.full_link);
    }
  }, [loadedImageForThx]);
  const [send, setSend] = useState<boolean>(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buttons: [],
      message: "",
      name: "",
      type: MessageType.MessageForAll,
      thx_message: "",
    },
  });
  const onSubmit = async (props: FormValues) => {
    //@ts-expect-error
    mutate(props);
  };
  useEffect(() => {
    if (mutateData) {
      toast.success("Збережено");
    }
    if (mutateData && send) {
      sendMessage(mutateData.id);
    }
  }, [mutateData]);
  useEffect(() => {
    if (mutateError) {
      toast.error(errorCatch(mutateError));
    }
  }, [mutateError]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
            <CardDescription>{props.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Назва</FormLabel>
                      <Input type="text" id="name" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тип</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Виберіть тип:" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Тип</SelectLabel>
                            {Object.keys(MessageType).map((key, index) => {
                              const type =
                                MessageType[key as keyof typeof MessageType];
                              if (
                                type !== MessageType.StartU &&
                                type !== MessageType.StartA
                              )
                                return (
                                  <SelectItem value={type} key={index}>
                                    {type}
                                  </SelectItem>
                                );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Повідомлення</FormLabel>
                      <TextEditor
                        content={field.value}
                        setContent={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-3">
                  <Label htmlFor="image">
                    Зображення або GIF для повідомлення
                  </Label>
                  <Upload
                    imageUrl={imageFormMsg}
                    onUpload={uploadImageForMessage}
                    isPending={awaitImageForMessage}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-3 p-2">
              {/* @ts-ignore */}
              <CreateMessageButtons form={form} />
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="thx_message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Повідомлення після здійснення вибору</FormLabel>
                    <TextEditor
                      content={field.value || ""}
                      setContent={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-3">
                <Label htmlFor="image">
                  Зображення або GIF після здійснення вибору
                </Label>
                <Upload
                  imageUrl={imageForThx}
                  onUpload={uploadImageForThx}
                  isPending={awaitImageForThx}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 justify-end w-full">
            <Button
              className="bg-green-900 hover:bg-green-800"
              type="submit"
              disabled={isPending}
              onClick={() => {
                setSend(true);
              }}
            >
              Зберегти та одразу відправити
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-600"
              type="submit"
              onClick={() => setSend(false)}
              disabled={isPending}
            >
              Зберегти
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
