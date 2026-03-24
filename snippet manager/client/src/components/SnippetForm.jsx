import { useState } from 'react';

const initialState = {
  title: '',
  description: '',
  code: '',
  language: 'javascript',
  isPublic: false
};

function SnippetForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(form);
      setForm(initialState);
    } catch {
      // error handled upstream
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Snippet</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          value={form.language}
          onChange={(e) => setForm({ ...form, language: e.target.value })}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="sql">SQL</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
          />
          Make this snippet public
        </label>

        <textarea
          placeholder="Paste your code here"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          rows={8}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Snippet'}
        </button>
      </form>
    </div>
  );
}

export default SnippetForm;