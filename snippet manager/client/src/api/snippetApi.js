const BASE_URL = 'http://localhost:5000/api/snippets';

export async function fetchSnippets(token) {
  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch snippets');
  }

  return data;
}

export async function createSnippet(token, snippet) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(snippet)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create snippet');
  }

  return data;
}

export async function deleteSnippet(token, id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete snippet');
  }

  return data;
}

export async function updateSnippet(token, id, snippet) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(snippet)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update snippet');
  }

  return data;
}