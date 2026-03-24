import './App.css';
import { useAuth } from './hooks/useAuth';
import { useSnippets } from './hooks/useSnippets';
import AuthPage from './pages/AuthPage';
import SnippetPage from './pages/SnippetPage';

function App() {
  const auth = useAuth();
  const snippets = useSnippets(auth.token);

  if (!auth.user) {
    return <AuthPage auth={auth} />;
  }

  return (
    <SnippetPage
      user={auth.user}
      onLogout={auth.logout}
      snippets={snippets.snippets}
      loading={snippets.loading}
      error={snippets.error}
      createSnippet={snippets.createSnippet}
      deleteSnippet={snippets.deleteSnippet}
    />
  );
}

export default App;