import { Page } from 'puppeteer';

import { LINKEDIN_EMAIL, LINKEDIN_PASSWORD } from '../utils/config';

/**
 * Logs into LinkedIn using the provided credentials with error handling.
 * @param {Page} page - Puppeteer page instance.
 */
export const loginToLinkedIn = async (page: Page): Promise<void> => {
  try {
    console.log('Starting LinkedIn login process...');

    // Verificar se as credenciais estão disponíveis
    if (!LINKEDIN_EMAIL || !LINKEDIN_PASSWORD) {
      throw new Error('LinkedIn credentials not provided');
    }

    console.log(`Logging in with email: ${LINKEDIN_EMAIL.substring(0, 3)}***`);

    await page.goto('https://www.linkedin.com/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    console.log('Login page loaded');

    // Aguardar os campos de login estarem disponíveis
    await page.waitForSelector('#username', { timeout: 30000 });
    await page.waitForSelector('#password', { timeout: 30000 });

    console.log('Login fields found');

    // Limpar campos antes de digitar
    await page.click('#username', { clickCount: 3 });
    await page.type('#username', LINKEDIN_EMAIL, { delay: 100 });

    await page.click('#password', { clickCount: 3 });
    await page.type('#password', LINKEDIN_PASSWORD, { delay: 100 });

    console.log('Credentials entered');

    // Aguardar e clicar no botão de login
    const loginButtonSelector = '[type="submit"]';
    await page.waitForSelector(loginButtonSelector, { timeout: 30000 });

    const loginButton = await page.$(loginButtonSelector);
    if (!loginButton) {
      throw new Error('Login button not found');
    }

    // Simular movimento do mouse antes de clicar
    await page.mouse.move(Math.random() * 100 + 100, Math.random() * 100 + 100);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await page.click(loginButtonSelector);
    console.log('Login button clicked');

    // Aguardar navegação ou possível captcha/verificação
    try {
      await page.waitForNavigation({
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
      console.log('Navigation completed');
    } catch (navError) {
      console.log('No navigation occurred, checking current state...');
    }

    // Verificar se houve erro de login
    try {
      const errorMessage = await page.$eval('.alert-content', (el) => el.textContent);
      if (errorMessage) {
        console.error('Login error message detected:', errorMessage);
        throw new Error(`Login failed: ${errorMessage}`);
      }
    } catch (error) {
      // Sem mensagem de erro encontrada, continuar
    }

    // Verificar se há captcha ou verificação de segurança
    const challengeSelectors = ['.challenge', '.captcha-container', '[data-test-id="challenge"]', '.two-step-verification'];

    for (const selector of challengeSelectors) {
      const challengeElement = await page.$(selector);
      if (challengeElement) {
        console.warn('Security challenge detected. Manual intervention may be required.');

        // Fazer screenshot para debug
        await page.screenshot({
          path: `security-challenge-${Date.now()}.png`,
          fullPage: true,
        });

        // Aguardar um pouco mais para possível resolução manual
        await new Promise((resolve) => setTimeout(resolve, 10000));
        break;
      }
    }

    console.log('Checking for successful login...');
    console.log('Current URL:', page.url());

    // Fazer screenshot para debug
    await page.screenshot({
      path: `login-state-${Date.now()}.png`,
      fullPage: false,
    });
    console.log('Login state screenshot saved');

    // Verificar múltiplos indicadores de login bem-sucedido
    const successSelectors = [
      '.global-nav__me-photo',
      '.global-nav__me',
      '.global-nav__primary-item--profile',
      '[data-test-id="nav-me-photo"]',
    ];

    let loginSuccessful = false;

    for (const selector of successSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 15000 });
        console.log(`Login successful - found ${selector}`);
        loginSuccessful = true;
        break;
      } catch (error) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }

    if (!loginSuccessful) {
      // Última tentativa: verificar se estamos na página inicial do LinkedIn
      const currentUrl = page.url();
      if (
        currentUrl.includes('linkedin.com/feed') ||
        currentUrl.includes('linkedin.com/in/') ||
        currentUrl === 'https://www.linkedin.com/'
      ) {
        console.log('Login appears successful based on URL');
        loginSuccessful = true;
      }
    }

    if (!loginSuccessful) {
      // Fazer screenshot final para debug
      await page.screenshot({
        path: `login-failed-${Date.now()}.png`,
        fullPage: true,
      });
      throw new Error('Login verification failed - profile element not found');
    }

    console.log('Successfully logged into LinkedIn');
  } catch (error) {
    console.error('Error during LinkedIn login:', error);

    // Fazer screenshot do erro
    try {
      await page.screenshot({
        path: `login-error-${Date.now()}.png`,
        fullPage: true,
      });
      console.log('Error screenshot saved');
    } catch (screenshotError) {
      console.warn('Failed to save error screenshot:', screenshotError);
    }

    throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
