type Config = {
  baseURL: string;
  port: string;
  platform: string;
  dbURL: string;
}

export const config: Config = {
  baseURL: envOrThrow("BASE_URL"),
  port: envOrThrow("PORT"),
  platform: envOrThrow("PLATFORM"),
  dbURL: envOrThrow("DATABASE_URL"),
}

function envOrThrow(key: string) {
  const val = process.env[key];
  if (!val) {
    throw new Error(`${key} must be defined in .env`);
  }
  return val;
}