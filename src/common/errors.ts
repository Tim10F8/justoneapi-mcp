export function mapError(e: any): { code: number; message: string } {
  return { code: e?.code, message: e?.message ?? "Upstream error" };
}