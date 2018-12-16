import { Config, getPool } from ".";
import { Pool } from "pg";
import { getCodeVersion, QUERIES } from "./queries/index";

export function migrate(config: Config) {
  console.log("Preparing db migration...");
  const pool = getPool(config)
  doMigrate(pool);
}

async function doMigrate(pool: Pool) {
  try {
    pool.connect();
    console.log(`total pool count: ${pool.totalCount}`);
    const dbVersion = await getCurrentDbVersion(pool);
    const codeVersion = getCodeVersion();
    console.log(`dbVersion: ${dbVersion}, codeVersion: ${codeVersion}`);
    if (codeVersion > dbVersion) {
      for(let query of QUERIES) {
        console.log("Executing migration query...")
        console.log(query)
        await pool.query(query) 
      }
      
      await updateDbVersion(pool, codeVersion)
    }
    pool.end()
  } catch (e) {
    console.log(e);
  }
}

async function getCurrentDbVersion(pool: Pool) {
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

async function updateDbVersion(pool: Pool, version: number) {
  console.log("Updating database version...")
  const result = await pool.query(
    `
    UPDATE meta SET VALUE = ${version} WHERE key = 'db-version'
    `
  )
  return result.rowCount;
}