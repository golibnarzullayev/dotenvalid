export type EnvType = "string" | "number" | "boolean" | "json" | "url";

export type EnvSchema<
  T extends Record<
    string,
    { type?: EnvType; default?: any; optional?: boolean; choices?: any[] }
  >
> = {
  [K in keyof T]: T[K]["default"] extends undefined
    ? T[K]["optional"] extends true
      ? InferType<T[K]["type"]> | undefined
      : InferType<T[K]["type"]>
    : InferType<T[K]["type"]>;
};

export type InferType<T extends EnvType | undefined> = T extends "number"
  ? number
  : T extends "boolean"
  ? boolean
  : T extends "json"
  ? any
  : T extends "url"
  ? string
  : string;
