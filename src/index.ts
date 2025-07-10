import express from "express";
import bot from "./bot";
import { webhookCallback } from "grammy";

if (process.env.NODE_ENV === "production") {
  const app = express(); // or whatever you're using
  app.use(express.json()); // parse the JSON request body

  app.use(
    webhookCallback(bot, "express", {
      secretToken: process.env.BOT_SECRET_TOKEN,
    }),
  );

  app.listen(8080);
} else {
  bot.start();
}
