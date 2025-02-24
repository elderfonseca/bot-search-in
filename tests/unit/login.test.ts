import { loginToLinkedIn } from '../../src/services/login';
import { Page } from 'puppeteer';

jest.mock('puppeteer');

describe('loginToLinkedIn', () => {
  let page: jest.Mocked<Page>;

  beforeEach(() => {
    page = {
      goto: jest.fn(),
      type: jest.fn(),
      waitForSelector: jest.fn(),
      click: jest.fn(),
    } as unknown as jest.Mocked<Page>;
  });

  it('should log into LinkedIn successfully', async () => {
    page.goto.mockResolvedValueOnce(null);
    page.type.mockResolvedValueOnce(undefined);
    page.waitForSelector.mockResolvedValueOnce(null);
    page.click.mockResolvedValueOnce(undefined);
    page.waitForSelector.mockResolvedValueOnce(null);

    await loginToLinkedIn(page);

    expect(page.goto).toHaveBeenCalledWith('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
    expect(page.type).toHaveBeenCalledWith('#username', expect.any(String));
    expect(page.type).toHaveBeenCalledWith('#password', expect.any(String));
    expect(page.waitForSelector).toHaveBeenCalledWith('[type="submit"]', { timeout: 10000 });
    expect(page.click).toHaveBeenCalledWith('[type="submit"]');
    expect(page.waitForSelector).toHaveBeenCalledWith('.global-nav__me-photo', { timeout: 15000 });
  });

  it('should throw an error if login fails', async () => {
    page.goto.mockRejectedValueOnce(new Error('Network error'));

    await expect(loginToLinkedIn(page)).rejects.toThrow('Login failed');

    expect(page.goto).toHaveBeenCalledWith('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
  });
});
