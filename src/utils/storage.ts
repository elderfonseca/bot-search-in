import fs from 'fs';

/**
 * Reads data from a JSON file.
 * @param {string} filename - The file path.
 * @returns {string[]} Array of stored data.
 */
export const readDataFromFile = (filename: string): string[] => {
  if (!fs.existsSync(filename)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(filename, 'utf-8'));
};

/**
 * Writes data to a JSON file.
 * @param {string} filename - The file path.
 * @param {string[]} data - Data to write.
 */
export const writeDataToFile = (filename: string, data: string[]): void => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
};
