export type ScenarioName = 'empty' | 'minimal' | 'full' | string;

/** LocalStorage entries to seed: key (with the `dopatime:` prefix) -> JSON-serializable value. */
export interface AppData {
  [storageKey: string]: unknown;
}
