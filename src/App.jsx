import React, { useState, useEffect } from 'react';
import './app.css';
const API_URL = 'http://localhost:5000';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch todos' });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add a todo
  const addTodo = async (text) => {
  try {
    const res = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (res.ok) {
      fetchTodos(); // Refresh list
      
setMessage({ type: 'success', text: 'New Todo added!' });
          setTimeout(() => {
        setMessage(null);
      }, 5000);

    } else {
      console.error('Add failed:', data.error);
      alert(`Add failed: ${data.error}`);
    }
  } catch (err) {
    console.error('Add error:', err);
    alert('Add error: ' + err.message);
  }
};


  // Delete a todo
  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchTodos();
        setMessage({ type: 'success', text: 'Todo deleted!' });
          setTimeout(() => {
        setMessage(null);
      }, 5000);
      } else {
        setMessage({ type: 'error', text: 'Failed to delete todo' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete todo' });
    } finally {
      setLoading(false);
    }
  };
  const updateTodo = async (id, newText) => {
  try {
    const res = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText }),
    });

    const data = await res.json();
    if (res.ok) {
      fetchTodos();
      setMessage({ type: 'success', text: 'Todo updated!' });
    } else {
      setMessage({ type: 'error', text: data.error });
    }
  } catch (err) {
    setMessage({ type: 'error', text: 'Failed to update todo' });
  }
};


  // Summarize and send to Slack
  const summarizeTodos = async () => {
 
     // Step 1: Show success message immediately
  setMessage({ type: 'success', text: 'Summary sent to Slack successfully. You can also view the same summarized text below (please wait a moment)...' });
  try {
    const res = await fetch(`${API_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todos: todos.map(todo => todo.text).join('\n'),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage({ type: 'success', text: 'Summary: ' + data.summary });
     setTimeout(() => {
        setSummary(data.summary);
      }, 1000);
    } else {
      setMessage({ type: 'error', text: data.error || 'Something went wrong' });
    }
  } catch (error) {
    setMessage({ type: 'error', text: 'Failed to summarize todos' });
  }
};


  return (
    <div className="app-container">
      <h1>Todo Summary Assistant</h1>

      <TodoForm onAdd={addTodo} disabled={loading} />

      {todos.length === 0 ? (
        <p className="no-todos">No todos yet.</p>
      ) : (
        <TodoList
  todos={todos}
  onDelete={deleteTodo}
  onUpdate={updateTodo} // ✅ Add this line
  disabled={loading}
/>

      )}

      <button
        onClick={summarizeTodos}
        disabled={loading || todos.length === 0}
        className="summarize-button"
      >
        {loading ? 'Processing...' : 'Summarize & Send to Slack'}
      </button>

      {message && (
        <p className={`message ${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}

function TodoForm({ onAdd, disabled }) {
  const [text, setText] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        placeholder="Enter todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        className="todo-input"
      />
      <button type="submit" disabled={disabled} className="todo-button">
        Add
      </button>
    </form>
  );
}

function TodoList({ todos, onDelete, disabled, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleEditClick = (id, currentText) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const handleSaveClick = (id) => {
    if (!editingText.trim()) return;
    onUpdate(id, editingText.trim());
    setEditingId(null);
  };

  return (
    <ul className="todo-list">
      {todos.map(({ id, text }) => (
        <li key={id}>
          {editingId === id ? (
             <>
              <input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="todo-input"
              />
              <div className="button-group">
              <button
                onClick={() => handleSaveClick(id)}
                disabled={disabled}
                className="todo-edit-button"
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                disabled={disabled}
                className="todo-cancel-button"
              >
                Cancel
              </button>
              </div>
            </>
          ) : (
            <>
              {text}
              <div className="button-group">
              <button
                onClick={() => handleEditClick(id, text)}
                disabled={disabled}
                className="todo-edit-button"
              >
                Edit
              </button>
               <button
                onClick={() => onDelete(id)}
                disabled={disabled}
                className="todo-delete-button"
              >
                Delete
              </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
