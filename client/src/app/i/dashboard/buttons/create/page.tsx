"use client";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import {
  formSchema,
  FormValues,
} from "@/app/i/dashboard/buttons/create/components/buttonsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateMessageButtons from "@/app/i/dashboard/buttons/create/components/CreateMessageButtons";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { CreateMessage } from "@/types/message.type";
import messageService from "@/services/message.service";
import { CreateButtonType } from "@/types/button.type";
import buttonsService from "@/services/buttons.service";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { errorCatch } from "@/services/error";

export default function CreateButtonPage() {
  const {
    mutate,
    isPending,
    error: mutateError,
    data: mutateData,
  } = useMutation({
    mutationKey: ["createButton"],
    mutationFn: (data: CreateButtonType) => buttonsService.create(data),
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      buttons: [],
    },
  });
  const onSubmit = async (props: FormValues) => {
    mutate(props);
  };
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
  return (
    <>
      <Card className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
              <CreateMessageButtons form={form} />
              <div>
                <Button className="bg-green-700 hover:bg-green-600">
                  Зберегти
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
}
