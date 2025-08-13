const API = "http://localhost:8080/api/bst";

export async function getTree() {
  const r = await fetch(`${API}/tree`);
  return r.json();
}

export async function insertValue(value) {
  const r = await fetch(`${API}/insert/${Number(value)}`, { method: "POST" });
  return r.json();
}

export async function searchValue(value) {
  const r = await fetch(`${API}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value: Number(value) }),
  });
  return r.json();
}

export async function deleteValue(value) {
  const r = await fetch(`${API}/delete/${Number(value)}`, { method: "DELETE" });
  return r.json();
}

export async function clearTree() {
  const r = await fetch(`${API}/clear`, { method: "POST" });
  return r.json();
}

export async function buildSample() {
  const r = await fetch(`${API}/sample`, { method: "POST" });
  return r.json();
}

export async function getTraversal(type) {
  const r = await fetch(`${API}/traversal/${type}`);
  return r.json();
}
