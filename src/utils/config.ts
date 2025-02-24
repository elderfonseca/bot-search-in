import dotenv from 'dotenv';
dotenv.config();

export const SEARCH_URLS = [
  'https://www.linkedin.com/search/results/content/?keywords=%22angular%22%20%2B%20%22latam%22%20%2B%20%22remote%22&origin=GLOBAL_SEARCH_HEADER&sortBy=%22date_posted%22',
  'https://www.linkedin.com/search/results/content/?keywords=%22frontend%22%20%2B%20%22latam%22%20%2B%20%22remote%22&origin=GLOBAL_SEARCH_HEADER&sortBy=%22date_posted%22',
  'https://www.linkedin.com/search/results/content/?keywords=%22front-end%22%20%2B%20%22latam%22%20%2B%20%22remote%22&origin=GLOBAL_SEARCH_HEADER&sortBy=%22date_posted%22',
];

export const DATA_FILE = 'results.json';

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
export const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
export const LINKEDIN_EMAIL = process.env.LINKEDIN_EMAIL || '';
export const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD || '';
