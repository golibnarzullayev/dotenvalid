import { loadDotenv } from "./parser";
import { EnvConfig, EnvSchema, EnvType } from "./type";

export function loadEnv<T extends Record<string, EnvConfig>>(
  schema: T
): EnvSchema<T> {
  loadDotenv();
  const parsedEnv = {} as EnvSchema<T>;

  for (const key in schema) {
    const config = schema[key];
    let value: string | undefined = process.env[key];

    const type: EnvType = config.type || "string";

    if (value === undefined) {
      if (config.default !== undefined) {
        parsedEnv[key] = config.default as EnvSchema<T>[typeof key];
        continue;
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
          parsedEnv[key] = parsedNumber as EnvSchema<T>[typeof key];
          break;
        case "boolean":
          if (value !== "true" && value !== "false")
            throw new Error(`Environment variable ${key} should be a boolean`);
          parsedEnv[key] = (value === "true") as EnvSchema<T>[typeof key];
          break;
        case "json":
          try {
            parsedEnv[key] = JSON.parse(value) as EnvSchema<T>[typeof key];
          } catch {
            throw new Error(`Environment variable ${key} should be valid JSON`);
          }
          break;
        case "url":
          try {
            new URL(value);
            parsedEnv[key] = value as EnvSchema<T>[typeof key];
          } catch {
            throw new Error(
              `Environment variable ${key} should be a valid URL`
            );
          }
          break;
        default:
          throw new Error(`Unsupported type for environment variable: ${key}`);
      }

      if (
        config.choices &&
        !config.choices.includes(parsedEnv[key] as string)
      ) {
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
