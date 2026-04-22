import React, { useState, useEffect } from 'react';
import './App.css';

const API = 'http://localhost:3000';

// ─── Login Component ──────────────────────────────────────────────────────────
function Login({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Login failed');
      onLogin(data.token, data.user);
    } catch {
      setError('Could not connect to server');
    }
  };

  return (
    <div className="auth-container">
      <h1>Code Snippet Manager</h1>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p>No account? <button className="link-btn" onClick={switchToRegister}>Register</button></p>
    </div>
  );
}

// ─── Register Component ───────────────────────────────────────────────────────
function Register({ onLogin, switchToLogin }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Registration failed');
      onLogin(data.token, data.user);
    } catch {
      setError('Could not connect to server');
    }
  };

  return (
    <div className="auth-container">
      <h1>Code Snippet Manager</h1>
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })} required />
        <input type="email" placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button type="submit">Register</button>
      </form>
      <p>Have an account? <button className="link-btn" onClick={switchToLogin}>Login</button></p>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('login');
  const [snippets, setSnippets] = useState([]);
  const [newSnippet, setNewSnippet] = useState({
    title: '', description: '', code: '', language: 'javascript',
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch(`${API}/api/snippets`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setSnippets(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));
    }
  }, [token]);

  const handleLogin = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setSnippets([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/snippets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSnippet),
      });
      const data = await res.json();
      setSnippets([data, ...snippets]);
      setNewSnippet({ title: '', description: '', code: '', language: 'javascript' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/snippets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnippets(snippets.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    if (page === 'login')
      return <Login onLogin={handleLogin} switchToRegister={() => setPage('register')} />;
    return <Register onLogin={handleLogin} switchToLogin={() => setPage('login')} />;
  }

  return (
    <div className="App">
      <div className="header">
        <h1>Code Snippet Manager</h1>
        <div className="user-info">
          <span>Welcome, {user.username}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="form-container">
        <h2>Add New Snippet</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Title" value={newSnippet.title}
            onChange={e => setNewSnippet({ ...newSnippet, title: e.target.value })} required />
          <input type="text" placeholder="Description (optional)" value={newSnippet.description}
            onChange={e => setNewSnippet({ ...newSnippet, description: e.target.value })} />
          <select value={newSnippet.language}
            onChange={e => setNewSnippet({ ...newSnippet, language: e.target.value })}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="sql">SQL</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          <textarea placeholder="Paste your code here" value={newSnippet.code}
            onChange={e => setNewSnippet({ ...newSnippet, code: e.target.value })}
            rows={8} required />
          <button type="submit">Save Snippet</button>
        </form>
      </div>

      <div className="snippets-list">
        <h2>Your Snippets</h2>
        {snippets.length === 0 && <p>No snippets yet. Add one above!</p>}
        {snippets.map(snippet => (
          <div key={snippet.id} className="snippet-card">
            <div className="snippet-header">
              <h3>{snippet.title}</h3>
              <span className="language-badge">{snippet.language}</span>
            </div>
            {snippet.description && <p>{snippet.description}</p>}
            <pre><code>{snippet.code}</code></pre>
            <button className="delete-btn" onClick={() => handleDelete(snippet.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
