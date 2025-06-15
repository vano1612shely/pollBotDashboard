export interface City {
  id: number;
  name: string;
  country?: string;
  region?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  clients?: any[];
}

export interface CreateCityDto {
  name: string;
  country?: string;
  region?: string;
  is_active?: boolean;
}

export interface UpdateCityDto extends Partial<CreateCityDto> {}
