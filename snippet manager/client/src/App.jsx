import React, { useState, useEffect } from 'react';
import Login from './assets/Login';
import Register from './assets/Register';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('login');
  const [snippets, setSnippets] = useState([]);
  const [newSnippet, setNewSnippet] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript'
  });

  // Check for saved login on load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch snippets when logged in
  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/api/snippets', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setSnippets(data))
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
      const response = await fetch('http://localhost:5000/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newSnippet, user_id: user.id })
      });
      const data = await response.json();
      setSnippets([data, ...snippets]);
      setNewSnippet({ title: '', description: '', code: '', language: 'javascript' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/snippets/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSnippets(snippets.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Show login/register if not logged in
  if (!user) {
    if (page === 'login') {
      return <Login onLogin={handleLogin} switchToRegister={() => setPage('register')} />;
    }
    return <Register onLogin={handleLogin} switchToLogin={() => setPage('login')} />;
  }

  // Main app view when logged in
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
          <input
            type="text"
            placeholder="Title"
            value={newSnippet.title}
            onChange={(e) => setNewSnippet({...newSnippet, title: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newSnippet.description}
            onChange={(e) => setNewSnippet({...newSnippet, description: e.target.value})}
          />
          <select
            value={newSnippet.language}
            onChange={(e) => setNewSnippet({...newSnippet, language: e.target.value})}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="sql">SQL</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          <textarea
            placeholder="Paste your code here"
            value={newSnippet.code}
            onChange={(e) => setNewSnippet({...newSnippet, code: e.target.value})}
            rows={8}
            required
          />
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