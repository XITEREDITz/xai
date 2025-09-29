import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import { generateMinecraftCode as claudeGenerate, explainCode as claudeExplain, optimizeCode as claudeOptimize } from "./services/anthropic";
import { generateMinecraftCode as geminiGenerate, explainCode as geminiExplain, optimizeCode as geminiOptimize, generateCreativeIdeas } from "./services/gemini";
import { generateMinecraftCode as gptGenerate, explainCode as gptExplain, optimizeCode as gptOptimize, generateBukkitSpigotCode, generateForgeCode } from "./services/openai";
import { adsterraService } from "./services/adsterra";
import { insertUserSchema, insertProjectSchema, insertAiGenerationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed after registration" });
        }
        res.json({ user: { id: user.id, username: user.username, email: user.email, coins: user.coins } });
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user as any;
    res.json({ user: { id: user.id, username: user.username, email: user.email, coins: user.coins } });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = req.user as any;
    res.json({ user: { id: user.id, username: user.username, email: user.email, coins: user.coins } });
  });

  // User routes
  app.get("/api/user/coins", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = req.user as any;
    const updatedUser = await storage.getUser(user.id);
    res.json({ coins: updatedUser?.coins || 0 });
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = req.user as any;
    const projects = await storage.getUserProjects(user.id);
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = req.user as any;
      const projectData = insertProjectSchema.parse(req.body);
      
      const project = await storage.createProject({
        ...projectData,
        userId: user.id,
      });

      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const project = await storage.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = req.user as any;
    if (project.userId !== user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(project);
  });

  app.put("/api/projects/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const project = await storage.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = req.user as any;
    if (project.userId !== user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedProject = await storage.updateProject(req.params.id, req.body);
    res.json(updatedProject);
  });

  // AI Generation routes
  app.post("/api/ai/generate", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = req.user as any;
      const { prompt, aiModel, projectId, type, platform } = req.body;

      // Check if user is in trial period or has enough coins
      const currentUser = await storage.getUser(user.id);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const now = new Date();
      const isInTrial = currentUser.trialEndsAt && new Date(currentUser.trialEndsAt) > now;
      const isSubscribed = currentUser.paypalSubscriptionId;

      const coinCost = getCoinCost(aiModel, prompt.length);

      if (!isInTrial && !isSubscribed && currentUser.coins < coinCost) {
        return res.status(402).json({ 
          message: "Insufficient coins", 
          required: coinCost, 
          current: currentUser.coins 
        });
      }

      let generatedCode = '';
      
      try {
        switch (aiModel) {
          case 'claude':
            generatedCode = await claudeGenerate(prompt, type, platform);
            break;
          case 'gemini':
            generatedCode = await geminiGenerate(prompt, type, platform);
            break;
          case 'gpt':
            if (platform === 'bukkit' || platform === 'spigot') {
              generatedCode = await generateBukkitSpigotCode(prompt);
            } else if (platform === 'forge') {
              generatedCode = await generateForgeCode(prompt);
            } else {
              generatedCode = await gptGenerate(prompt, type, platform);
            }
            break;
          default:
            return res.status(400).json({ message: "Invalid AI model" });
        }
      } catch (error: any) {
        return res.status(500).json({ message: "AI generation failed: " + error.message });
      }

      // Deduct coins if not in trial and not subscribed
      if (!isInTrial && !isSubscribed) {
        await storage.updateUserCoins(user.id, currentUser.coins - coinCost);
      }

      // Save generation record
      await storage.createAiGeneration({
        userId: user.id,
        projectId: projectId || null,
        aiModel,
        prompt,
        response: generatedCode,
        coinsCost: coinCost,
      });

      res.json({ 
        code: generatedCode, 
        coinsCost: coinCost,
        remainingCoins: isInTrial || isSubscribed ? currentUser.coins : currentUser.coins - coinCost
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/explain", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { code, aiModel } = req.body;
      let explanation = '';

      switch (aiModel) {
        case 'claude':
          explanation = await claudeExplain(code);
          break;
        case 'gemini':
          explanation = await geminiExplain(code);
          break;
        case 'gpt':
          explanation = await gptExplain(code);
          break;
        default:
          return res.status(400).json({ message: "Invalid AI model" });
      }

      res.json({ explanation });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/optimize", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = req.user as any;
      const { code, aiModel } = req.body;

      // Check coins for optimization (premium feature)
      const currentUser = await storage.getUser(user.id);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const coinCost = 25; // Higher cost for optimization
      const now = new Date();
      const isInTrial = currentUser.trialEndsAt && new Date(currentUser.trialEndsAt) > now;
      const isSubscribed = currentUser.paypalSubscriptionId;

      if (!isInTrial && !isSubscribed && currentUser.coins < coinCost) {
        return res.status(402).json({ 
          message: "Insufficient coins for optimization", 
          required: coinCost, 
          current: currentUser.coins 
        });
      }

      let optimizedCode = '';

      switch (aiModel) {
        case 'claude':
          optimizedCode = await claudeOptimize(code);
          break;
        case 'gemini':
          optimizedCode = await geminiOptimize(code);
          break;
        case 'gpt':
          optimizedCode = await gptOptimize(code);
          break;
        default:
          return res.status(400).json({ message: "Invalid AI model" });
      }

      // Deduct coins if not in trial and not subscribed
      if (!isInTrial && !isSubscribed) {
        await storage.updateUserCoins(user.id, currentUser.coins - coinCost);
      }

      res.json({ 
        code: optimizedCode, 
        coinsCost: coinCost,
        remainingCoins: isInTrial || isSubscribed ? currentUser.coins : currentUser.coins - coinCost
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Template routes
  app.get("/api/templates", async (req, res) => {
    const templates = await storage.getTemplates();
    res.json(templates);
  });

  app.get("/api/templates/:id", async (req, res) => {
    const template = await storage.getTemplate(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json(template);
  });

  // Ad viewing routes
  app.post("/api/ads/view", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = req.user as any;
      const { adType, duration } = req.body;

      // Validate ad view
      if (!adsterraService.validateAdView(user.id, adType)) {
        return res.status(400).json({ message: "Invalid ad view" });
      }

      const coinsEarned = adsterraService.calculateCoinReward(adType, duration);
      
      // Update user coins
      const currentUser = await storage.getUser(user.id);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const newCoinBalance = currentUser.coins + coinsEarned;
      await storage.updateUserCoins(user.id, newCoinBalance);

      // Record ad view
      await storage.createAdView({
        userId: user.id,
        coinsEarned,
        adProvider: 'adsterra',
      });

      res.json({ 
        coinsEarned, 
        newBalance: newCoinBalance,
        message: `You earned ${coinsEarned} coins!`
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/ads/config", (req, res) => {
    const config = adsterraService.generateVideoAdConfig();
    res.json(config);
  });

  // PayPal payment routes (placeholder for PayPal integration)
  app.post("/api/create-paypal-order", async (req, res) => {
    try {
      // PayPal integration will be added here
      res.json({ message: "PayPal integration pending" });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating PayPal order: " + error.message });
    }
  });

  app.post('/api/paypal-subscription', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      // PayPal subscription logic will be added here
      res.json({ message: "PayPal subscription pending" });
    } catch (error: any) {
      return res.status(400).send({ error: { message: error.message } });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getCoinCost(aiModel: string, promptLength: number): number {
  const baseCost = {
    'claude': 20,
    'gemini': 15,
    'gpt': 18,
  }[aiModel] || 15;

  // Add cost based on prompt complexity
  const lengthMultiplier = Math.max(1, Math.floor(promptLength / 100));
  return baseCost + (lengthMultiplier * 5);
}
