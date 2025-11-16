export type CreateBot = {
  token: string;
  chat_ids: string[];
};
export enum BotStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
export type BotType = {
  id: number;
  token: string;
  chat_ids: string[];
  user_id: number;
  status: BotStatus;
};
