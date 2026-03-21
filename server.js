 const dotenv = require("dotenv");
 dotenv.config();

 const app = require("./app");

 const PORT = process.env.PORT || 3001;

 app.listen(PORT, () => {
   // eslint-disable-next-line no-console
   console.log(`career-ai-backend listening on http://localhost:${PORT}`);
 });

