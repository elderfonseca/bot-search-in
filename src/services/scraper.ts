import { Page } from 'puppeteer';

/**
 * Scrapes LinkedIn posts based on specified keywords.
 * @param page - The Puppeteer page instance.
 * @param url - The LinkedIn search URL.
 * @returns A promise that resolves to an array of scraped posts.
 */
export const scrapeLinkedInPosts = async (page: Page, url: string): Promise<string[]> => {
  await page.goto(url);

  // Wait for posts to load
  await page.waitForSelector('.search-results__list'); // Adjust selector as needed

  // Scrape post contents
  const posts = await page.evaluate(() => {
    const postElements = document.querySelectorAll('.search-results__list .post-class'); // Adjust selector as needed
    return Array.from(postElements).map((post) => (post as HTMLElement).innerText);
  });

  return posts; // Return the array of scraped post contents
};
