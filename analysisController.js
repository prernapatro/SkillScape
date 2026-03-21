/* backend/controllers/analysisController.js */
const { rewriteResume: rewriteService } = require('../services/resumeRewriter');

// Universal Skill & Role Dictionary designed to support non-tech roles natively
const KNOWLEDGE_BASE = {
  roles: {
    "Security Guard": {
      family: "Security",
      skills: ["Surveillance", "Patrol", "Access Control", "Incident Reporting", "Public Safety", "Monitoring", "Emergency Response", "Conflict Resolution", "Crowd Management"],
      trajectory: ["Security Guard", "Senior Security Guard", "Security Supervisor", "Facility Security Manager"]
    },
    "CCTV Operator": {
      family: "Security",
      skills: ["CCTV Monitoring", "Video Surveillance", "Incident Reporting", "Attention to Detail", "Communication", "Equipment Maintenance"],
      trajectory: ["CCTV Operator", "Senior CCTV Operator", "Surveillance Supervisor", "Security Operations Center Manager"]
    },
    "Facility Security Officer": {
      family: "Security",
      skills: ["Access Control", "Facility Audits", "Physical Security", "Emergency Response", "Team Leadership", "Risk Assessment"],
      trajectory: ["Security Guard", "Facility Security Officer", "Security Director"]
    },
    "Cashier": {
      family: "Retail",
      skills: ["POS Systems", "Cash Handling", "Customer Service", "Billing", "Inventory Checkout", "Communication"],
      trajectory: ["Cashier", "Head Cashier", "Store Supervisor", "Store Manager"]
    },
    "Store Associate": {
      family: "Retail",
      skills: ["Customer Service", "Inventory Management", "Merchandising", "Sales", "Cash Handling"],
      trajectory: ["Store Associate", "Team Lead", "Store Supervisor"]
    },
    "Teacher": {
      family: "Education",
      skills: ["Lesson Planning", "Classroom Management", "Curriculum Development", "Student Assessment", "Communication", "Instruction"],
      trajectory: ["Teacher", "Senior Teacher", "Department Head", "Vice Principal", "Principal"]
    },
    "Frontend Developer": {
      family: "Software",
      skills: ["JavaScript", "React", "TypeScript", "HTML", "CSS", "Frontend Architecture", "Git", "Debugging", "Testing"],
      trajectory: ["Junior Frontend Developer", "Frontend Developer", "Senior Frontend Developer", "Frontend Lead"]
    },
    "Backend Developer": {
      family: "Software",
      skills: ["Node.js", "Express", "API Design", "Rest API", "SQL", "MongoDB", "Data Structures", "Algorithms", "System Design"],
      trajectory: ["Junior Backend Developer", "Backend Developer", "Senior Backend Developer", "Software Architect"]
    },
    "Full Stack Developer": {
      family: "Software",
      skills: ["JavaScript", "React", "Node.js", "Express", "SQL", "MongoDB", "API Design", "System Design", "Git", "Testing"],
      trajectory: ["Junior Engineer", "Full Stack Developer", "Senior Full Stack Engineer", "Engineering Manager"]
    },
    "Software Engineer": {
      family: "Software",
      skills: ["Data Structures", "Algorithms", "OOP", "System Design", "Python", "Java", "C++", "Git", "Testing", "Javascript"],
      trajectory: ["Junior Software Engineer", "Software Engineer", "Senior Software Engineer", "Tech Lead"]
    }
  },
  synonyms: {
    "cctv": "CCTV Monitoring",
    "patrolling": "Patrol",
    "surveillance": "Surveillance",
    "incident reporting": "Incident Reporting",
    "access control": "Access Control",
    "crowd handling": "Crowd Management",
    "security operations": "Security Operations",
    "customer dealing": "Customer Service",
    "ms excel": "Excel",
    "js": "JavaScript",
    "ts": "TypeScript",
    "reactjs": "React",
    "react.js": "React",
    "node": "Node.js",
    "nodejs": "Node.js",
    "rest": "Rest API",
    "api": "API Design",
    "dsa": "Data Structures",
    "frontend": "Frontend Architecture",
    "backend": "System Design",
    "full stack": "System Design",
    "guarding": "Patrol",
    "java": "Java",
    "python": "Python",
    "c++": "C++",
    "mysql": "SQL",
    "algorithms": "Algorithms",
    "oop": "OOP",
    "github": "Git",
    "testing": "Testing",
    "debugging": "Debugging"
  }
};

