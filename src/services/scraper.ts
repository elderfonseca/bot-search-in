import puppeteer from 'puppeteer';
import { SEARCH_URLS } from '../utils/config';
import { loginToLinkedIn } from './login';
import * as fs from 'fs';

/**
 * Scrapes LinkedIn posts based on predefined search URLs with error handling.
 * @returns {Promise<string[]>} Array of scraped posts.
 */
export const scrapeLinkedInPosts = async (): Promise<string[]> => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );
    const cookiesFile = './cookies.json';
    if (fs.existsSync(cookiesFile)) {
      const cookies = JSON.parse(fs.readFileSync(cookiesFile, 'utf8'));
      await browser.setCookie(...cookies);
    }

    await loginToLinkedIn(page);

    fs.writeFileSync(cookiesFile, JSON.stringify(await browser.cookies(), null, 2));

    console.log('Navigating to LinkedIn search URLs...');

    let allPosts: string[] = [];

    for (const url of SEARCH_URLS) {
      try {
        console.log(`Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await page.waitForSelector('.scaffold-finite-scroll__content', { timeout: 10000 });

        const posts = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('div.feed-shared-update-v2'))
            .map((post) => {
              try {
                const textElement = post.querySelector('div.update-components-text span.break-words') as HTMLElement;
                return textElement?.innerText?.trim();
              } catch (error) {
                console.error('Error extracting post text:', error);
                return undefined;
              }
            })
            .filter((text) => text !== undefined) as string[];
        });

        console.log(`Scraped ${posts.length} posts from ${url}`);
        allPosts = [...allPosts, ...posts];
      } catch (error) {
        console.error(`Error scraping URL: ${url}`, error);
      }
    }

    if (!allPosts.length) {
      console.warn('No posts were scraped.');
      return [];
    }

    return allPosts;
  } catch (error) {
    console.error('Error launching Puppeteer:', error);
    return [];
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log('Browser closed.');
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }
};
