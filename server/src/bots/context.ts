import { Context, Scenes } from 'telegraf';

export interface IBotContext extends Context {
  scene: Scenes.SceneContextScene<IBotContext>;
  session: any;
}
