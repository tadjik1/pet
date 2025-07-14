import "dotenv/config";
import { Bot } from "grammy";
import { getAnswer } from "./openai";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("start", (ctx) => {
  ctx.reply("Welcome! Up and running.");
});
bot.on("message", async (ctx) => {
  if (!ctx.message.text) {
    ctx.reply("Пожалуйста, пришлите текст.");
    return;
  }

  ctx.replyWithChatAction("typing");

  const response = await getAnswer(ctx.message.text);
  ctx.reply(response);
});

export default bot;
