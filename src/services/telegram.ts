import axios from 'axios';
import { TelegramMessage } from '../interfaces/telegram';

/**
 * Sends a message to a specified Telegram chat.
 * @param message - The message object containing chatId and text.
 * @param botToken - The Telegram bot token.
 * @returns A promise that resolves to the response from Telegram API.
 */
export const sendMessageToTelegram = async (message: TelegramMessage, botToken: string): Promise<void> => {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  await axios.post(url, {
    chat_id: message.chatId,
    text: message.text,
  });
};
