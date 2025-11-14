/**
 * A custom sort function to correctly sort splice box IDs.
 * e.g., JB-001A, JB-999A, JB-001B
 * @param a - The first ID string.
 * @param b - The second ID string.
 * @returns A number indicating the sort order.
 */
export const sortSpliceBoxIds = (a: string, b: string): number => {
    const partsA = a.match(/-(\d{3})([A-Z]+)$/);
    const partsB = b.match(/-(\d{3})([A-Z]+)$/);

    if (!partsA || !partsB) {
        return a.localeCompare(b); // fallback for malformed IDs
    }

    const [, numStrA, lettersA] = partsA;
    const [, numStrB, lettersB] = partsB;

    // Sort by length of letter suffix first (A vs AA)
    if (lettersA.length !== lettersB.length) {
        return lettersA.length - lettersB.length;
    }
    // Then sort alphabetically by suffix (AA vs AB)
    if (lettersA !== lettersB) {
        return lettersA.localeCompare(lettersB);
    }
    
    // Finally, sort by number (001 vs 002)
    return parseInt(numStrA, 10) - parseInt(numStrB, 10);
};
