 const dashboardService = require("../services/dashboardService");

 async function getDashboard(req, res) {
   try {
     const dashboard = await dashboardService.buildDashboard();
     res.json(dashboard);
   } catch (err) {
     // Let the app-level error handler format the response
     res.status(500).json({ error: "Failed to build dashboard" });
   }
 }

 module.exports = {
   getDashboard,
 };

