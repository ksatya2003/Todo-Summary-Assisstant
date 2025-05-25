import 'dotenv/config';

const USE_MOCK = process.env.USE_MOCK === 'true';

let openai = null;

if (!USE_MOCK) {
  const OpenAI = (await import('openai')).default;
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  // 🧪 Mock object for testing
  openai = {
    chat: {
      completions: {
        create: async ({ messages }) => {
          const userPrompt = messages.find(msg => msg.role === 'user')?.content || '';
          const lines = userPrompt.split('\n').filter(line => line.trim().length > 0);
          return {
            choices: [
              {
                message: {
                  content: `🧪 Mock Summary: You have ${lines.length} todos. Top items: ${lines.slice(0, lines.length).join(' ,')}`,
                },
              },
            ],
          };
        },
      },
    },
  };
}

export { openai };
