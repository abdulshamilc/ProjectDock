import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Attempt to load .env from module directory or current working directory if available
const localEnvPath = fileURLToPath(new URL('../../.env', import.meta.url));
if (fs.existsSync(localEnvPath)) {
  try {
    process.loadEnvFile(localEnvPath);
  } catch {
    // Silently continue if unable to load
  }
} else {
  const cwdEnvPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(cwdEnvPath)) {
    try {
      process.loadEnvFile(cwdEnvPath);
    } catch {
      // Silently continue
    }
  }
}

const requiredVars = ['MONGO_URI'];

for (const key of requiredVars) {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI,
  isTest: process.env.NODE_ENV === 'test',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
});

export default env;
