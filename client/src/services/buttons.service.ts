import { api, apiClassic } from "@/services/api";
import { ButtonType, CreateButtonType } from "@/types/button.type";
import { Message } from "@/types/message.type";

class ButtonsService {
  async create(data: CreateButtonType): Promise<ButtonType> {
    const res = await api.post(`/buttons`, data);
    return res.data;
  }
  async getAll(
    per_page?: number | null,
    page?: number | null,
    search?: string | null,
  ): Promise<{ count: number; data: ButtonType[] }> {
    const res = await api.get(`/buttons`, {
      params: {
        per_page: per_page,
        page: page,
        search: search,
      },
    });
    return res.data;
  }
  async getById(id: number): Promise<ButtonType> {
    const res = await api.get(`/buttons/${id}`);
    return res.data;
  }

  async delete(id: number): Promise<ButtonType> {
    const res = await api.delete(`/buttons/${id}`);
    return res.data;
  }
}
const buttonsService = new ButtonsService();
export default buttonsService;
