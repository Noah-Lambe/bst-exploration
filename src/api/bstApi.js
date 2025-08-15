// src/api/bstApi.js

const API = "http://localhost:8080/api/bst";

async function handle(res) {
  const text = await res.text();
  if (!res.ok) {
    let message = text;
    try {
      message = JSON.parse(text)?.message || message;
    } catch {}
    throw new Error(message || `${res.status} ${res.statusText}`);
  }
  if (!text) return null;
  return JSON.parse(text);
}

export async function getTree() {
  return handle(await fetch(`${API}/tree`));
}

export async function insertValue(value) {
  const v = Number(value);
  return handle(
    await fetch(`${API}/insert/${encodeURIComponent(v)}`, {
      method: "POST",
    })
  );
}

export async function searchValue(value) {
  const v = Number(value);
  return handle(
    await fetch(`${API}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: v }),
    })
  );
}

export async function deleteValue(value) {
  const v = Number(value);
  return handle(
    await fetch(`${API}/delete/${encodeURIComponent(v)}`, {
      method: "DELETE",
    })
  );
}

export async function clearTree() {
  return handle(await fetch(`${API}/clear`, { method: "POST" }));
}

export async function buildSample() {
  return handle(await fetch(`${API}/sample`, { method: "POST" }));
}

export async function getTraversal(type) {
  return handle(await fetch(`${API}/traversal/${encodeURIComponent(type)}`));
}

export async function processNumbers(numbers) {
  return handle(
    await fetch(`${API}/process-numbers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numbers }),
    })
  );
}

export async function getPreviousTrees(page = 0, size = 10) {
  return handle(await fetch(`${API}/previous-trees?page=${page}&size=${size}`));
}
