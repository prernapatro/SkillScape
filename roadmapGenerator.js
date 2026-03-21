/**
 * Generates a step-by-step learning roadmap from a list of missing skills.
 * Ranks skills based on their frequency in your dataset and importance to the job description.
 * 
 * @param {string[]} missingSkills - Array of missing skills (e.g., from the skillMatcher).
 * @param {Object} skillData - Map of skill metrics representing frequency and importance.
 *   Example format: 
 *   {
 *     "aws": { frequency: 150, importance: 9 }, 
 *     "docker": { frequency: 80, importance: 6 } 
 *   }
 * @returns {string[]} Ordered list of skills to learn (from highest priority to lowest).
 */
function generateSkillRoadmap(missingSkills, skillData = {}) {
  const normalize = (skill) => skill.toLowerCase().trim();

  const rankedSkills = missingSkills.map(skill => {
    const normalizedSkill = normalize(skill);
    const data = skillData[normalizedSkill] || { frequency: 0, importance: 0 };
    
    // Calculate a priority score to rank the skills.
    // Formula: We multiply importance to give it a strong weight alongside the frequency count.
    // You can adjust this weight factor (e.g. 100) based on your dataset's frequency scale.
    const priorityScore = (data.importance * 100) + data.frequency;

    return {
      skill,
      priorityScore
    };
  });

  // Sort descending by priority score (highest score first)
  rankedSkills.sort((a, b) => b.priorityScore - a.priorityScore);

  // Output ONLY the ordered list of skills
  return rankedSkills.map(item => item.skill);
}

module.exports = {
  generateSkillRoadmap
};
