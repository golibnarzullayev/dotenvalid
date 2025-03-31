export type EnvType = "string" | "number" | "boolean" | "json" | "url";

export type EnvConfig<T = string> = {
  type?: EnvType;
  default?: T;
  optional?: boolean;
  choices?: readonly T[];
};

export type EnvSchema<T extends Record<string, EnvConfig>> = {
  [K in keyof T]: T[K]["choices"] extends readonly (infer U)[]
    ? U
    : T[K]["default"] extends undefined
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
  ? unknown
  : T extends "url"
  ? string
  : string;
