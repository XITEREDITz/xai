import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log("🚀 Starting ModCraftAI server...");
    console.log("🌍 Environment:", process.env.NODE_ENV || "development");
    console.log("🔌 Port:", process.env.PORT || "5000");
    console.log("🗺️ Database:", process.env.DATABASE_URL ? "Connected" : "❌ Missing");
    console.log("🤖 API Keys:", {
      Anthropic: process.env.ANTHROPIC_API_KEY ? "Set" : "Missing",
      OpenAI: process.env.OPENAI_API_KEY ? "Set" : "Missing", 
      Gemini: process.env.GEMINI_API_KEY ? "Set" : "Missing"
    });
    
    const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`🎉 ModCraftAI server running on port ${port}!`);
    console.log(`🌍 Visit: http://localhost:${port}`);
    log(`serving on port ${port}`);
  });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    console.error("🔧 Check Railway environment variables:");
    console.error("   - DATABASE_URL (add PostgreSQL database)");
    console.error("   - SESSION_SECRET");
    console.error("   - API keys for AI features");
    process.exit(1);
  }
})();
