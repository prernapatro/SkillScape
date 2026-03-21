/**
 * Compares a user's skills against job description skills.
 * 
 * @param {string[]} userSkills - Array of skills the user possesses.
 * @param {string[]} jobDescriptionSkills - Array of skills required by the job.
 * @returns {Object} An object containing the match percentage, missing skills, and strong areas.
 */
function compareSkills(userSkills, jobDescriptionSkills) {
  if (!Array.isArray(userSkills) || !Array.isArray(jobDescriptionSkills)) {
    throw new Error('Both userSkills and jobDescriptionSkills must be arrays.');
  }

  // Normalize skills to lowercase and trim whitespace to ensure accurate matching
  const normalizeSkill = (skill) => typeof skill === 'string' ? skill.toLowerCase().trim() : '';
  
  const normalizedUserSkills = new Set(userSkills.map(normalizeSkill).filter(Boolean));
  const normalizedJDSkills = new Set(jobDescriptionSkills.map(normalizeSkill).filter(Boolean));
  
  // Find matched skills (these act as the user's strong areas relevant to the JD)
  const matchedSkills = [...normalizedJDSkills].filter(skill => normalizedUserSkills.has(skill));
  
  // Find missing skills (JD skills that the user doesn't have)
  const missingSkills = [...normalizedJDSkills].filter(skill => !normalizedUserSkills.has(skill));
  
  // Calculate Match % = (matched skills / required skills) * 100
  const totalRequired = normalizedJDSkills.size;
  const matchPercentage = totalRequired === 0 
    ? 100 // Default to 100% if the job description has no specific skills required
    : Math.round((matchedSkills.length / totalRequired) * 100);
    
  return {
    matchPercentage,
    missingSkills,
    strongAreas: matchedSkills
  };
}

module.exports = {
  compareSkills
};
