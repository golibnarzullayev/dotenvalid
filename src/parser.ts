import * as fs from "fs";
import * as path from "path";

export function loadDotenv(filePath = ".env") {
  const envPath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(envPath)) return;

  const envData = fs.readFileSync(envPath, "utf-8");
  envData.split("\n").forEach((line) => {
    const [key, value] = line.split("=").map((part) => part.trim());
    if (key && value) {
      process.env[key] = value;
    }
  });
}
