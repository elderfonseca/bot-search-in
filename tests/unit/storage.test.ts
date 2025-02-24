import { readDataFromFile, writeDataToFile } from '../../src/utils/storage';
import fs from 'fs';

jest.mock('fs');

describe('storage utility functions', () => {
  const filename = 'test.json';
  const data = ['item1', 'item2'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('readDataFromFile', () => {
    it('should return an empty array if the file does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = readDataFromFile(filename);

      expect(result).toEqual([]);
      expect(fs.existsSync).toHaveBeenCalledWith(filename);
    });

    it('should return parsed data if the file exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(data));

      const result = readDataFromFile(filename);

      expect(result).toEqual(data);
      expect(fs.existsSync).toHaveBeenCalledWith(filename);
      expect(fs.readFileSync).toHaveBeenCalledWith(filename, 'utf-8');
    });
  });

  describe('writeDataToFile', () => {
    it('should write data to the file', () => {
      writeDataToFile(filename, data);

      expect(fs.writeFileSync).toHaveBeenCalledWith(filename, JSON.stringify(data, null, 2));
    });
  });
});
