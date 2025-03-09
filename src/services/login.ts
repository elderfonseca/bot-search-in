import { Page } from 'puppeteer';
import { LINKEDIN_EMAIL, LINKEDIN_PASSWORD } from '../utils/config';

/**
 * Logs into LinkedIn using the provided credentials with error handling.
 * @param {Page} page - Puppeteer page instance.
 */
export const loginToLinkedIn = async (page: Page): Promise<void> => {
  try {
    await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Logging into LinkedIn');

    await page.type('#username', LINKEDIN_EMAIL, { delay: 100 });
    await page.type('#password', LINKEDIN_PASSWORD, { delay: 100 });
    console.log('Credentials entered');

    const loginButtonSelector = '[type="submit"]';
    await page.waitForSelector(loginButtonSelector, { timeout: 10000 });
    const loginButton = await page.$(loginButtonSelector);
    if (!loginButton) {
      console.error('Login button not found');
    } else {
      await page.mouse.move(100, 100);
      await page.click(loginButtonSelector);
      await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 });
      console.log('Login button clicked');
    }

    console.log('Waiting for profile picture selector to confirm login...');
    console.log('Current URL:', page.url());
    await page.screenshot({ path: 'login-debug.png', fullPage: true });
    console.log('Screenshot saved. Check login-debug.png');
    const errorMessage = await page.$eval('.alert-content', (el) => el.textContent).catch(() => null);
    if (errorMessage) {
      console.error('Login error message detected:', errorMessage);
    }
    await page.waitForSelector('.global-nav__me-photo', { timeout: 30000 });

    console.log('Logged into LinkedIn successfully.');
  } catch (error) {
    console.error('Error logging into LinkedIn:', error);
    throw new Error('Login failed');
  }
};
