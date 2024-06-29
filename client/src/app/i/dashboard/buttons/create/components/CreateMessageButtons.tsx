import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
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
import { Control, useFieldArray, UseFormReturn } from "react-hook-form";
import { FormValues } from "@/app/i/dashboard/buttons/create/components/buttonsSchema";
import CreateMessageButtonRow from "@/app/i/dashboard/buttons/create/components/CreateMessageButtonRow";

export default function CreateMessageButtons({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) {
  const fieldArray = useFieldArray({
    control: form.control,
    name: "buttons",
  });
  return (
    <FormField
      control={form.control}
      name="buttons"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Кнопки</FormLabel>
          {fieldArray.fields.map((row, rowIndex) => (
            <div key={rowIndex}>
              <CreateMessageButtonRow
                form={form}
                field={fieldArray}
                row={row}
                rowIndex={rowIndex}
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={() => fieldArray.append({ buttons: [] })}
          >
            Додати рядок
          </Button>
        </FormItem>
      )}
    />
  );
}
