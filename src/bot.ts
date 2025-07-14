import "dotenv/config";
import { Bot } from "grammy";
import { getAnswer } from "./openai";
import { ResponseInputMessageContentList } from "openai/resources/responses/responses";

const BOT_TOKEN = process.env.BOT_TOKEN as string;

const bot = new Bot(BOT_TOKEN);

bot.command("start", (ctx) => {
  ctx.reply("Welcome! Up and running.");
});
bot.on("message", async (ctx) => {
  if (!ctx.message.text && !ctx.message.caption) {
    ctx.reply("Пожалуйста, пришлите текст.");
    return;
  }

  ctx.replyWithChatAction("typing");

  const input: ResponseInputMessageContentList = [
    {
      type: "input_text",
      text: (ctx.message.text || ctx.message.caption) as string,
    },
  ];

  if (ctx.message.photo) {
    const file = await ctx.getFile();
    input.push({
      type: "input_image",
      detail: "low",
      image_url: `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`,
    });
  }

  const response = await getAnswer(input);
  ctx.reply(response);
});

export default bot;
