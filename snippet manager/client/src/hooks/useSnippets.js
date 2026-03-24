import { useEffect, useState } from 'react';
import * as snippetApi from '../api/snippetApi';

export function useSnippets(token) {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSnippets = async () => {
      if (!token) {
        setSnippets([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await snippetApi.fetchSnippets(token);
        setSnippets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSnippets();
  }, [token]);

  const createSnippet = async (snippet) => {
    if (!token) return;

    setError('');

    try {
      const created = await snippetApi.createSnippet(token, snippet);
      setSnippets((prev) => [created, ...prev]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSnippet = async (id) => {
    if (!token) return;

    setError('');

    try {
      await snippetApi.deleteSnippet(token, id);
      setSnippets((prev) => prev.filter((snippet) => snippet.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    snippets,
    loading,
    error,
    createSnippet,
    deleteSnippet
  };
}