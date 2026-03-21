 const candidateDatasetService = require("../services/candidateDatasetService");
 const profileMatchingService = require("../services/profileMatchingService");

 async function getJobRolesAndSkills(req, res) {
   const limitRoles = Number(req.query.limitRoles || "10");
   const limitSkillsPerRole = Number(req.query.limitSkillsPerRole || "8");

   try {
     const data = await candidateDatasetService.getJobRolesAndSkills({
       limitRoles,
       limitSkillsPerRole,
     });
     res.json(data);
   } catch (e) {
     // eslint-disable-next-line no-console
     console.error(e);
     res.status(500).json({ error: "Failed to load dataset roles/skills" });
   }
 }

 async function compareUserSkills(req, res) {
   const body = req.body || {};
   const skills = body.skills;
   const topK = Number(body.topK || 5);

   if (!Array.isArray(skills)) {
     return res.status(400).json({ error: "Request body must include `skills: string[]`." });
   }

   try {
     const result = await profileMatchingService.compareUserSkillsToCandidates({
       skills,
       topK: Number.isFinite(topK) ? topK : 5,
     });
     res.json(result);
   } catch (e) {
     // eslint-disable-next-line no-console
     console.error(e);
     res
       .status(500)
       .json({ error: "Failed to compare user skills", details: e?.message || String(e) });
   }
 }

 module.exports = {
   getJobRolesAndSkills,
   compareUserSkills,
 };

