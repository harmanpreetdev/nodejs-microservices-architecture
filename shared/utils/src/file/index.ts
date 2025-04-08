import fs from "fs/promises";
import { Stats } from "fs";
import path from "path";

/**
 * Checks if a file or directory exists.
 * @param filePath - Path to the file or directory.
 * @returns A promise that resolves to true if the path exists, otherwise false.
 */
export const pathExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

/**
 * Ensures that a directory exists. Creates it if it does not exist.
 * @param dirPath - Path to the directory.
 */
export const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  await fs.mkdir(dirPath, { recursive: true });
};

/**
 * Reads the contents of a file.
 * @param filePath - Path to the file.
 * @param encoding - Encoding format, defaults to 'utf-8'.
 * @returns A promise that resolves to the file contents.
 */
export const readFile = async (
  filePath: string,
  encoding: BufferEncoding = "utf-8"
): Promise<string> => {
  return await fs.readFile(filePath, encoding);
};

/**
 * Writes data to a file. Creates the file if it doesn't exist, or overwrites it if it does.
 * @param filePath - Path to the file.
 * @param data - Data to write.
 * @param encoding - Encoding format, defaults to 'utf-8'.
 */
export const writeFile = async (
  filePath: string,
  data: string,
  encoding: BufferEncoding = "utf-8"
): Promise<void> => {
  await fs.writeFile(filePath, data, encoding);
};

/**
 * Appends data to a file. Creates the file if it doesn't exist.
 * @param filePath - Path to the file.
 * @param data - Data to append.
 * @param encoding - Encoding format, defaults to 'utf-8'.
 */
export const appendToFile = async (
  filePath: string,
  data: string,
  encoding: BufferEncoding = "utf-8"
): Promise<void> => {
  await fs.appendFile(filePath, data, encoding);
};

/**
 * Deletes a file if it exists.
 * @param filePath - Path to the file.
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  if (await pathExists(filePath)) {
    await fs.unlink(filePath);
  }
};

/**
 * Deletes a directory and all its contents.
 * @param dirPath - Path to the directory.
 */
export const deleteDirectory = async (dirPath: string): Promise<void> => {
  if (await pathExists(dirPath)) {
    await fs.rm(dirPath, { recursive: true, force: true });
  }
};

/**
 * Copies a file or directory to a new location.
 * @param src - Source path.
 * @param dest - Destination path.
 */
export const copy = async (src: string, dest: string): Promise<void> => {
  await fs.cp(src, dest, { recursive: true });
};

/**
 * Moves a file or directory to a new location.
 * @param src - Source path.
 * @param dest - Destination path.
 */
export const move = async (src: string, dest: string): Promise<void> => {
  await fs.rename(src, dest);
};

/**
 * Lists the contents of a directory.
 * @param dirPath - Path to the directory.
 * @returns A promise that resolves to an array of file and directory names.
 */
export const listDirectoryContents = async (
  dirPath: string
): Promise<string[]> => {
  return await fs.readdir(dirPath);
};

/**
 * Gets detailed information about a file or directory.
 * @param filePath - Path to the file or directory.
 * @returns A promise that resolves to the file stats.
 */
export const getFileStats = async (filePath: string): Promise<Stats | null> => {
  try {
    return await fs.stat(filePath);
  } catch {
    return null;
  }
};

/**
 * Reads a JSON file and parses its contents.
 * @param filePath - Path to the JSON file.
 * @returns A promise that resolves to the parsed JSON object.
 */
export const readJSONFile = async <T = any>(filePath: string): Promise<T> => {
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content);
};

/**
 * Writes an object to a JSON file.
 * @param filePath - Path to the JSON file.
 * @param data - Object to write.
 */
export const writeJSONFile = async <T = any>(
  filePath: string,
  data: T
): Promise<void> => {
  const jsonContent = JSON.stringify(data, null, 2);
  await writeFile(filePath, jsonContent, "utf-8");
};

/**
 * Joins multiple path segments into a single path.
 * @param paths - Path segments to join.
 * @returns The joined path.
 */
export const joinPaths = (...paths: string[]): string => {
  return path.join(...paths);
};

/**
 * Resolves an absolute path from a relative path.
 * @param relativePath - The relative path to resolve.
 * @returns The resolved absolute path.
 */
export const resolvePath = (relativePath: string): string => {
  return path.resolve(relativePath);
};

/**
 * Normalizes a file path, resolving redundant segments like `..` or `.`.
 * @param filePath - The file path to normalize.
 * @returns The normalized path.
 */
export const normalizePath = (filePath: string): string => {
  return path.normalize(filePath);
};
