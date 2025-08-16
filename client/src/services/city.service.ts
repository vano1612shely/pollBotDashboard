import { api } from "./api";
import { City, CreateCityDto, UpdateCityDto } from "@/types/city.type";

class CityService {
  private BASE_URL = "/cities";

  async getAllCities(): Promise<City[]> {
    const response = await api.get<City[]>(this.BASE_URL);
    return response.data;
  }

  async getActiveCities(): Promise<City[]> {
    const response = await api.get<City[]>(`${this.BASE_URL}/active`);
    return response.data;
  }

  async getCityById(id: number): Promise<City> {
    const response = await api.get<City>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async getCityByName(name: string): Promise<City> {
    const response = await api.get<City>(`${this.BASE_URL}/name/${name}`);
    return response.data;
  }

  async createCity(data: CreateCityDto): Promise<City> {
    const response = await api.post<City>(this.BASE_URL, data);
    return response.data;
  }

  async updateCity(id: number, data: UpdateCityDto): Promise<City> {
    const response = await api.patch<City>(`${this.BASE_URL}/${id}`, data);
    return response.data;
  }

  async deleteCity(id: number): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`);
  }

  async deactivateCity(id: number): Promise<City> {
    const response = await api.patch<City>(`${this.BASE_URL}/${id}/deactivate`);
    return response.data;
  }

  async getClientsCount(id: number): Promise<{ count: number }> {
    const response = await api.get<{ count: number }>(
      `${this.BASE_URL}/${id}/clients-count`,
    );
    return response.data;
  }
  async findOne(id: number): Promise<City> {
    const response = await api.get(`/cities/${id}`);
    return response.data;
  }
}

export const cityService = new CityService();
