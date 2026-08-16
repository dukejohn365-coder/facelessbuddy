import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import { v } from "convex/values";

const app = defineApp({
  env: {
    YOUTUBE_API_KEY: v.string(),
  },
});

app.use(betterAuth);

export default app;
