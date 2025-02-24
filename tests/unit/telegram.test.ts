import axios from 'axios';
import { sendTelegramMessage } from '../../src/services/telegram';

jest.mock('axios');

describe('sendTelegramMessage', () => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'test-token';
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'test-chat-id';
  const message = 'Hello, Telegram!';
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  beforeEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = TELEGRAM_BOT_TOKEN;
    process.env.TELEGRAM_CHAT_ID = TELEGRAM_CHAT_ID;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.log as jest.Mock).mockRestore();
    (console.error as jest.Mock).mockRestore();
  });

  it('should send a message to Telegram', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });

    await sendTelegramMessage(message);

    expect(axios.post).toHaveBeenCalledWith(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
    expect(console.log).toHaveBeenCalledWith('Message sent to Telegram successfully.');
  });

  it('should log an error if the message fails to send', async () => {
    const error = new Error('Network Error');
    (axios.post as jest.Mock).mockRejectedValue(error);

    await sendTelegramMessage(message);

    expect(console.error).toHaveBeenCalledWith('Error sending message to Telegram:', error);
  });
});
