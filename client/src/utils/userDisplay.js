/** Resolve a readable display name from context/localStorage. */
export function getDisplayName(fallback = 'User') {
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.name && typeof parsed.name === 'string') return parsed.name;
    }
  } catch {
    // legacy plain string
  }
  const plain = localStorage.getItem('user');
  if (plain && !plain.startsWith('{')) return plain;
  return fallback;
}
