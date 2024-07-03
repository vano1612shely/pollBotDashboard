import { Markup } from 'telegraf';
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
