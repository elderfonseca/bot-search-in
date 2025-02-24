import axios from 'axios';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../utils/config';

/**
 * Sends a message to a Telegram chat with error handling.
 * @param {string} message - The message to send.
 */
export const sendTelegramMessage = async (message: string): Promise<void> => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await axios.post(url, { chat_id: TELEGRAM_CHAT_ID, text: message });
    console.log('Message sent to Telegram successfully.');
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
};
