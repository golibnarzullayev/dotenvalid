import { loadDotenv } from "./parser";
import { validateEnv } from "./validator";

export function loadEnv(schema: Parameters<typeof validateEnv>[0]) {
  loadDotenv();
  return validateEnv(schema);
}
