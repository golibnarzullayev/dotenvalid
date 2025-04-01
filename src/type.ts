export type EnvTypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  json: any;
  url: string;
};

export type EnvSchemaType =
  | {
      type: "string";
      default?: string;
      optional?: boolean;
      choices?: readonly string[];
    }
  | {
      type: "number";
      default?: number;
      optional?: boolean;
      choices?: readonly number[];
    }
  | {
      type: "boolean";
      default?: boolean;
      optional?: boolean;
      choices?: readonly boolean[];
    }
  | {
      type: "json";
      default?: any;
      optional?: boolean;
    }
  | {
      type: "url";
      default?: string;
      optional?: boolean;
    };

export type Env<T extends Record<string, EnvSchemaType>> = {
  [K in keyof T]: "choices" extends keyof T[K]
    ? T[K]["choices"] extends readonly (infer U)[]
      ? U
      : never
    : T[K]["default"] extends undefined
    ? T[K]["optional"] extends true
      ? EnvTypeMap[T[K]["type"]] | undefined
      : EnvTypeMap[T[K]["type"]]
    : T[K]["default"] extends EnvTypeMap[T[K]["type"]]
    ? EnvTypeMap[T[K]["type"]]
    : never;
};
