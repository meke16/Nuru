import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Logging middleware ---
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJson: any;
  const originalJson = res.json;

  res.json = function (bodyJson, ...args) {
    capturedJson = bodyJson;
    return originalJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJson) logLine += ` :: ${JSON.stringify(capturedJson)}`;
      console.log(logLine.length > 80 ? logLine.slice(0, 79) + "…" : logLine);
    }
  });
  next();
});

(async () => {
  const server = await registerRoutes(app); // register API routes

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server); // dev with Vite HMR
  } else {
    serveStatic(app); // serve client/dist in production
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0"; // required for Render

  server.listen({ port, host }, () => {
    console.log(`🚀 Server running at http://${host}:${port}`);
  });
})();
