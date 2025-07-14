import OpenAI from "openai";
import langfuse from "./langfuse";
import {
  ResponseInput,
  ResponseInputMessageContentList,
} from "openai/resources/responses/responses";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "fake-key" });

export async function getAnswer(question: ResponseInputMessageContentList) {
  if (process.env.NODE_ENV === "test") {
    return `${question}: answer`;
  }

  const prompt = await langfuse.getPrompt("system_prompt");
  const compiledPrompt = prompt.compile();

  const trace = langfuse.trace({
    name: "question",
  });

  const messages: ResponseInput = [
    {
      role: "developer",
      content: compiledPrompt,
    },
    {
      role: "user",
      content: question,
    },
  ];

  const generation = trace.generation({
    name: "chat-completion",
    model: "gpt-4.1",
    input: messages,
  });

  const response = await client.responses.create({
    model: "gpt-4.1",
    input: messages,
  });

  generation.end({
    output: response,
  });

  return response.output_text;
}
