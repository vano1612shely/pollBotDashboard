import { useEffect, useState } from "react";
import { cityService } from "@/services/city.service";
import toast from "react-hot-toast";
import {
  Loader2,
  Users,
  X,
  Search,
  UserCheck,
  UserX,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClientType } from "@/types/client.type";

interface ClientsListDialogProps {
  cityId: number;
  cityName: string;
  clientsCount: number;
  children: React.ReactNode;
}

export function ClientsListDialog({
  cityId,
  cityName,
  clientsCount,
  children,
}: ClientsListDialogProps) {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const filteredClients = clients.filter(
    (client) =>
      client.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.custom_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const loadCityClients = async () => {
    if (!open) return;

    try {
      setLoading(true);
      const cityData = await cityService.findOne(cityId);
      setClients(cityData.clients || []);
    } catch (error) {
      toast.error("Помилка завантаження клієнтів міста");
      console.error("Error loading city clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadCityClients();
      setSearchTerm("");
    }
  }, [open, cityId]);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getClientStatus = (client: ClientType) => {
    if (client.is_blocked) {
      return { label: "Заблокований", variant: "destructive" as const };
    }
    if (client.his_block_bot) {
      return { label: "Заблокував бота", variant: "secondary" as const };
    }
    if (client.is_activated) {
      return { label: "Активний", variant: "default" as const };
    }
    return { label: "Неактивний", variant: "outline" as const };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Клієнти міста "{cityName}"
            <Badge variant="secondary" className="ml-2">
              {clientsCount} клієнтів
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Пошук клієнтів..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ім'я користувача</TableHead>
                    <TableHead>Повне ім'я</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата реєстрації</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground py-8"
                      >
                        {searchTerm
                          ? "Клієнтів не знайдено за вашим запитом"
                          : "У цьому місті поки немає клієнтів"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => {
                      const status = getClientStatus(client);
                      return (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">
                            {client.username ? (
                              <div className="flex items-center gap-2">
                                <span>@{client.username}</span>
                                {client.custom_name && (
                                  <Badge variant="outline" className="text-xs">
                                    {client.custom_name}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic">
                                Без username
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div>
                                {client.first_name || client.last_name ? (
                                  `${client.first_name || ""} ${
                                    client.last_name || ""
                                  }`.trim()
                                ) : (
                                  <span className="text-muted-foreground italic">
                                    Не вказано
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {client.telegram_id}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {formatDate(client.created_at)}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Показано {filteredClients.length} з {clients.length} клієнтів
          </div>
          <Button variant="outline" onClick={() => setOpen(false)}>
            <X className="h-4 w-4 mr-2" />
            Закрити
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
