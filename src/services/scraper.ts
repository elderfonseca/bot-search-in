import puppeteer from 'puppeteer';
import * as fs from 'fs';

import { SEARCH_URLS } from '../utils/config';
import { loginToLinkedIn } from './login';

/**
 * Scrapes LinkedIn posts based on predefined search URLs with error handling.
 * @returns {Promise<string[]>} Array of scraped posts.
 */
export const scrapeLinkedInPosts = async (): Promise<string[]> => {
  let browser;
  try {
    const isCI = process.env.CI === 'true';

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        ...(isCI ? ['--disable-extensions'] : []),
      ],
      slowMo: isCI ? 100 : 50,
      timeout: 60000,
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (resourceType === 'stylesheet' || resourceType === 'image' || resourceType === 'font') {
        req.abort();
      } else {
        req.continue();
      }
    });

    const cookiesFile = './cookies.json';
    if (fs.existsSync(cookiesFile)) {
      try {
        const cookies = JSON.parse(fs.readFileSync(cookiesFile, 'utf8'));
        await page.setCookie(...cookies);
        console.log('Cookies loaded successfully');
      } catch (error) {
        console.warn('Failed to load cookies:', error);
      }
    }

    await loginToLinkedIn(page);

    try {
      const cookies = await page.cookies();
      fs.writeFileSync(cookiesFile, JSON.stringify(cookies, null, 2));
      console.log('Cookies saved successfully');
    } catch (error) {
      console.warn('Failed to save cookies:', error);
    }

    console.log('Navigating to LinkedIn search URLs...');

    let allPosts: string[] = [];

    for (const url of SEARCH_URLS) {
      try {
        console.log(`Navigating to: ${url}`);
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 45000,
        });

        await page.waitForSelector('.scaffold-finite-scroll__content', {
          timeout: 30000,
        });

        await new Promise((resolve) => setTimeout(resolve, 3000));

        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const posts = await page.evaluate(() => {
          const postElements = Array.from(document.querySelectorAll('div.feed-shared-update-v2'));
          console.log(`Found ${postElements.length} post elements`);

          return postElements
            .map((post) => {
              try {
                const selectors = [
                  'div.update-components-text span.break-words',
                  '.feed-shared-text',
                  '.feed-shared-update-v2__description',
                  '[data-test-id="main-feed-activity-card"] .break-words',
                ];

                let textElement: HTMLElement | null = null;

                for (const selector of selectors) {
                  textElement = post.querySelector(selector) as HTMLElement;
                  if (textElement && textElement.innerText?.trim()) {
                    break;
                  }
                }

                const text = textElement?.innerText?.trim();
                if (text && text.length > 50) {
                  return text;
                }
                return undefined;
              } catch (error) {
                console.error('Error extracting post text:', error);
                return undefined;
              }
            })
            .filter((text): text is string => text !== undefined);
        });

        console.log(`Scraped ${posts.length} posts from ${url}`);
        allPosts = [...allPosts, ...posts];

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error scraping URL: ${url}`, error);
        try {
          await page.screenshot({
            path: `error-${Date.now()}.png`,
            fullPage: false,
          });
          console.log('Error screenshot saved');
        } catch (screenshotError) {
          console.warn('Failed to save error screenshot:', screenshotError);
        }
      }
    }

    if (!allPosts.length) {
      console.warn('No posts were scraped.');

      try {
        await page.screenshot({
          path: `debug-no-posts-${Date.now()}.png`,
          fullPage: false,
        });
        console.log('Debug screenshot saved');
      } catch (screenshotError) {
        console.warn('Failed to save debug screenshot:', screenshotError);
      }

      return [];
    }

    console.log(`Total posts scraped: ${allPosts.length}`);
    return allPosts;
  } catch (error) {
    console.error('Error in scrapeLinkedInPosts:', error);
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
