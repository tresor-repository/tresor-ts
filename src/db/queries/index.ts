export const QUERIES = [
    `
    CREATE TABLE "user" (
        id SERIAL PRIMARY KEY,
        email VARCHAR,
        password VARCHAR
    );
    `
]

export function getCodeVersion(): number {
 return QUERIES.length
}