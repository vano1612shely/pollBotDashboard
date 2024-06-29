"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonType } from "@/types/message.type";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { FormValues } from "@/app/i/dashboard/polls/create/components/messageSchema";
import { useState } from "react";

export default function CreateMessageButton({
  buttonIndex,
  rowIndex,
  field,
  form,
}: {
  buttonIndex: number;
  field: UseFieldArrayReturn<FormValues, "buttons", "id">;
  rowIndex: number;
  form: UseFormReturn<FormValues>;
}) {
  const [buttonType, setButtonType] = useState<ButtonType>(
    form.getValues(`buttons.${rowIndex}.buttons.${buttonIndex}.type`),
  );
  const { fields, update } = field;
  const removeButton = (rowIndex: number, buttonIndex: number) => {
    const newButtons = fields[rowIndex].buttons.filter(
      (_, idx) => idx !== buttonIndex,
    );
    update(rowIndex, { ...fields[rowIndex], buttons: newButtons });
  };
  return (
    <div key={buttonIndex} className="flex gap-2">
      <FormField
        control={form.control}
        name={`buttons.${rowIndex}.buttons.${buttonIndex}.text`}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <Input
              {...form.register(
                `buttons.${rowIndex}.buttons.${buttonIndex}.text`,
              )}
              placeholder={`Текст кнопки ${buttonIndex + 1}`}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`buttons.${rowIndex}.buttons.${buttonIndex}.type`}
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={(value: ButtonType) => {
                field.onChange(value);
                setButtonType(value);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="min-w-[180px]">
                  <SelectValue placeholder="Виберіть тип кнопки:" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Тип</SelectLabel>
                  {Object.keys(ButtonType).map((key, index) => {
                    const type = ButtonType[key as keyof typeof ButtonType];
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
      {buttonType === ButtonType.LINK ? (
        <FormField
          control={form.control}
          name={`buttons.${rowIndex}.buttons.${buttonIndex}.link`}
          render={({ field }) => (
            <FormItem>
              <Input
                {...form.register(
                  `buttons.${rowIndex}.buttons.${buttonIndex}.link`,
                )}
                placeholder={`Посилання кнопки ${buttonIndex + 1}`}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={form.control}
          name={`buttons.${rowIndex}.buttons.${buttonIndex}.poll`}
          render={({ field }) => (
            <FormItem>
              <Input
                {...form.register(
                  `buttons.${rowIndex}.buttons.${buttonIndex}.poll`,
                )}
                placeholder={`Значення кнопки ${buttonIndex + 1}`}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <Button
        type="button"
        variant="destructive"
        onClick={() => removeButton(rowIndex, buttonIndex)}
      >
        <Trash />
      </Button>
    </div>
  );
}
