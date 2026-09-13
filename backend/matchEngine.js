// matchEngine.js
// Core eligibility-matching logic shared by every route.
// Kept as plain, explainable rules (no black-box ML) so it can be
// demoed and explained line-by-line in a viva/presentation.

function isEligible(scheme, profile) {
  const e = scheme.eligibility;
  const reasons = [];
  const failReasons = [];

  // Category check (e.g. SC / ST / OBC / General / EWS)
  const categoryOk = e.categories.includes("Any") || e.categories.includes(profile.category);
  if (categoryOk) {
    reasons.push(`Category "${profile.category}" is eligible`);
  } else {
    failReasons.push(`Requires category: ${e.categories.join(", ")}`);
  }

  // Gender check (some schemes are Female-only, or Any)
  const genderOk = e.gender === "Any" || e.gender === profile.gender;
  if (genderOk) {
    if (e.gender !== "Any") reasons.push(`Open to ${e.gender} applicants`);
  } else {
    failReasons.push(`Restricted to ${e.gender} applicants`);
  }

  // Age check
  const ageOk = profile.age >= e.minAge && profile.age <= e.maxAge;
  if (ageOk) {
    reasons.push(`Age ${profile.age} is within ${e.minAge}-${e.maxAge} range`);
  } else {
    failReasons.push(`Age must be between ${e.minAge} and ${e.maxAge}`);
  }

  // Income check
  let incomeOk = true;
  if (e.maxAnnualIncome !== null && e.maxAnnualIncome !== undefined) {
    incomeOk = profile.annualIncome <= e.maxAnnualIncome;
    if (incomeOk) {
      reasons.push(`Annual income within Rs. ${e.maxAnnualIncome.toLocaleString("en-IN")} limit`);
    } else {
      failReasons.push(`Annual income must be at or below Rs. ${e.maxAnnualIncome.toLocaleString("en-IN")}`);
    }
  }

  // Business type check
  const businessOk = e.businessTypes.includes("Any") || e.businessTypes.includes(profile.businessType);
  if (businessOk) {
    reasons.push(`Business type "${profile.businessType}" is supported`);
  } else {
    failReasons.push(`Requires business type: ${e.businessTypes.join(", ")}`);
  }

  // Disability requirement
  let disabilityOk = true;
  if (e.requiresDisability) {
    disabilityOk = !!profile.hasDisability;
    if (disabilityOk) {
      reasons.push("Persons with disabilities are eligible");
    } else {
      failReasons.push("Scheme is exclusively for persons with disabilities");
    }
  }

  // Minority requirement
  let minorityOk = true;
  if (e.requiresMinority) {
    minorityOk = !!profile.isMinority;
    if (minorityOk) {
      reasons.push("Minority community applicants are eligible");
    } else {
      failReasons.push("Scheme is exclusively for notified minority communities");
    }
  }

  // State check
  const stateOk = e.states.includes("Any") || e.states.includes(profile.state);
  if (stateOk) {
    if (!e.states.includes("Any")) reasons.push(`Available in ${profile.state}`);
  } else {
    failReasons.push(`Only available in: ${e.states.join(", ")}`);
  }

  const eligible =
    categoryOk && genderOk && ageOk && incomeOk && businessOk && disabilityOk && minorityOk && stateOk;

  return { eligible, reasons, failReasons };
}

function matchSchemes(schemes, profile) {
  const results = schemes.map((scheme) => {
    const { eligible, reasons, failReasons } = isEligible(scheme, profile);
    return {
      id: scheme.id,
      name: scheme.name,
      ministry: scheme.ministry,
      description: scheme.description,
      benefits: scheme.benefits,
      applyLink: scheme.applyLink,
      eligible,
      matchScore: reasons.length, // simple, explainable "how many criteria matched"
      reasons,
      failReasons
    };
  });

  const eligibleSchemes = results
    .filter((r) => r.eligible)
    .sort((a, b) => b.matchScore - a.matchScore);

  const notEligibleSchemes = results.filter((r) => !r.eligible);

  return { eligibleSchemes, notEligibleSchemes };
}

module.exports = { isEligible, matchSchemes };
