/**
 * Utility functions for string operations in a production-level TypeScript application.
 */

/**
 * Converts a string to camelCase.
 * @param input - The string to convert.
 * @returns The camelCased string.
 */
export const toCamelCase = (input: string): string => {
    return input
      .replace(/([-_][a-z])/gi, (match) =>
        match.toUpperCase().replace(/[-_]/, "")
      )
      .replace(/^(.)/, (match) => match.toLowerCase());
  };
  
  /**
   * Converts a string to snake_case.
   * @param input - The string to convert.
   * @returns The snake_cased string.
   */
  export const toSnakeCase = (input: string): string => {
    return input
      .replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`)
      .replace(/^_/, "");
  };
  
  /**
   * Converts a string to kebab-case.
   * @param input - The string to convert.
   * @returns The kebab-cased string.
   */
  export const toKebabCase = (input: string): string => {
    return input
      .replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)
      .replace(/^-/, "");
  };
  
  /**
   * Truncates a string to a specified length and appends an ellipsis if truncated.
   * @param input - The string to truncate.
   * @param maxLength - The maximum length of the string.
   * @returns The truncated string.
   */
  export const truncate = (input: string, maxLength: number): string => {
    return input.length > maxLength ? `${input.slice(0, maxLength)}...` : input;
  };
  
  /**
   * Capitalizes the first letter of a string.
   * @param input - The string to capitalize.
   * @returns The string with the first letter capitalized.
   */
  export const capitalize = (input: string): string => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };
  
  /**
   * Checks if a string is a palindrome.
   * @param input - The string to check.
   * @returns `true` if the string is a palindrome, `false` otherwise.
   */
  export const isPalindrome = (input: string): boolean => {
    const sanitized = input.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    return sanitized === sanitized.split("").reverse().join("");
  };
  
  /**
   * Generates a random string of the specified length.
   * @param length - The length of the random string.
   * @returns A random alphanumeric string.
   */
  export const generateRandomString = (length: number): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  /**
   * Escapes special characters in a string for safe use in HTML.
   * @param input - The string to escape.
   * @returns The escaped string.
   */
  export const escapeHtml = (input: string): string => {
    const htmlEntities: { [char: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return input.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
  };
  
  /**
   * Reverses a string.
   * @param input - The string to reverse.
   * @returns The reversed string.
   */
  export const reverseString = (input: string): string => {
    return input.split("").reverse().join("");
  };
  
  /**
   * Counts the number of words in a string.
   * @param input - The string to count words in.
   * @returns The word count.
   */
  export const wordCount = (input: string): number => {
    return input.trim().split(/\s+/).length;
  };
  
  /**
   * Removes all whitespace from a string.
   * @param input - The string to process.
   * @returns The string without any whitespace.
   */
  export const removeWhitespace = (input: string): string => {
    return input.replace(/\s+/g, "");
  };
  
  /**
   * Converts a string to Title Case.
   * @param input - The string to convert.
   * @returns The Title Cased string.
   */
  export const toTitleCase = (input: string): string => {
    return input
      .toLowerCase()
      .split(" ")
      .map((word) => capitalize(word))
      .join(" ");
  };
  
  /**
   * Checks if a string is empty or contains only whitespace.
   * @param input - The string to check.
   * @returns `true` if the string is empty or whitespace, `false` otherwise.
   */
  export const isEmptyOrWhitespace = (input: string): boolean => {
    return input.trim().length === 0;
  };
  