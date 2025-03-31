type EnvSchema = {
  [key: string]: {
    type?: "string" | "number" | "boolean" | "json" | "url";
    default?: any;
    optional?: boolean;
    choices?: any[];
  };
};

export function validateEnv(schema: EnvSchema) {
  const parsedEnv: Record<string, string | number | boolean> = {};

  for (const key in schema) {
    const config = schema[key];
    let value = process.env[key];

    const type = config.type || "string";

    if (value === undefined) {
      if (config.default !== undefined) {
        value = config.default;
      } else if (!config.optional) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }

    if (value !== undefined) {
      switch (config.type) {
        case "string":
          parsedEnv[key] = value; // String tipidagi qiymat
          break;
        case "number":
          const parsedNumber = Number(value);
          if (isNaN(parsedNumber)) {
            throw new Error(`Environment variable ${key} should be a number`);
          }
          parsedEnv[key] = parsedNumber;
          break;
        case "boolean":
          if (value !== "true" && value !== "false") {
            throw new Error(
              `Environment variable ${key} should be a boolean (true/false)`
            );
          }
          parsedEnv[key] = value === "true";
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
    }

    if (config.choices && !config.choices.includes(value)) {
      throw new Error(
        `Environment variable ${key} should be one of the following values: ${config.choices.join(
          ", "
        )}`
      );
    }
  }

  return parsedEnv;
}
