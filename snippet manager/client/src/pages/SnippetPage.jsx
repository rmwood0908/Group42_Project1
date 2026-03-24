import SnippetForm from '../components/SnippetForm';
import SnippetList from '../components/SnippetList';

function SnippetPage({
  user,
  onLogout,
  snippets,
  loading,
  error,
  createSnippet,
  deleteSnippet
}) {
  return (
    <div className="App">
      <div className="header">
        <h1>Code Snippet Manager</h1>
        <div className="user-info">
          <span>Welcome, {user.username}!</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <SnippetForm onSubmit={createSnippet} />

      {error && <p className="error">{error}</p>}

      <SnippetList
        snippets={snippets}
        loading={loading}
        onDelete={deleteSnippet}
      />
    </div>
  );
}

export default SnippetPage;