import { Pool, Client } from "pg";
import { url } from "inspector";

export function getPool(config: Config) : Pool {
  return new Pool({
    connectionString: getConnectionString(config)
  });
}

export function getClient(config: Config) : Client {
  return new Client({
    connectionString: getConnectionString(config)
  });
}

async function query(client: Client, query: string) {
  return client.query(query) 
}

function getConnectionString(config: Config) {
  return `postgresql://${config.user}:${config.password}@${config.url}:${
    config.port
  }/${config.db}`;
}

export interface Config {
  url: string;
  db: string;
  port: string;
  user: string;
  password: string;
}
