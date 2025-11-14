/**
 * Increments an Excel-style alphabetical suffix.
 * Handles single-character increments (A -> B), rollovers (Z -> AA),
 * and multi-character increments (AZ -> BA, ZZ -> AAA).
 * @param letters The current letter string (e.g., 'A', 'Z', 'AZ').
 * @returns The next letter string in the sequence.
 */
const incrementLetters = (letters: string): string => {
  if (typeof letters !== 'string' || letters.length === 0) {
    return 'A'; // Failsafe for empty or invalid input
  }

  const chars = letters.split('');
  let i = chars.length - 1;

  while (i >= 0) {
    if (chars[i] !== 'Z') {
      // Increment current character and we're done
      chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
      return chars.join('');
    } else {
      // Set current character to 'A' and carry over to the left
      chars[i] = 'A';
      i--;
    }
  }

  // If loop finished, all characters were 'Z'. Prepend 'A'.
  return 'A' + chars.join('');
};

/**
 * Generates the next sequential ID based on the provided logic:
 * - ID Structure: [TypeCode]-[Number(3 digits)][AlphabetSuffix]
 * - Increments number until 999.
 * - At 999, rolls number to 001 and increments the alphabetical suffix.
 *
 * @param lastId The last generated ID for a given type (e.g., 'JB-999A').
 * @param prefix The prefix for the ID type (e.g., 'JB', 'DB').
 * @returns The next sequential ID string (e.g., 'JB-001B').
 */
export const generateNextId = (lastId: string | null, prefix: string): string => {
  const fallbackId = `${prefix}-001A`;

  // If no previous ID exists, start with the first one in the sequence.
  if (!lastId) {
    return fallbackId;
  }

  // Isolate the core part of the ID (e.g., '001A' from 'JB-001A')
  const coreId = lastId.startsWith(`${prefix}-`) ? lastId.substring(prefix.length + 1) : lastId;
  
  // Use regex to parse the numeric and alphabetic parts.
  const parts = coreId.match(/^(\d{3})([A-Z]+)$/);

  // If the lastId doesn't match the expected format, return the default starting ID.
  if (!parts) {
    console.warn(`[ID Generator] Malformed 'lastId' (${lastId}) provided. Falling back to ${fallbackId}.`);
    return fallbackId;
  }

  const [, numStr, letters] = parts;
  const num = parseInt(numStr, 10);
  
  let nextNum: number;
  let nextLetters: string;

  // CORE LOGIC: Apply the specified increment rules.
  if (num < 999) {
    // Rule: If current number < 999, increment number, suffix is unchanged.
    nextNum = num + 1;
    nextLetters = letters;
  } else {
    // Rule: If current number = 999, reset number to 001 and increment suffix.
    nextNum = 1;
    nextLetters = incrementLetters(letters);
  }

  // Recombine: Format the new parts into the final ID string.
  const paddedNum = nextNum.toString().padStart(3, '0');
  return `${prefix}-${paddedNum}${nextLetters}`;
};
