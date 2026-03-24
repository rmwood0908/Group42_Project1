function SnippetCard({ snippet, onDelete }) {
  return (
    <div className="snippet-card">
      <div className="snippet-header">
        <h3>{snippet.title}</h3>

        <div className="snippet-meta">
          <span className="language-badge">{snippet.language}</span>
          {snippet.isPublic && <span className="public-badge">Public</span>}
        </div>
      </div>

      {snippet.description && <p>{snippet.description}</p>}

      <pre>
        <code>{snippet.code}</code>
      </pre>

      <button className="delete-btn" onClick={() => onDelete(snippet.id)}>
        Delete
      </button>
    </div>
  );
}

export default SnippetCard;