import { runBot } from '../../src/index';
import { scrapeLinkedInPosts } from '../../src/services/scraper';
import { sendTelegramMessage } from '../../src/services/telegram';
import { readDataFromFile, writeDataToFile } from '../../src/utils/storage';
import { DATA_FILE } from '../../src/utils/config';

jest.mock('../../src/services/scraper');
jest.mock('../../src/services/telegram');
jest.mock('../../src/utils/storage');

describe('runBot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should scrape LinkedIn posts and send new posts via Telegram', async () => {
    const mockNewPosts = ['post1', 'post2'];
    const mockSavedPosts = ['post1'];
    const mockPostsToSend = ['post2'];

    (scrapeLinkedInPosts as jest.Mock).mockResolvedValue(mockNewPosts);
    (readDataFromFile as jest.Mock).mockReturnValue(mockSavedPosts);
    (sendTelegramMessage as jest.Mock).mockResolvedValue(undefined);
    (writeDataToFile as jest.Mock).mockReturnValue(undefined);

    await runBot();

    expect(scrapeLinkedInPosts).toHaveBeenCalled();
    expect(readDataFromFile).toHaveBeenCalledWith(DATA_FILE);
    expect(sendTelegramMessage).toHaveBeenCalledTimes(mockPostsToSend.length);
    expect(sendTelegramMessage).toHaveBeenCalledWith('post2');
    expect(writeDataToFile).toHaveBeenCalledWith(DATA_FILE, [...mockSavedPosts, ...mockPostsToSend]);
  });

  it('should not send any posts if there are no new posts', async () => {
    const mockNewPosts = ['post1'];
    const mockSavedPosts = ['post1'];

    (scrapeLinkedInPosts as jest.Mock).mockResolvedValue(mockNewPosts);
    (readDataFromFile as jest.Mock).mockReturnValue(mockSavedPosts);

    await runBot();

    expect(scrapeLinkedInPosts).toHaveBeenCalled();
    expect(readDataFromFile).toHaveBeenCalledWith(DATA_FILE);
    expect(sendTelegramMessage).not.toHaveBeenCalled();
    expect(writeDataToFile).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Test error');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (scrapeLinkedInPosts as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    await runBot();

    expect(scrapeLinkedInPosts).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error running bot:', mockError);

    consoleErrorSpy.mockRestore();
  });
});
