export type CreateBot = {
  token: string;
  chat_id: string;
};
export enum BotStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
export type BotType = {
  id: number;
  token: string;
  chat_id: string;
  user_id: number;
  status: BotStatus;
};
