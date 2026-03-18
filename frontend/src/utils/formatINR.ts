// ─── FORMAT INR ──────────────────────────────────────────────────────────────

/** Short format: ₹1.23 Cr / ₹4.56 L / ₹78.9K / ₹890 */
export const formatINR = (n: number): string => {
  if (!isFinite(n)) return "₹0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)} L`;
  if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(1)}K`;
  return `${sign}₹${Math.round(abs).toLocaleString("en-IN")}`;
};

/** Full format: ₹12,34,567 */
export const formatINRFull = (n: number): string => {
  if (!isFinite(n)) return "₹0";
  return `₹${Math.round(Math.abs(n)).toLocaleString("en-IN")}`;
};

/** Format with decimals: ₹1,23,456.78 */
export const formatINRDecimal = (n: number, decimals = 2): string => {
  if (!isFinite(n)) return "₹0";
  return `₹${Math.abs(n).toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

/** Format percentage: 12.34% */
export const formatPct = (n: number, decimals = 1): string =>
  `${n.toFixed(decimals)}%`;

/** Format a large number without ₹ symbol, with Indian number system commas */
export const formatNumber = (n: number): string =>
  Math.round(n).toLocaleString("en-IN");