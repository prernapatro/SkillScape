 const express = require("express");
 const cors = require("cors");
 const morgan = require("morgan");

 const routes = require("./routes");

 const app = express();

 // Body parsing
 app.use(express.json({ limit: "1mb" }));

 // Basic request logging
 app.use(morgan("dev"));

 // Allow frontend dev server to call the API
 const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
 app.use(
   cors({
     origin: corsOrigin,
   })
 );

 app.get("/", (req, res) => {
   res.json({ name: "career-ai-backend", status: "ok" });
 });

 app.use("/api", routes);

 // 404 handler
 app.use((req, res) => {
   res.status(404).json({ error: "Not found" });
 });

 // Error handler
 app.use((err, req, res, next) => {
   // eslint-disable-next-line no-console
   console.error(err);

  if (err && err.code === "LIMIT_FILE_SIZE") {
    const maxMb = process.env.UPLOAD_MAX_MB || "5";
    return res.status(413).json({
      error: `File too large. Max ${maxMb}MB per file.`,
    });
  }

  if (err && err.code === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      error: err.message || "Invalid file type.",
    });
  }

  // Express JSON body parsing errors
  if (
    err &&
    (err.type === "entity.parse.failed" ||
      (err instanceof SyntaxError && err.message && err.message.includes("JSON")))
  ) {
    return res.status(400).json({
      error: "Invalid JSON body",
      details: err.message || String(err),
    });
  }

  // In development, surface error details to help debugging.
  if (process.env.NODE_ENV !== "production") {
    return res.status(500).json({
      error: "Internal server error",
      details: err?.message || String(err),
    });
  }

   res.status(500).json({ error: "Internal server error" });
 });

 module.exports = app;

