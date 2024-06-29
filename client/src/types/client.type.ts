import { ResultType } from "@/types/result.type";

export type ClientType = {
  id: number;
  created_at: Date;
  custom_name?: string;
  telegram_id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_activated: boolean;
  results?: ResultType[];
};
