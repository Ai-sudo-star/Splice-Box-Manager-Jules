/**
 * Represents the structured result of a parsed search query.
 * Each property contains an array of search terms for that specific field.
 */
export interface SearchCriteria {
  /** General search terms that don't belong to a specific field. */
  global: string[];
  /** Search terms for the 'id' field. */
  id: string[];
  /** Search terms for the 'remark' field. */
  remark: string[];
  /** Search terms for the 'landmark' field. */
  landmark: string[];
  /** Search terms for the 'area' field. */
  area: string[];
  /** Search terms for the 'conn' (connection) field. */
  conn: string[];
  /** Search terms for the 'power' field. */
  power: string[];
  /** Search terms for the 'dist' (distance) field. */
  dist: string[];
  /** Search terms for the 'loc' (location) field. */
  loc: string[];
}

/**
 * Maps various user-friendly search key aliases to their corresponding
 * keys in the `SearchCriteria` interface. This allows for more flexible
 * search queries (e.g., 'note:' and 'remark:' both map to 'remark').
 */
const keyAliases: { [key: string]: keyof Omit<SearchCriteria, 'global'> } = {
    id: 'id',
    note: 'remark',
    remark: 'remark',
    landmark: 'landmark',
    area: 'area',
    conn: 'conn',
    connection: 'conn',
    power: 'power',
    dist: 'dist',
    distance: 'dist',
    loc: 'loc',
    location: 'loc',
};

/**
 * Parses a raw search query string into a structured `SearchCriteria` object.
 * The function supports both global search terms and field-specific searches
 * using the format `key:value`. It also handles quoted values for terms
 * that include spaces.
 *
 * @param query The raw search string to parse.
 * @returns A `SearchCriteria` object containing the parsed terms.
 */
export const parseSearchQuery = (query: string): SearchCriteria => {
    const criteria: SearchCriteria = {
        global: [],
        id: [],
        remark: [],
        landmark: [],
        area: [],
        conn: [],
        power: [],
        dist: [],
        loc: [],
    };

    const regex = /(?:(\w+):(?:"([^"]*)"|'([^']*)'|(\S+)))|(\S+)/g;
    let match;

    while ((match = regex.exec(query)) !== null) {
        const [, key, quotedValue, singleQuotedValue, value, globalTerm] = match;

        if (globalTerm) {
            criteria.global.push(globalTerm.toLowerCase());
        } else if (key) {
            const term = (quotedValue || singleQuotedValue || value || '').toLowerCase();
            const mappedKey = keyAliases[key.toLowerCase()];
            if (mappedKey && term) {
                criteria[mappedKey].push(term);
            } else {
                criteria.global.push(`${key}:${term}`.toLowerCase());
            }
        }
    }
    return criteria;
};