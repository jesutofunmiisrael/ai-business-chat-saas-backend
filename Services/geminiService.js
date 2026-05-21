const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",

  apiKey: process.env.GROQ_API_KEY,
});

const generateAIResponse = async (
  workspace,
  message
) => {
  try {
    const systemPrompt = `
You are an AI assistant for ${
      workspace.businessName
    }.

Business Type:
${workspace.businessType}

Business Description:
${workspace.businessDescription}

Tone:
${workspace.tone}

Your job is to:
- Help customers
- Answer questions professionally
- Be friendly and helpful
- Keep responses short and clear
`;

    const completion =
      await client.chat.completions.create({
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },

          {
            role: "user",
            content: message,
          },
        ],
      });

    return completion.choices[0].message.content;
  } catch (error) {
    console.log(error);

    return "AI response failed";
  }
};

module.exports = {
  generateAIResponse,
};