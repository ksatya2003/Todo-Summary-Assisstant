import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// GET all todos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST new todo
router.post('/', async (req, res) => {
const { task } = req.body; // expects 'task' field

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Todo text is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO todos (text, completed) VALUES ($1, $2) RETURNING *',
      [text.trim(), false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE todo by id
router.delete('/:id', async (req, res) => {
  const todoId = parseInt(req.params.id);
  if (isNaN(todoId)) {
    return res.status(400).json({ error: 'Invalid todo ID' });
  }

  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [todoId]);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
