import { loadDotenv } from "./parser";
import { Env, EnvSchemaType } from "./type";

export function loadEnv<T extends Record<string, EnvSchemaType>>(
  config: T
): Env<T> {
  loadDotenv();

  const parsedEnv: Record<string, string> = {};

  for (const key in config) {
    const { type, default: defaultValue, optional } = config[key];

    let value = process.env[key];

    if (value === undefined) {
      if (defaultValue !== undefined) {
        value = String(defaultValue);
      } else if (!optional) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }

    if (value !== undefined) {
      switch (type) {
        case "string":
          parsedEnv[key] = value;
          break;
        case "number":
          const parsedNumber = Number(value);
          if (isNaN(parsedNumber)) {
            throw new Error(`Environment variable ${key} should be a number`);
          }
          parsedEnv[key] = value;
          break;
        case "boolean":
          if (value !== "true" && value !== "false") {
            throw new Error(
              `Environment variable ${key} should be a boolean (true/false)`
            );
          }
          parsedEnv[key] = value;
          break;
        case "json":
          try {
            parsedEnv[key] = JSON.parse(value);
          } catch (e) {
            throw new Error(
              `Environment variable ${key} should be a valid JSON`
            );
          }
          break;
        case "url":
          try {
            new URL(value);
            parsedEnv[key] = value;
          } catch (e) {
            throw new Error(
              `Environment variable ${key} should be a valid URL`
            );
          }
          break;
        default:
          throw new Error(`Unsupported type for environment variable: ${key}`);
      }

      if ("choices" in config[key]) {
        const choices = config[key]["choices"];

        if (Array.isArray(choices) && choices.length > 0) {
          if (typeof parsedEnv[key] === typeof choices[0]) {
            if (choices && !choices.includes(parsedEnv[key])) {
              throw new Error(
                `Environment variable ${key} should be one of: ${choices.join(
                  ", "
                )}`
              );
            }
          } else {
            throw new Error(
              `Environment variable ${key} has an invalid type. Expected ${typeof choices[0]} but got ${typeof parsedEnv[
                key
              ]}.`
            );
          }
        }
      }
    }
  }

  return parsedEnv as Env<T>;
}
