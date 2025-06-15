import * as z from "zod";
import { City, CreateCityDto } from "@/types/city.type";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const citySchema = z.object({
  name: z
    .string()
    .min(1, "Назва міста обов'язкова")
    .max(100, "Назва занадто довга"),
});

type CityFormData = z.infer<typeof citySchema>;

interface CityFormDialogProps {
  city?: City;
  onSubmit: (data: CreateCityDto) => Promise<void>;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
}

export function CityFormDialog({
  city,
  onSubmit,
  trigger,
  title,
  description,
}: CityFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: city?.name || "",
    },
  });

  const handleSubmit = async (data: CityFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Додати місто
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title || (city ? "Редагувати місто" : "Додати місто")}
          </DialogTitle>
          <DialogDescription>
            {description ||
              (city
                ? "Внесіть зміни до інформації про місто"
                : "Заповніть форму для додавання нового міста")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва міста *</FormLabel>
                  <FormControl>
                    <Input placeholder="Введіть назву міста" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Скасувати
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {city ? "Зберегти" : "Додати"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
