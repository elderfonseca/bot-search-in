import { scrapeLinkedInPosts } from './services/scraper';
import { sendTelegramMessage } from './services/telegram';
import { readDataFromFile, writeDataToFile } from './utils/storage';
import { DATA_FILE } from './utils/config';

/**
 * Main function to scrape LinkedIn posts and send them via Telegram.
 */
export const runBot = async (): Promise<void> => {
  try {
    console.log('Starting LinkedIn scraper...');
    const newPosts = await scrapeLinkedInPosts();
    const savedPosts = readDataFromFile(DATA_FILE);

    const postsToSend = newPosts.filter((post) => !savedPosts.includes(post));

    if (postsToSend.length) {
      for (const post of postsToSend) {
        await sendTelegramMessage(post);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      writeDataToFile(DATA_FILE, [...savedPosts, ...postsToSend]);
    } else {
      console.warn('No new posts found to send.');
    }
  } catch (error) {
    console.error('Error running bot:', error);
  }
};

runBot();
