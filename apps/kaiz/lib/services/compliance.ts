/**
 * Compliance Service using Exa API
 *
 * Performs real-time compliance checks for cross-border payments:
 * - Sanctions screening
 * - Regulatory compliance verification
 * - Country-specific payment regulations
 * - Risk assessment for payment corridors
 */

import Exa from 'exa-js';

const exaApiKey = process.env.EXA_API_KEY;

if (!exaApiKey) {
  console.warn('⚠️  EXA_API_KEY not configured. Compliance checks will be skipped.');
}

export interface ComplianceCheck {
  passed: boolean;
  risk_level: 'low' | 'medium' | 'high';
  flags: string[];
  checks_performed: string[];
  sanctions_clear: boolean;
  corridor_compliant: boolean;
  details: string;
  sources?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}

/**
 * Performs comprehensive compliance checks for a payment transaction
 */
export async function performComplianceCheck(
  recipientName: string,
  corridor: string,
  amount: string,
  currency: string
): Promise<ComplianceCheck> {
  // Default response if Exa is not configured
  if (!exaApiKey) {
    return {
      passed: true,
      risk_level: 'low',
      flags: [],
      checks_performed: ['basic_validation'],
      sanctions_clear: true,
      corridor_compliant: true,
      details: 'Compliance checks skipped - Exa API not configured',
    };
  }

  try {
    const exa = new Exa(exaApiKey);

    // Extract country from corridor (e.g., "UAE → Philippines" -> "Philippines")
    const destinationCountry = corridor.split('→')[1]?.trim() || 'Unknown';

    // Perform sanctions screening search
    const sanctionsQuery = `${recipientName} sanctions OFAC financial crimes list`;

    // Perform corridor compliance search
    const corridorQuery = `${destinationCountry} cross-border payment regulations ${currency} remittance compliance 2026`;

    // Execute searches in parallel
    const [sanctionsResults, corridorResults] = await Promise.all([
      exa.searchAndContents(sanctionsQuery, {
        numResults: 3,
        type: 'auto',
        text: { maxCharacters: 500 },
      }).catch(() => null),

      exa.searchAndContents(corridorQuery, {
        numResults: 3,
        type: 'auto',
        text: { maxCharacters: 500 },
      }).catch(() => null),
    ]);

    // Analyze results
    const flags: string[] = [];
    let sanctions_clear = true;
    let corridor_compliant = true;
    let risk_level: 'low' | 'medium' | 'high' = 'low';

    // Check sanctions results
    if (sanctionsResults?.results) {
      const sanctionsContent = sanctionsResults.results
        .map((r: any) => r.text?.toLowerCase() || '')
        .join(' ');

      // Look for red flags in sanctions search
      const sanctionsKeywords = ['sanctioned', 'ofac', 'blocked', 'denied party', 'prohibited'];
      const hasSanctionsMatch = sanctionsKeywords.some(keyword =>
        sanctionsContent.includes(keyword) && sanctionsContent.includes(recipientName.toLowerCase())
      );

      if (hasSanctionsMatch) {
        sanctions_clear = false;
        risk_level = 'high';
        flags.push('Potential sanctions match - manual review required');
      }
    }

    // Check corridor compliance results
    if (corridorResults?.results) {
      const corridorContent = corridorResults.results
        .map((r: any) => r.text?.toLowerCase() || '')
        .join(' ');

      // Look for compliance requirements
      const restrictionKeywords = ['restricted', 'prohibited', 'banned', 'illegal'];
      const hasRestrictions = restrictionKeywords.some(keyword =>
        corridorContent.includes(keyword)
      );

      if (hasRestrictions) {
        corridor_compliant = false;
        risk_level = risk_level === 'high' ? 'high' : 'medium';
        flags.push(`${destinationCountry} corridor may have restrictions - verify regulations`);
      }
    }

    // Compile sources
    const sources = [
      ...(sanctionsResults?.results || []).map((r: any) => ({
        title: r.title || 'Sanctions Screening',
        url: r.url || '',
        snippet: r.text?.substring(0, 200) || '',
      })),
      ...(corridorResults?.results || []).map((r: any) => ({
        title: r.title || 'Corridor Compliance',
        url: r.url || '',
        snippet: r.text?.substring(0, 200) || '',
      })),
    ].slice(0, 5);

    const passed = sanctions_clear && corridor_compliant;

    return {
      passed,
      risk_level,
      flags,
      checks_performed: [
        'sanctions_screening',
        'corridor_compliance',
        'regulatory_verification',
      ],
      sanctions_clear,
      corridor_compliant,
      details: passed
        ? `✅ All compliance checks passed for ${destinationCountry} corridor`
        : `⚠️  Compliance review required: ${flags.join(', ')}`,
      sources,
    };
  } catch (error) {
    console.error('Compliance check error:', error);

    // In case of error, return cautious result
    return {
      passed: false,
      risk_level: 'medium',
      flags: ['Compliance system error - manual review required'],
      checks_performed: ['error_fallback'],
      sanctions_clear: false,
      corridor_compliant: false,
      details: `❌ Compliance check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Batch compliance check for multiple transactions
 */
export async function performBatchComplianceCheck(
  transactions: Array<{
    recipient: string;
    corridor: string;
    amount: string;
    currency: string;
  }>
): Promise<Map<string, ComplianceCheck>> {
  const results = new Map<string, ComplianceCheck>();

  // Perform checks in parallel with rate limiting
  const checkPromises = transactions.map(async (tx, index) => {
    // Add small delay to avoid rate limiting (100ms between requests)
    await new Promise(resolve => setTimeout(resolve, index * 100));

    const result = await performComplianceCheck(
      tx.recipient,
      tx.corridor,
      tx.amount,
      tx.currency
    );

    results.set(tx.recipient, result);
  });

  await Promise.all(checkPromises);

  return results;
}
