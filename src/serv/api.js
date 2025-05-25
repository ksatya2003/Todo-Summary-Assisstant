const API_URL = 'http://localhost:5000';

export const getTodos = async () => {
  const res = await fetch(`${API_URL}/todos`);
  return res.json();
};

export const addTodo = async (text) => {
  const res = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
};

export const deleteTodo = async (id) => {
  await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
};

export const summarizeTodos = async () => {
  const res = await fetch(`${API_URL}/summarize`, { method: 'POST' });
  return res.json();
};
