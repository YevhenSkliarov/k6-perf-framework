export function jsonParams(name: string, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Token ${token}`;
  return { headers, tags: { name } };
}