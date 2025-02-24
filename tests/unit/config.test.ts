import { SEARCH_URLS, DATA_FILE, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, LINKEDIN_EMAIL, LINKEDIN_PASSWORD } from '../../src/utils/config';

describe('Config Tests', () => {
  it('should have correct SEARCH_URLS', () => {
    expect(SEARCH_URLS).toEqual([
      'https://www.linkedin.com/search/results/content/?keywords=%22angular%22%20%2B%20%22latam%22%20%2B%20%22remote%22&origin=GLOBAL_SEARCH_HEADER&sortBy=%22date_posted%22',
      'https://www.linkedin.com/search/results/content/?keywords=%22frontend%22%20%2B%20%22latam%22%20%2B%20%22remote%22&origin=GLOBAL_SEARCH_HEADER&sortBy=%22date_posted%22',
      'https://www.linkedin.com/search/results/content/?keywords=%22front-end%22%20%2B%20%22latam%22%20%2B%20%22remote%22&origin=GLOBAL_SEARCH_HEADER&sortBy=%22date_posted%22',
    ]);
  });

  it('should have correct DATA_FILE', () => {
    expect(DATA_FILE).toBe('results.json');
  });

  it('should use default values when environment variables are not set', () => {
    process.env.TELEGRAM_BOT_TOKEN = '';
    process.env.TELEGRAM_CHAT_ID = '';
    process.env.LINKEDIN_EMAIL = '';
    process.env.LINKEDIN_PASSWORD = '';
    jest.resetModules(); // This is important to reset the module cache
    const config = require('../../src/utils/config');

    expect(config.TELEGRAM_BOT_TOKEN).toBe('');
    expect(config.TELEGRAM_CHAT_ID).toBe('');
    expect(config.LINKEDIN_EMAIL).toBe('');
    expect(config.LINKEDIN_PASSWORD).toBe('');
  });

  it('should use environment variable values when they are set', () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test_bot_token';
    process.env.TELEGRAM_CHAT_ID = 'test_chat_id';
    process.env.LINKEDIN_EMAIL = 'test_email';
    process.env.LINKEDIN_PASSWORD = 'test_password';

    jest.resetModules(); // This is important to reset the module cache
    const config = require('../../src/utils/config');

    expect(config.TELEGRAM_BOT_TOKEN).toBe('test_bot_token');
    expect(config.TELEGRAM_CHAT_ID).toBe('test_chat_id');
    expect(config.LINKEDIN_EMAIL).toBe('test_email');
    expect(config.LINKEDIN_PASSWORD).toBe('test_password');
  });
});
