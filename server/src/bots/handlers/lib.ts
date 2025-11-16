import { Markup } from 'telegraf';
import { BotEntity } from '../entities/bot.entity';
function isValidURL(url: string): boolean {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // протокол
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // доменне ім'я
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // або IPv4
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // порт і шлях
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // запит
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // фрагмент
  return !!urlPattern.test(url);
}

export function createInlineKeyboard(
  buttons: [] | undefined,
  message_id?: number | null,
): any {
  const arr = [];
  if (buttons) {
    buttons.forEach((row: any) => {
      const rowArr = [];
      row.buttons.forEach((item: any) => {
        if (item.type !== 'Link' && message_id) {
          rowArr.push(
            Markup.button.callback(
              item.text,
              `poll:${message_id}___${item.poll}`,
            ),
          );
        } else if (item.type === 'Link' && isValidURL(item.link)) {
          rowArr.push(Markup.button.url(item.text, item.link));
        }
      });
      arr.push(rowArr);
    });
    return Markup.inlineKeyboard(arr);
  }
  return null;
}

export function parseText(msg: string): string {
  let text = msg.replaceAll('<p>', '');
  text = text.replaceAll('</p>', '');
  text = text.replaceAll('<br>', '\n');
  return text;
}

export function getAdminChatIds(bot: BotEntity): string[] {
  if (!bot) return [];
  // Prefer the new chat_ids collection but gracefully handle legacy chat_id values
  const ids = (bot as any).chat_ids ?? (bot as any).chat_id ?? [];
  if (Array.isArray(ids)) {
    return ids.map((id) => `${id}`.trim()).filter((id) => id.length > 0);
  }
  if (typeof ids === 'string') {
    return ids
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  }
  if (typeof ids === 'number') {
    return [`${ids}`];
  }
  return [];
}

export async function broadcastToAdmins(
  bot: BotEntity,
  send: (chatId: string) => Promise<unknown>,
) {
  const adminChatIds = getAdminChatIds(bot);
  await Promise.all(
    adminChatIds.map((chatId) =>
      send(chatId).catch((e) =>
        console.log(`Cant send message for admin ${chatId}:`, e),
      ),
    ),
  );
}
