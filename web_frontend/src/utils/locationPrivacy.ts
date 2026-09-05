/**
 * Strict Location Privacy Helper
 * 
 * Extracts ONLY the primary service area / locality from full customer addresses
 * before an order is officially accepted by the customer.
 * 
 * Strictly hides:
 * - Door, flat, building, plot, survey, and room numbers (e.g., Flat 74, Door No. 42, Plot 18)
 * - Customer company and business establishment names (e.g., Venkateshwara Industries)
 * - Street, road, avenue, lane names (e.g., 5th Main Road, Trichy Road, High Street)
 * - Postal pincodes and state/country identifiers (e.g., 600032, Tamil Nadu, India)
 * - Exact GPS coordinates and navigation links
 */

export interface LocationPrivacyOptions {
  includeCity?: boolean;
}

export function getPrivacyArea(
  fullAddress: string | undefined | null,
  companyOrPosterName?: string,
  options: LocationPrivacyOptions = {}
): string {
  if (!fullAddress || !fullAddress.trim()) {
    return 'Service Area';
  }

  // 1. Remove 6-digit Indian pincode patterns (e.g. – 600032, - 600032, 600032, 600 032)
  let clean = fullAddress.replace(/[-–—]?\s*\b\d{3}\s*\d{3}\b/g, '').trim();

  // 2. Normalize company or poster name to lowercase tokens to prevent exposing company name as area
  const companyTokens = companyOrPosterName
    ? companyOrPosterName
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(
          (w) =>
            w.length > 2 &&
            !/^(industries|industry|works|private|pvt|ltd|limited|heavy|scrap|plant|enterprise|enterprises|traders|trading|metals|alloys|castings|tools|auto|cables|foundry)$/i.test(
              w
            )
        )
    : [];

  // 3. Known regions/cities
  const stateOrCountryPattern =
    /^(tamil nadu|tamilnadu|karnataka|kerala|andhra pradesh|telangana|maharashtra|india)$/i;
  const majorCitiesPattern =
    /^(chennai|coimbatore|madurai|tiruchirappalli|trichy|salem|tiruppur|bengaluru|bangalore|hyderabad|mumbai|delhi|pune)$/i;

  // 4. Door, building, and street patterns that MUST NOT be exposed as the area
  const doorPattern =
    /^(flat|door|no|d\.no|plot|survey|sy\.no|shop|shed|unit|gala|floor|block|phase|site|phase\s*\d+|shed\s*\d+|room)\b/i;
  const startsWithNumber = /^#?\d+/;
  const streetPattern =
    /\b(road|street|st\.|rd\.|avenue|ave|lane|salai|marg|sarani|bypass|byepass|cross|main road|high road|highway|circle)\b/i;
  const apartmentOrBuildingPattern =
    /\b(apartments|apartment|residency|towers|tower|enclave|heights|villa|complex|foundry|works|industries|pvt|ltd)\b/i;

  // 5. Split parts by comma and filter empty / state names
  const parts = clean
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !stateOrCountryPattern.test(p));

  if (parts.length === 0) return 'Service Area';
  if (parts.length === 1 && !startsWithNumber.test(parts[0]) && !doorPattern.test(parts[0])) {
    return parts[0].trim();
  }

  // 6. Separate city if present at the end
  let cityCandidate = '';
  const remainingParts: string[] = [];
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    if (majorCitiesPattern.test(p) && !cityCandidate) {
      cityCandidate = p;
    } else {
      remainingParts.unshift(p);
    }
  }

  if (remainingParts.length === 0) {
    return cityCandidate || 'Service Area';
  }

  // 7. Iterate candidates from right to left in remainingParts
  for (let i = remainingParts.length - 1; i >= 0; i--) {
    const rawPart = remainingParts[i];
    const lower = rawPart.toLowerCase();

    // Check if token matches company name
    const isCompany =
      companyTokens.length > 0 && companyTokens.some((t) => lower.includes(t));
    if (isCompany) continue;

    // Check if building number or door
    if (startsWithNumber.test(rawPart) || doorPattern.test(rawPart)) continue;

    // Check if apartment / company building
    if (apartmentOrBuildingPattern.test(rawPart)) continue;

    // Strip industrial suffixes (e.g., "Maraimalai Nagar Industrial Corridor" -> "Maraimalai Nagar")
    let candidate = rawPart
      .replace(
        /\s*(industrial estate|industrial corridor|industrial area|industrial bypass|sipcot|sidco)\s*/gi,
        ''
      )
      .replace(/[-–]/g, '')
      .trim();

    if (!candidate || candidate.length < 2) continue;

    // Check if pure street (e.g. "Trichy Road", "5th Main Road") without locality suffixes
    if (
      streetPattern.test(candidate) &&
      !/\b(nagar|colony|puram|pakkam|pet|pettai|palayam|ur|cherry)\b/i.test(candidate)
    ) {
      continue;
    }

    if (options.includeCity && cityCandidate) {
      return `${candidate}, ${cityCandidate}`;
    }
    return candidate;
  }

  // Fallback: search remaining parts for any clean text that isn't a door number
  for (let i = remainingParts.length - 1; i >= 0; i--) {
    const p = remainingParts[i];
    if (!startsWithNumber.test(p) && !doorPattern.test(p)) {
      const cleaned = p
        .replace(/\s*(industrial estate|industrial corridor|industrial area)\s*/gi, '')
        .trim();
      if (cleaned.length > 2) {
        if (options.includeCity && cityCandidate) {
          return `${cleaned}, ${cityCandidate}`;
        }
        return cleaned;
      }
    }
  }

  return cityCandidate || 'Service Area';
}
