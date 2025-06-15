"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";
import { City, CreateCityDto } from "@/types/city.type";
import { cityService } from "@/services/city.service";
import toast from "react-hot-toast";
import { UpdateCityDto } from "@/types/city.type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CitiesPage() {
  return (
    <div className="container mx-auto py-6">
      <CityManagement />
    </div>
  );
}

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

interface ConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  children,
  title,
  description,
  onConfirm,
  confirmText = "Підтвердити",
  cancelText = "Скасувати",
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function CityManagement() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientCounts, setClientCounts] = useState<{ [key: number]: number }>(
    {},
  );

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.region?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const loadCities = async () => {
    try {
      setLoading(true);
      const data = await cityService.getAllCities();
      setCities(data);

      // Завантажуємо кількість клієнтів для кожного міста
      const counts: { [key: number]: number } = {};
      await Promise.all(
        data.map(async (city) => {
          try {
            const result = await cityService.getClientsCount(city.id);
            counts[city.id] = result.count;
          } catch (error) {
            counts[city.id] = 0;
          }
        }),
      );
      setClientCounts(counts);
    } catch (error) {
      toast.error("Помилка завантаження міст");
      console.error("Error loading cities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCity = async (data: CreateCityDto) => {
    try {
      await cityService.createCity(data);
      toast.success("Місто успішно додано");
      loadCities();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Помилка додавання міста");
      throw error;
    }
  };

  const handleUpdateCity = async (id: number, data: UpdateCityDto) => {
    try {
      await cityService.updateCity(id, data);
      toast.success("Місто успішно оновлено");
      loadCities();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Помилка оновлення міста");
      throw error;
    }
  };

  const handleDeleteCity = async (id: number) => {
    try {
      await cityService.deleteCity(id);
      toast.success("Місто успішно видалено");
      loadCities();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Помилка видалення міста");
    }
  };

  const handleDeactivateCity = async (id: number) => {
    try {
      await cityService.deactivateCity(id);
      toast.success("Місто деактивовано");
      loadCities();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Помилка деактивації міста");
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Управління містами</CardTitle>
              <CardDescription>
                Перегляд, додавання та видалення міст в системі
              </CardDescription>
            </div>
            <CityFormDialog onSubmit={handleCreateCity} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Пошук міст..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Назва</TableHead>
                  <TableHead>Клієнтів</TableHead>
                  <TableHead>Дата створення</TableHead>
                  <TableHead className="w-[70px]">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCities.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      Міста не знайдено
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCities.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell className="font-medium">{city.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <UserCheck className="h-4 w-4 text-muted-foreground" />
                          <span>{clientCounts[city.id] || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(city.created_at).toLocaleDateString("uk-UA")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Дії</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/*<CityFormDialog*/}
                            {/*  city={city}*/}
                            {/*  onSubmit={(data) =>*/}
                            {/*    handleUpdateCity(city.id, data)*/}
                            {/*  }*/}
                            {/*  trigger={*/}
                            {/*    <DropdownMenuItem*/}
                            {/*      onSelect={(e) => e.preventDefault()}*/}
                            {/*    >*/}
                            {/*      <Edit className="mr-2 h-4 w-4" />*/}
                            {/*      Редагувати*/}
                            {/*    </DropdownMenuItem>*/}
                            {/*  }*/}
                            {/*/>*/}
                            {city.is_active && (
                              <DropdownMenuItem
                                onClick={() => handleDeactivateCity(city.id)}
                              >
                                Деактивувати
                              </DropdownMenuItem>
                            )}
                            <ConfirmDialog
                              title="Видалити місто"
                              description={`Ви впевнені, що хочете видалити місто "${city.name}"? Ця дія незворотна.${
                                (clientCounts[city.id] || 0) > 0
                                  ? ` Увага: до цього міста прив'язано ${clientCounts[city.id]} клієнтів.`
                                  : ""
                              }`}
                              onConfirm={() => handleDeleteCity(city.id)}
                              confirmText="Видалити"
                            >
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Видалити
                              </DropdownMenuItem>
                            </ConfirmDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
