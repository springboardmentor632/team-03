const eligibilityRepository = require("./eligibility.repository");

class EligibilityService {
  evaluateScheme(profile, scheme) {
    const rules = scheme.eligibilityRules || {};
    const reasons = [];
    const failures = [];
    let isEligible = true;

    // 1. Age check
    const age = Number(profile.age);
    if (age !== undefined && age !== null && !isNaN(age)) {
      if (rules.ageMin !== undefined && rules.ageMin !== null) {
        if (age < rules.ageMin) {
          isEligible = false;
          failures.push(`Minimum age required is ${rules.ageMin} years (your age: ${age})`);
        } else {
          reasons.push(`Meets minimum age limit of ${rules.ageMin} (your age: ${age})`);
        }
      }
      if (rules.ageMax !== undefined && rules.ageMax !== null) {
        if (age > rules.ageMax) {
          isEligible = false;
          failures.push(`Maximum age allowed is ${rules.ageMax} years (your age: ${age})`);
        } else {
          reasons.push(`Meets maximum age limit of ${rules.ageMax} (your age: ${age})`);
        }
      }
    }

    // 2. Gender check
    if (rules.gender && rules.gender !== "All") {
      if (profile.gender && profile.gender.toLowerCase() !== rules.gender.toLowerCase()) {
        isEligible = false;
        failures.push(`Only available for ${rules.gender} (your gender: ${profile.gender})`);
      } else {
        reasons.push(`Matches eligible gender criteria (${rules.gender})`);
      }
    }

    // 3. Income check
    const income = Number(profile.income);
    if (rules.incomeMax !== undefined && rules.incomeMax !== null) {
      if (income !== undefined && income !== null && !isNaN(income)) {
        if (income > rules.incomeMax) {
          isEligible = false;
          failures.push(`Annual income must be below ₹${rules.incomeMax} (your income: ₹${income})`);
        } else {
          reasons.push(`Income ₹${income} is within the threshold limit of ₹${rules.incomeMax}`);
        }
      } else {
        isEligible = false;
        failures.push(`Annual income threshold of ₹${rules.incomeMax} required (your income not specified)`);
      }
    }

    // 4. State check
    if (rules.state && rules.state !== "All" && rules.state.toLowerCase() !== "global") {
      if (!profile.state || profile.state.toLowerCase() !== rules.state.toLowerCase()) {
        isEligible = false;
        failures.push(`Only applicable to residents of ${rules.state} (your state: ${profile.state || "Not specified"})`);
      } else {
        reasons.push(`Matches state residency requirement (${rules.state})`);
      }
    }

    // 5. Category check
    if (rules.category && rules.category !== "All") {
      if (!profile.category || profile.category.toLowerCase() !== rules.category.toLowerCase()) {
        isEligible = false;
        failures.push(`Only available for ${rules.category} category (your category: ${profile.category || "Not specified"})`);
      } else {
        reasons.push(`Matches category criteria (${rules.category})`);
      }
    }

    // 6. Disability check
    if (rules.disabilityRequired) {
      if (!profile.disability) {
        isEligible = false;
        failures.push(`This scheme is reserved for persons with disabilities`);
      } else {
        reasons.push(`Matches disability status criteria`);
      }
    }

    // 7. Occupation check
    if (rules.occupation && rules.occupation !== "All") {
      if (!profile.occupation || profile.occupation.toLowerCase() !== rules.occupation.toLowerCase()) {
        isEligible = false;
        failures.push(`Reserved for occupation: ${rules.occupation} (your occupation: ${profile.occupation || "Not specified"})`);
      } else {
        reasons.push(`Matches occupation requirement (${rules.occupation})`);
      }
    }

    // 8. Education check
    if (rules.education && rules.education !== "All") {
      if (!profile.education || profile.education.toLowerCase() !== rules.education.toLowerCase()) {
        isEligible = false;
        failures.push(`Required education level: ${rules.education} (your level: ${profile.education || "Not specified"})`);
      } else {
        reasons.push(`Matches education requirement (${rules.education})`);
      }
    }

    return {
      schemeId: scheme._id,
      title: scheme.title,
      category: scheme.category,
      department: scheme.department,
      benefits: scheme.benefits,
      isEligible,
      reasons: reasons.length > 0 ? reasons : ["General eligibility matches"],
      failures,
    };
  }

  async checkEligibility(profile, userId = null) {
    const schemes = await eligibilityRepository.getApprovedSchemes();
    const results = schemes.map((scheme) => this.evaluateScheme(profile, scheme));

    await eligibilityRepository.saveLog({
      userId,
      profile,
      results: results.map((r) => ({ schemeId: r.schemeId, isEligible: r.isEligible })),
    }).catch(err => console.error("Failed to save eligibility log:", err));

    return results;
  }
}

module.exports = new EligibilityService();
