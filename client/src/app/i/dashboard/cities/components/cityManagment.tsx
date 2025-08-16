import { useEffect, useState } from "react";
import { City, CreateCityDto, UpdateCityDto } from "@/types/city.type";
import { cityService } from "@/services/city.service";
import toast from "react-hot-toast";
import {
  Loader2,
  MoreHorizontal,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/app/i/dashboard/cities/components/confirmDialog";
import { CityFormDialog } from "@/app/i/dashboard/cities/components/cityFormDialog";
import { ClientsListDialog } from "@/app/i/dashboard/cities/components/сlientsListDialog";

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
                      colSpan={4}
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
                        <ClientsListDialog
                          cityId={city.id}
                          cityName={city.name}
                          clientsCount={clientCounts[city.id] || 0}
                        >
                          <button className="flex items-center space-x-1 text-left hover:text-blue-600 transition-colors">
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                            <span className="underline decoration-dotted">
                              {clientCounts[city.id] || 0}
                            </span>
                          </button>
                        </ClientsListDialog>
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
