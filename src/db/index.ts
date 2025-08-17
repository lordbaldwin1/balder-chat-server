import { drizzle } from 'drizzle-orm/bun-sql';
import { config } from '../config';
import { SQL } from 'bun';

console.log("Connected to database, yay!");
const client = new SQL(config.dbURL);
export const db = drizzle({ client });
