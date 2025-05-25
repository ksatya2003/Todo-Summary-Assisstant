import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { pool } from './db.js';
import { sendToSlack } from './services/slack.js';


import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});


const app = express();
app.use(express.json());
import cors from 'cors';
app.use(cors());


const PORT = 5000;
const USE_MOCK = process.env.USE_MOCK === 'true';

app.get('/', (req, res) => {
  res.send('✅ Todo Summary Server Running...');
});

// Get todos from PostgreSQL
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, text FROM todos ORDER BY id DESC'); // or your order
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});


// Add a new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Todo text is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO todos (text) VALUES ($1) RETURNING id, text',
      [text.trim()]
    );
    res.status(201).json(result.rows[0]); // returns the created todo
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: 'Failed to add todo' });
  }
});
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.post("/summarize", async (req, res) => {
  const { todos } = req.body;

  try {
    const cohereResponse = await cohere.generate({
      model: "command",
      prompt: `Summarize the following list of todos clearly and concisely:\n${todos}`,
      max_tokens: 150,
      temperature: 0.7,
    });

    if (
      cohereResponse &&
      cohereResponse.generations &&
      Array.isArray(cohereResponse.generations)
    ) {
      const summary = cohereResponse.generations[0].text.trim();
      console.log("Summary:", summary);

      // Send summary to Slack
      await sendToSlack(summary);

      res.json({ summary, message: "Summary sent to Slack successfully. You can see the summarized text below (wait a second)..." });
    } else {
      console.error("Cohere response does not contain generations");
      res.status(500).json({ error: "Failed to get valid summary from Cohere" });
    }
  } catch (error) {
    console.error("Cohere summarize error:", error);
    res.status(500).json({ error: "Something went wrong during summarization" });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
