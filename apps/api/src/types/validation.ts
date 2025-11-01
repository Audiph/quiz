export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
export type UnvalidatedInput = JsonValue | undefined;
