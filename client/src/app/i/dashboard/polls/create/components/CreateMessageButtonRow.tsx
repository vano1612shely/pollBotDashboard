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
import { Card } from "@/components/ui/card";
import {
  FieldArrayWithId,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
import CreateMessageButton from "@/app/i/dashboard/polls/create/components/CreateMessageButton";
import { FormValues } from "@/app/i/dashboard/polls/create/components/messageSchema";
export default function CreateMessageButtonRow({
  form,
  field,
  row,
  rowIndex,
}: {
  form: UseFormReturn<FormValues>;
  field: UseFieldArrayReturn<FormValues, "buttons", "id">;
  row: FieldArrayWithId<FormValues, "buttons", "id">;
  rowIndex: number;
}) {
  const { fields, update, remove } = field;
  const addButton = (rowIndex: number) => {
    const newButtons = [
      ...fields[rowIndex].buttons,
      { text: "", type: ButtonType.LINK },
    ];
    update(rowIndex, { ...fields[rowIndex], buttons: newButtons });
  };
  return (
    <Card key={row.id} className="grid p-6 gap-5">
      <h3>Рядок {rowIndex + 1}</h3>
      <div className="grid gap-3">
        {row.buttons &&
          row.buttons.map((button, buttonIndex) => (
            <div key={buttonIndex}>
              <CreateMessageButton
                rowIndex={rowIndex}
                buttonIndex={buttonIndex}
                form={form}
                field={field}
              />
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
  );
}
