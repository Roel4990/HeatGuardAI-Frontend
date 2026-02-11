export function clampInt(v: unknown, min: number, max: number) {
  const n = typeof v === "number" ? v : parseInt(String(v ?? "0"), 10);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export function formatKRW(n: number) {
  const safe = Number.isFinite(n) ? n : 0;
  return `₩${Math.round(safe).toLocaleString("ko-KR")}`;
}

export function extractDigits(s: string) {
  return (s ?? "").replace(/\D/g, "");
}

export function formatNumberWithComma(n: number) {
  return n.toLocaleString("ko-KR");
}

export function normalizeQtyText(raw: string) {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (!digits) return "0";
  const normalized = digits.replace(/^0+/, "");
  return normalized === "" ? "0" : normalized;
}
