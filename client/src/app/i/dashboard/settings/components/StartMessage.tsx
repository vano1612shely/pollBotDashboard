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
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buttons: [],
      message: "",
      type: props.type,
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "buttons",
  });
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
      setValue("message", data[0].message);
      setValue("buttons", data[0].buttons);
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
    <form action="" onSubmit={handleSubmit(onSubmit)}>
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
                content={getValues("message")}
                setContent={(value) => setValue("message", value)}
              />
              {errors.message && (
                <p className="text-red-500">
                  {
                    //@ts-ignore
                    errors.message.message
                  }
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-6 p-2">
            <Label htmlFor="message">Кнопки</Label>
            {fields.map((row, rowIndex) => (
              <Card key={row.id} className="grid p-6 gap-5">
                <h3>Рядок {rowIndex + 1}</h3>
                <div className="grid gap-3">
                  {row.buttons &&
                    row.buttons.map((button, buttonIndex) => (
                      <div key={buttonIndex} className="flex gap-2">
                        <Input
                          {...register(
                            `buttons.${rowIndex}.buttons.${buttonIndex}.text`,
                          )}
                          placeholder={`Текст кнопки ${buttonIndex + 1}`}
                        />
                        <Input
                          {...register(
                            `buttons.${rowIndex}.buttons.${buttonIndex}.link`,
                          )}
                          placeholder={`Посилання кнопки ${buttonIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeButton(rowIndex, buttonIndex)}
                        >
                          <Trash />
                        </Button>
                        {errors.buttons?.[rowIndex]?.buttons?.[buttonIndex]
                          ?.text && (
                          <p>
                            {
                              //@ts-ignore
                              errors.rows[rowIndex].buttons[buttonIndex].text
                                .message
                            }
                          </p>
                        )}
                      </div>
                    ))}
                  <Button type="button" onClick={() => addButton(rowIndex)}>
                    Додати кнопку
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(rowIndex)}
                >
                  Видалити рядок
                </Button>
              </Card>
            ))}
            <Button type="button" onClick={() => append({ buttons: [] })}>
              Додати рядок
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-green-700" type="submit" disabled={isPending}>
            Зберегти
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
