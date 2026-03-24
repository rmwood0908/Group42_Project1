import SnippetCard from './SnippetCard';

function SnippetList({ snippets, loading, onDelete }) {
  return (
    <div className="snippets-list">
      <h2>Your Snippets</h2>

      {loading && <p>Loading snippets...</p>}
      {!loading && snippets.length === 0 && <p>No snippets yet. Add one above!</p>}

      {snippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default SnippetList;