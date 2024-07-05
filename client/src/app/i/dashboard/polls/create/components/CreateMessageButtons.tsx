import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Control, useFieldArray, UseFormReturn } from "react-hook-form";
import { FormValues } from "@/app/i/dashboard/polls/create/components/messageSchema";
import CreateMessageButtonRow from "@/app/i/dashboard/polls/create/components/CreateMessageButtonRow";
import ButtonsPresets from "@/app/i/dashboard/polls/create/components/ButtonsPresets";

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
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              onClick={() => fieldArray.append({ buttons: [] })}
            >
              Додати рядок
            </Button>
            <ButtonsPresets form={form} />
          </div>
        </FormItem>
      )}
    />
  );
}
