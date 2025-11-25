import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";
import path from "path";
import type { Server } from "http";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

const app = express();
setupAuth(app);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const pathUrl = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathUrl.startsWith("/api")) {
      let logLine = `${req.method} ${pathUrl} ${res.statusCode} in ${duration}ms`;
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

export async function setupApp() {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  return { app, server };
}

export async function startServer() {
  const { app, server } = await setupApp();
  const PORT = Number(process.env.PORT) || 5000;

  if (app.get("env") === "development") {
    await setupVite(app, server);
    server.listen(PORT, "0.0.0.0", () => {
      log(`serving on http://0.0.0.0:${PORT}`);
    });
  } else {
    serveStatic(app);

    const publicPath = path.resolve(process.cwd(), "dist/public");
    app.get("*", (_req, res) => {
      res.sendFile(path.join(publicPath, "index.html"));
    });

    server.listen(PORT, "0.0.0.0", () => {
      log(`serving locally on port ${PORT}`);
    });
  }

  return server;
}

// Check if this module is being run directly (works on both Windows and Unix)
const normalizedMetaUrl = import.meta.url.replace(/\\/g, '/');
const normalizedArgv = `file:///${process.argv[1].replace(/\\/g, '/')}`;

if (normalizedMetaUrl === normalizedArgv || import.meta.url.endsWith('server/index.ts')) {
  startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default app;
