export interface CapacitorFloashPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
