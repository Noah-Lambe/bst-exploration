import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/api/bst";

export default function App() {
  const [value, setValue] = useState("");
  const [respMsg, setRespMsg] = useState("");
  const [tree, setTree] = useState(null);
  const [meta, setMeta] = useState({
    height: 0,
    min: null,
    max: null,
    size: 0,
  });
  const [searchResult, setSearchResult] = useState(null);
  const [traversalType, setTraversalType] = useState("inorder");
  const [traversal, setTraversal] = useState([]);

  useEffect(() => {
    loadTree();
  }, []);

  async function loadTree() {
    try {
      const res = await fetch(`${API}/tree`);
      const data = await res.json();
      setTree(data.tree || null);
      setRespMsg(data.message || "");
      setMeta({
        height: data.height ?? 0,
        min: data.min ?? null,
        max: data.max ?? null,
        size: data.size ?? 0,
      });
      setTraversal(data.traversal || []);
    } catch {
      setRespMsg("Could not load tree");
    }
  }

  async function insertValue() {
    if (value === "") return;
    const res = await fetch(`${API}/insert/${Number(value)}`, {
      method: "POST",
    });
    const data = await res.json();
    applyTreeResponse(data);
    setValue("");
  }

  async function searchValue() {
    if (value === "") return;
    const res = await fetch(`${API}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: Number(value) }),
    });
    const data = await res.json();
    setSearchResult(data);
    setRespMsg(
      data.message || (data.found ? `Found ${value}` : `${value} not found`)
    );
  }

  async function deleteValue() {
    if (value === "") return;
    const res = await fetch(`${API}/delete/${Number(value)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    applyTreeResponse(data);
    setValue("");
  }

  async function clearTree() {
    const res = await fetch(`${API}/clear`, { method: "POST" });
    const data = await res.json();
    applyTreeResponse(data);
  }

  async function buildSample() {
    const res = await fetch(`${API}/sample`, { method: "POST" });
    const data = await res.json();
    applyTreeResponse(data);
  }

  async function getTraversal(type) {
    const res = await fetch(`${API}/traversal/${type}`);
    const data = await res.json();
    setTraversalType(type);
    setTraversal(data.traversal || []);
    setRespMsg(data.message || `Traversal: ${type}`);
    setTree(data.tree || null);
    setMeta({
      height: data.height ?? 0,
      min: data.min ?? null,
      max: data.max ?? null,
      size: data.size ?? 0,
    });
  }

  function applyTreeResponse(data) {
    setTree(data.tree || null);
    setRespMsg(data.message || "");
    setMeta({
      height: data.height ?? 0,
      min: data.min ?? null,
      max: data.max ?? null,
      size: data.size ?? 0,
    });
    setTraversal(data.traversal || []);
    setSearchResult(null);
  }

  function renderTreeGrid(root) {
    if (!root) return <div>No tree yet</div>;

    function height(n) {
      if (!n) return -1;
      return 1 + Math.max(height(n.left), height(n.right));
    }
    const h = height(root);

    const rows = [];
    const q = [root];
    for (let level = 0; level <= h; level++) {
      const width = q.length;
      const row = [];
      for (let i = 0; i < width; i++) {
        const n = q.shift();
        row.push(n);
        if (level < h) {
          if (n) {
            q.push(n.left || null, n.right || null);
          } else {
            q.push(null, null);
          }
        }
      }
      rows.push(row);
    }

    return (
      <table style={tableStyle}>
        <tbody>
          {rows.map((row, depth) => {
            const span = Math.pow(2, h - depth);
            return (
              <tr key={depth}>
                {row.map((n, i) => (
                  <td key={i} colSpan={span} style={{ padding: 0, border: 0 }}>
                    {n ? cellBox(span, n.data) : cellBox(span, "\u00A0")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, Arial" }}>
      <h1>BST Frontend</h1>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="value"
        />
        <button onClick={insertValue}>Insert</button>
        <button onClick={searchValue}>Search</button>
        <button onClick={deleteValue}>Delete</button>
        <button onClick={buildSample}>Sample</button>
        <button onClick={clearTree}>Clear</button>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Traversal:&nbsp;</label>
        <select
          value={traversalType}
          onChange={(e) => getTraversal(e.target.value)}
        >
          <option value="inorder">inorder</option>
          <option value="preorder">preorder</option>
          <option value="postorder">postorder</option>
        </select>
        {traversal?.length ? (
          <span style={{ marginLeft: 8 }}>[ {traversal.join(", ")} ]</span>
        ) : null}
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong>Status:</strong> {respMsg || "(idle)"}
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        <div>
          <h2 style={{ margin: "8px 0" }}>Tree</h2>
          {renderTreeGrid(tree)}
        </div>
        <div>
          <h2 style={{ margin: "8px 0" }}>Info</h2>
          <div>Size: {meta.size}</div>
          <div>Height: {meta.height}</div>
          <div>Min: {meta.min ?? "-"}</div>
          <div>Max: {meta.max ?? "-"}</div>

          {searchResult && (
            <div style={{ marginTop: 12 }}>
              <h3 style={{ margin: "8px 0" }}>Last Search</h3>
              <div>Found: {String(searchResult.found)}</div>
              {"path" in searchResult && searchResult.path && (
                <div>Path: [ {searchResult.path.join(", ")} ]</div>
              )}
              {"message" in searchResult && searchResult.message && (
                <div>Message: {searchResult.message}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
