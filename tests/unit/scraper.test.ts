import puppeteer from 'puppeteer';
import { scrapeLinkedInPosts } from '../../src/services/scraper';
import { loginToLinkedIn } from '../../src/services/login';
import * as config from '../../src/utils/config';

jest.mock('puppeteer');
jest.mock('../../src/services/login');
jest.mock('../../src/utils/config');

describe('scrapeLinkedInPosts', () => {
  let browser: any;
  let page: any;

  beforeEach(() => {
    browser = {
      newPage: jest.fn(),
      close: jest.fn(),
    };
    page = {
      goto: jest.fn(),
      waitForSelector: jest.fn(),
      evaluate: jest.fn(),
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue(browser);
    browser.newPage.mockResolvedValue(page);
    (loginToLinkedIn as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should scrape posts from LinkedIn search URLs', async () => {
    const mockPosts = ['Post 1', 'Post 2'];
    page.evaluate.mockResolvedValue(mockPosts);
    (config as any).SEARCH_URLS = ['https://example.com/search1', 'https://example.com/search2'];

    const result = await scrapeLinkedInPosts();

    expect(puppeteer.launch).toHaveBeenCalledWith({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    expect(browser.newPage).toHaveBeenCalled();
    expect(loginToLinkedIn).toHaveBeenCalledWith(page);
    expect(page.goto).toHaveBeenCalledTimes(2);
    expect(page.waitForSelector).toHaveBeenCalledTimes(2);
    expect(page.evaluate).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockPosts.concat(mockPosts));
    expect(browser.close).toHaveBeenCalled();
  });

  it('should handle errors during scraping', async () => {
    page.goto.mockRejectedValue(new Error('Navigation error'));
    (config as any).SEARCH_URLS = ['https://example.com/search1'];

    const result = await scrapeLinkedInPosts();

    expect(puppeteer.launch).toHaveBeenCalledWith({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    expect(browser.newPage).toHaveBeenCalled();
    expect(loginToLinkedIn).toHaveBeenCalledWith(page);
    expect(page.goto).toHaveBeenCalled();
    expect(result).toEqual([]);
    expect(browser.close).toHaveBeenCalled();
  });

  it('should handle errors during browser launch', async () => {
    (puppeteer.launch as jest.Mock).mockRejectedValue(new Error('Launch error'));

    const result = await scrapeLinkedInPosts();

    expect(puppeteer.launch).toHaveBeenCalledWith({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    expect(result).toEqual([]);
  });

  it('should handle errors during browser close', async () => {
    browser.close.mockRejectedValue(new Error('Close error'));
    const mockPosts = ['Post 1'];
    page.evaluate.mockResolvedValue(mockPosts);
    (config as any).SEARCH_URLS = ['https://example.com/search1'];

    const result = await scrapeLinkedInPosts();

    expect(puppeteer.launch).toHaveBeenCalledWith({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    expect(browser.newPage).toHaveBeenCalled();
    expect(loginToLinkedIn).toHaveBeenCalledWith(page);
    expect(page.goto).toHaveBeenCalled();
    expect(page.waitForSelector).toHaveBeenCalled();
    expect(page.evaluate).toHaveBeenCalled();
    expect(result).toEqual(mockPosts);
    expect(browser.close).toHaveBeenCalled();
  });
});
