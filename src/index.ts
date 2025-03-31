import { loadDotenv } from "./parser";
import { EnvSchema, EnvType } from "./type";

export function loadEnv<
  T extends Record<
    string,
    { type?: EnvType; default?: any; optional?: boolean; choices?: any[] }
  >
>(schema: T): EnvSchema<T> {
  loadDotenv();
  const parsedEnv = {} as EnvSchema<T>;

  for (const key in schema) {
    const config = schema[key];
    let value = process.env[key];

    // Default type to "string" if not specified
    const type = config.type || "string";

    if (value === undefined) {
      if (config.default !== undefined) {
        value = config.default;
      } else if (!config.optional) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }

    if (value !== undefined) {
      switch (type) {
        case "string":
          parsedEnv[key] = value as any;
          break;
        case "number":
          const parsedNumber = Number(value);
          if (isNaN(parsedNumber))
            throw new Error(`Environment variable ${key} should be a number`);
          parsedEnv[key] = parsedNumber as any;
          break;
        case "boolean":
          if (value !== "true" && value !== "false")
            throw new Error(`Environment variable ${key} should be a boolean`);
          parsedEnv[key] = (value === "true") as any;
          break;
        case "json":
          try {
            parsedEnv[key] = JSON.parse(value) as any;
          } catch {
            throw new Error(`Environment variable ${key} should be valid JSON`);
          }
          break;
        case "url":
          try {
            new URL(value);
            parsedEnv[key] = value as any;
          } catch {
            throw new Error(
              `Environment variable ${key} should be a valid URL`
            );
          }
          break;
        default:
          throw new Error(`Unsupported type for environment variable: ${key}`);
      }

      if (config.choices && !config.choices.includes(parsedEnv[key])) {
        throw new Error(
          `Environment variable ${key} should be one of: ${config.choices.join(
            ", "
          )}`
        );
      }
    }
  }

  return parsedEnv;
}
