"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import TextEditor from "@/components/TextEditor";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  FormValues,
} from "@/app/i/dashboard/settings/components/startMessageSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import messageService from "@/services/message.service";
import { ButtonType, CreateMessage, MessageType } from "@/types/message.type";
import toast from "react-hot-toast";
import { errorCatch } from "@/services/error";
import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateMessageButtons from "@/app/i/dashboard/polls/create/components/CreateMessageButtons";
import {Upload} from "@/components/ui/upload";
import fileService from "@/services/file.service";
interface StartMessageProps {
  type: MessageType.StartA | MessageType.StartU;
  title: string;
  description: string;
}
export default function StartMessage(props: StartMessageProps) {
  const {
    mutate,
    isPending,
    error: mutateError,
    data: mutateData,
  } = useMutation({
    mutationKey: ["createUStartMessage"],
    mutationFn: (data: CreateMessage) => messageService.create(data),
  });
  const { data, isLoading } = useQuery({
    queryKey: ["getStartMessage", props.type],
    queryFn: () => messageService.getByType(props.type),
  });
  const [isReady, setIsReady] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buttons: [],
      message: "",
      type: props.type,
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "buttons",
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
      setImageForMsg(loadedImageForMessage.full_link)
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
      setImageForThx(loadedImageForThx.full_link)
    }
  }, [loadedImageForThx]);
  const addButton = (rowIndex: number) => {
    const newButtons = [
      ...fields[rowIndex].buttons,
      { text: "", type: ButtonType.LINK },
    ];
    update(rowIndex, { ...fields[rowIndex], buttons: newButtons });
  };
  const removeButton = (rowIndex: number, buttonIndex: number) => {
    const newButtons = fields[rowIndex].buttons.filter(
      (_, idx) => idx !== buttonIndex,
    );
    update(rowIndex, { ...fields[rowIndex], buttons: newButtons });
  };
  const onSubmit = async (props: FormValues) => {
    mutate(props);
  };
  useEffect(() => {
    if (data && data.length > 0) {
      form.setValue("message", data[0].message);
      form.setValue("buttons", data[0].buttons);
      setIsReady(true);
    }
  }, [data]);
  useEffect(() => {
    if (mutateData) {
      toast.success("Збережено");
    }
  }, [mutateData]);
  useEffect(() => {
    if (mutateError) {
      toast.error(errorCatch(mutateError));
    }
  }, [mutateError]);
  // @ts-ignore
  return (
    <Form {...form}>
      <form action="" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
            <CardDescription>{props.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-6">
                <TextEditor
                    isLoaded={isReady}
                    content={form.getValues("message")}
                    setContent={(value) => form.setValue("message", value)}
                />
                {form.formState.errors.message && (
                    <p className="text-red-500">
                      {
                        //@ts-ignore
                        errors.message.message
                      }
                    </p>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="image">Зображення або GIF для повідомлення</Label>
                  <Upload
                      imageUrl={imageFormMsg}
                      onUpload={uploadImageForMessage}
                      isPending={awaitImageForMessage}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-6 p-2">
              <Label htmlFor="message">Кнопки</Label>
              <CreateMessageButtons form={form}/>
            </div>
            <div className="grid gap-6">
              <Label htmlFor="message">Прощальне повідомлення</Label>
              <TextEditor
                  isLoaded={isReady}
                  content={form.getValues("thx_message") || ""}
                  setContent={(value) => form.setValue("thx_message", value)}
              />
              {form.formState.errors.message && (
                  <p className="text-red-500">
                    {
                      //@ts-ignore
                      errors.message.thx_message
                    }
                  </p>
              )}
              <div className="grid gap-3">
                <Label htmlFor="image">Зображення або GIF після здійснення вибору</Label>
                <Upload
                    imageUrl={imageForThx}
                    onUpload={uploadImageForThx}
                    isPending={awaitImageForThx}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-green-700" type="submit" disabled={isPending}>
              Зберегти
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
