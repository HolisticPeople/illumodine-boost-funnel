export type CountryDef = { code: string; name: string; requiresState?: boolean };

// Minimal but sensible default list. Keep in sync with the fasting kit funnel.
export const COUNTRIES: CountryDef[] = [
  { code: "US", name: "United States", requiresState: true },
  { code: "CA", name: "Canada", requiresState: true },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia", requiresState: true },
  { code: "NZ", name: "New Zealand" },
  { code: "IL", name: "Israel" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "IE", name: "Ireland" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "PT", name: "Portugal" },
  { code: "PL", name: "Poland" },
  { code: "MX", name: "Mexico", requiresState: true },
  { code: "BR", name: "Brazil", requiresState: true },
  { code: "AR", name: "Argentina" },
  { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "CN", name: "China", requiresState: true },
  { code: "IN", name: "India", requiresState: true },
  { code: "ZA", name: "South Africa", requiresState: true },
];

export function countryNameFor(code?: string): string {
  if (!code) return "";
  const c = COUNTRIES.find((x) => x.code === code.toUpperCase());
  return c ? c.name : "";
}

export function countryRequiresState(code?: string): boolean {
  if (!code) return false;
  const c = COUNTRIES.find((x) => x.code === code.toUpperCase());
  return !!c?.requiresState;
}


