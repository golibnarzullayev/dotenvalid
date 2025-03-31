# dotenvalid

`dotenvalid` is a simple yet powerful dotenv library for Node.js and TypeScript. With this package, you can easily read the `.env` file, define variable types, set default values, and manage optional environment variables.

# Installation

Install via NPM:

```bash
npm install dotenvalid
```

Or via PNPM:

```bash
pnpm install dotenvalid
```

Or via YARN:

```bash
yarn add dotenvalid
```

# Usage

Use the loadEnv function to read the `.env` file and work with type-safe environment variables.

### Example:

```typescript
import { loadEnv } from "dotenvalid";

const env = loadEnv({
  NODE_ENV: { choices: ['localhost', 'development', 'production'] }
  PORT: { type: "number", default: 3000 },
  DEBUG: { type: "boolean", default: false },
  API_KEY: { optional: true },
  ALLOWED_ORIGINS: { type: "json", default: '["https://example.com"]' },
  API_BASE_URL: { type: "url" },
});

console.log(env.PORT); // number
console.log(env.DEBUG); // boolean
console.log(env.API_KEY); // string | undefined
console.log(env.ALLOWED_ORIGINS); // Array | undefined
console.log(env.API_BASE_URL); // string & url
```

## Parameters:

- type: The type of the environment variable:
  - string: For string values.
  - number: For numeric values.
  - boolean: For boolean (true/false) values.
  - json: For JSON formatted values (stored as a string and automatically parsed).
- default: The default value to be used if the environment variable is not found in the .env file.
- optional: Set this to true for optional environment variables. If not provided in the .env file, the variable will be undefined.
