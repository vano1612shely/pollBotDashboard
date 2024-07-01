import { api, apiClassic } from "@/services/api";
import { ClientType } from "@/types/client.type";
import { ResultType } from "@/types/result.type";

class ClientService {
  async getById(id: number): Promise<ClientType> {
    const res = await api.get(`/client/${id}`);
    return res.data;
  }
  async getAll(
    per_page?: number | null,
    page?: number | null,
    search?: string | null,
  ): Promise<{ count: number; data: ClientType[] }> {
    const res = await api.get(`/client`, {
      params: {
        per_page: per_page,
        page: page,
        search: search,
      },
    });
    return res.data;
  }

  async getResults(
    id: number,
    per_page?: number | null,
    page?: number | null,
    search?: string | null,
  ): Promise<{ count: number; data: ResultType[] }> {
    const res = await api.get(`/client/results/${id}`, {
      params: {
        per_page: per_page,
        page: page,
        search: search,
      },
    });
    return res.data;
  }
  async setActiveStatus(id: number, status: boolean): Promise<ClientType> {
    const res = await api.patch(`/client/activeStatus/${id}`, {
      activeStatus: status,
    });
    return res.data;
  }
  async setCustomName(id: number, name: string): Promise<ClientType> {
    const res = await api.patch(`/client/customName/${id}`, {
      name: name,
    });
    return res.data;
  }
}
const clientService = new ClientService();
export default clientService;