function normalizeText(text) {
  return text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");
}

function extractSkills(parsedText) {
  const normalized = normalizeText(parsedText);
  let foundSkills = new Set();
  
  Object.keys(KNOWLEDGE_BASE.synonyms).forEach(syn => {
    if (normalized.includes(" " + syn + " ") || normalized.startsWith(syn + " ") || normalized.endsWith(" " + syn)) {
      foundSkills.add(KNOWLEDGE_BASE.synonyms[syn]);
    }
  });

  Object.values(KNOWLEDGE_BASE.roles).forEach(role => {
    role.skills.forEach(skill => {
      if (normalized.includes(skill.toLowerCase())) {
        foundSkills.add(skill);
      }
    });
  });
  
  return Array.from(foundSkills);
}

function analyzeProfile(req, res) {
  const { parsedText, targetRoleInput, currentRoleInput, timeline } = req.body;
  if (!parsedText) return res.status(400).json({ success: false, error: "Missing parsedText" });

  const userSkills = extractSkills(parsedText);
  
  // 1. Infer Role Family purely from parsed resume
  const familyScores = {};
  for (const [roleName, roleData] of Object.entries(KNOWLEDGE_BASE.roles)) {
    let matchCount = 0;
    roleData.skills.forEach(reqSkill => { if (userSkills.includes(reqSkill)) matchCount++; });
    const textNorm = normalizeText(parsedText);
    if (textNorm.includes(roleName.toLowerCase())) matchCount += 2;
    
    if (!familyScores[roleData.family]) familyScores[roleData.family] = 0;
    familyScores[roleData.family] += matchCount;
  }
  
  let inferredRoleFamily = "Software"; // safe backup
  let maxFamilyScore = -1;
  for (const [family, score] of Object.entries(familyScores)) {
    if (score > maxFamilyScore) {
      maxFamilyScore = score;
      inferredRoleFamily = family;
    }
  }

  // 2. Identify targetRoleFamily
  let explicitTargetRole = null;
  let targetRoleFamily = null;
  if (targetRoleInput) {
    for (const [rName, rData] of Object.entries(KNOWLEDGE_BASE.roles)) {
      if (rName.toLowerCase() === targetRoleInput.toLowerCase().trim()) {
        explicitTargetRole = rName;
        targetRoleFamily = rData.family;
        break;
      }
    }
  }

  const allowedFamilies = targetRoleFamily ? [targetRoleFamily] : [inferredRoleFamily];

  // 3. Score roles strictly within allowed families
  let roleScores = [];
  let closestRoleName = null;
  let maxScore = -1;

  for (const [roleName, roleData] of Object.entries(KNOWLEDGE_BASE.roles)) {
    if (!allowedFamilies.includes(roleData.family)) continue; // PREVENT CONTAMINATION

    let matchCount = 0;
    roleData.skills.forEach(reqSkill => { if (userSkills.includes(reqSkill)) matchCount++; });
    let score = roleData.skills.length > 0 ? (matchCount / roleData.skills.length) * 100 : 0;
    
    const textNorm = normalizeText(parsedText);
    if (textNorm.includes(roleName.toLowerCase())) score += 20;

    if (explicitTargetRole && roleName === explicitTargetRole) {
      score += 500; // Force to the top target priorities
    }

    roleScores.push({ role: roleName, score, family: roleData.family });
    
    if (score > maxScore) {
      maxScore = score;
      closestRoleName = roleName;
    }
  }

  roleScores.sort((a, b) => b.score - a.score);
  if (!closestRoleName && roleScores.length > 0) closestRoleName = roleScores[0].role;
  
  const targetRole = closestRoleName; // dynamically assigned if none forced
  const targetRoleData = KNOWLEDGE_BASE.roles[targetRole];
  
  const requiredSkills = targetRoleData?.skills || [];
  const matchedSkills = userSkills.filter(s => requiredSkills.includes(s));
  const missingSkills = requiredSkills.filter(s => !userSkills.includes(s));
  
  const matchPercentage = requiredSkills.length === 0 ? 100 : Math.round((matchedSkills.length / requiredSkills.length) * 100);

  // Strengths
  const strengthsSet = new Set([...matchedSkills, ...userSkills]);
  const strengths = Array.from(strengthsSet).slice(0, 6);

  // Recommended roles
  const recommendedRoles = roleScores.slice(0, 3).map(r => ({ role: r.role, score: Math.round(r.score > 100 ? 98 : r.score) }));

  // Career trajectory
  const careerTrajectory = {
    startRole: targetRole,
    path: targetRoleData?.trajectory || [targetRole]
  };

  // Roadmap pacing logic based on explicitly requested user timeline
  const roadmap = missingSkills.map((skill, index) => {
    let priority = "Medium";
    if (timeline === "3 months") {
      priority = index < 3 ? "High!" : "Skip"; // highly aggressive
    } else if (timeline === "1 year" || timeline === "2 years") {
      priority = index < 2 ? "Core" : "Future Phase";
    } else {
      priority = index < 2 ? "High" : (index < 4 ? "Medium" : "Low");
    }
    return { step: index + 1, skill, priority };
  }).filter(item => item.priority !== "Skip");

  return res.json({
    success: true,
    
    // Debug variables strictly requested
    inferredRoleFamily,
    targetRole,
    targetRoleFamily,
    filteredRoleFamiliesUsed: allowedFamilies,
    topScoredRolesBeforeFinalReturn: roleScores.map(r => r.role),
    
    // Core payload
    roleFamily: targetRoleData?.family || inferredRoleFamily,
    closestRole: targetRole,
    userSkills,
    matchedSkills,
    missingSkills,
    strengths,
    matchPercentage: matchPercentage > 100 ? 100 : matchPercentage,
    recommendedRoles,
    careerTrajectory,
    roadmap,
    topSkillGaps: missingSkills
  });
}

