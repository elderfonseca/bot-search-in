import puppeteer, { Page } from 'puppeteer';

/**
 * Logs in to LinkedIn using provided credentials.
 * @param email - The LinkedIn email.
 * @param password - The LinkedIn password.
 * @returns A promise that resolves to the Puppeteer page instance.
 */
export const loginToLinkedIn = async (email: string, password: string): Promise<Page> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.linkedin.com/login');

  // Fill in email and password
  await page.type('input[name="session_key"]', email);
  await page.type('input[name="session_password"]', password);

  // Click login button
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  return page; // Return the page instance for further actions
};
