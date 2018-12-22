import { Pool } from "pg";
import { Config, getPool } from ".";
import { getCodeVersion, QUERIES } from "./queries/index";

export function migrate(config: Config): Promise<boolean> {
  const pool = getPool(config);
  return doMigrate(pool);
}

async function doMigrate(pool: Pool): Promise<boolean> {
    pool.connect();
    const dbVersion = await getCurrentDbVersion(pool);
    const codeVersion = getCodeVersion();
    if (codeVersion > dbVersion) {
      for (const query of QUERIES) {
        await pool.query(query);
      }

      await updateDbVersion(pool, codeVersion);
    }
    pool.end();
    return true;
}

async function getCurrentDbVersion(pool: Pool): Promise<number> {
  await pool.query(
    `
    CREATE TABLE IF NOT EXISTS meta (
      key VARCHAR(50) PRIMARY KEY,
      value integer NOT NULL DEFAULT 0
    );
    `
  );

  await pool.query(
    `
    INSERT INTO meta (key, value)
                VALUES ('db-version', 0)
                ON CONFLICT DO NOTHING
    `
  );

  const result = await pool.query(
    `SELECT value FROM meta WHERE key = 'db-version'`
  );
  return result.rows[0].value;
}

async function updateDbVersion(pool: Pool, version: number): Promise<number> {
  const result = await pool.query(
    `
    UPDATE meta SET VALUE = ${version} WHERE key = 'db-version'
    `
  );
  return result.rowCount;
}
