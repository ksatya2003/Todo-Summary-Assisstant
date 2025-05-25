import React, { useEffect, useState } from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  summarizeTodos,
} from './serv/api';

export default function TodoSummaryAssistant() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const data = await getTodos();
    setTodos(data);
  };

  const handleAdd = async () => {
    if (!text.trim()) return;
    const newTodo = await addTodo(text);
    setTodos([...todos, newTodo]);
    setText('');
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleSummarize = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await summarizeTodos();
      setMessage(res.message || 'Summary sent!');
    } catch (err) {
      setMessage('Failed to summarize todos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Enter new todo"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Todo
        </button>
      </div>

      <ul className="mb-4">
        {todos.map((todo) => (
          <li key={todo.id} className="flex justify-between items-center mb-2 border p-2 rounded">
            <span>{todo.text}</span>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSummarize}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Summarizing...' : 'Summarize Pending Todos'}
      </button>

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
