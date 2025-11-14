export interface SearchCriteria {
  global: string[];
  id: string[];
  remark: string[];
  landmark: string[];
  area: string[];
  conn: string[];
  power: string[];
  dist: string[];
  loc: string[];
}

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