function generateRoadmap(req, res) {
  // Dynamic via timeline input
  const { missingSkills, timeline } = req.body;
  if (!missingSkills || !Array.isArray(missingSkills)) return res.status(400).json({ success: false, error: "missingSkills array required" });
  
  const roadmap = missingSkills.map((skill, index) => {
    let priority = "Medium";
    if (timeline === "3 months") {
      priority = index < 3 ? "High!" : "Skip";
    } else if (timeline === "1 year" || timeline === "2 years") {
      priority = index < 2 ? "Core" : "Future Phase";
    } else {
      priority = index < 2 ? "High" : (index < 4 ? "Medium" : "Low");
    }
    return { step: index + 1, skill, priority };
  }).filter(item => item.priority !== "Skip");

  return res.json({ success: true, roadmap });
}

function rewriteResume(req, res) {
  const { parsedText, targetRole } = req.body;
  if (!parsedText) return res.status(400).json({ success: false, error: "Missing parsedText" });

  let result;
  try {
    const mockParsedJSON = { summary: "Professional Summary.", experience: [{ description: parsedText.substring(0, 300) + "..." }], education: [], skills: [] };
    result = rewriteService(mockParsedJSON, targetRole || "General");
  } catch(e) {
    result = { optimizedResume: { summary: "Rewrite failed due to error.", experience: [], skills: [] } };
  }

  const rewrittenText = `✨ PROFESSIONAL SUMMARY\n${result.optimizedResume.summary}\n\n🏆 OPTIMIZED EXPERIENCE\n${result.optimizedResume.experience.map(e => "• " + e.description).join('\n')}\n\n🏷️ ENHANCED SKILLS\n${result.optimizedResume.skills.join(', ')}`;

  return res.json({ success: true, rewrittenResume: rewrittenText });
}

module.exports = { analyzeProfile, generateRoadmap, rewriteResume };
