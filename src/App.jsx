import React, { useEffect, useState } from "react";
import Controls from "./components/Controls";
import TreeGrid from "./components/TreeGrid";
import InfoPanel from "./components/InfoPanel";
import {
  getTree,
  insertValue,
  searchValue,
  deleteValue,
  clearTree,
  buildSample,
  getTraversal,
  processNumbers,
  getPreviousTrees,
} from "./api/bstApi";
import "./styles/bst.css";

export default function App() {
  const [tree, setTree] = useState(null);
  const [meta, setMeta] = useState({
    height: 0,
    min: null,
    max: null,
    size: 0,
  });
  const [status, setStatus] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [traversal, setTraversal] = useState([]);

  const [listText, setListText] = useState("");
  const [history, setHistory] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [showJson, setShowJson] = useState(false);
  const [jsonToShow, setJsonToShow] = useState(null); // object to pretty-print

  useEffect(() => {
    loadTree();
  }, []);

  async function loadTree() {
    const data = await getTree();
    applyTreeResponse(data);
  }

  function applyTreeResponse(data) {
    setTree(data.tree || null);
    setStatus(data.message || "");
    setMeta({
      height: data.height ?? 0,
      min: data.min ?? null,
      max: data.max ?? null,
      size: data.size ?? 0,
    });
    setTraversal(data.traversal || []);
    setSearchResult(null);
  }

  // Existing handlers
  const handleInsert = async (v) => applyTreeResponse(await insertValue(v));
  const handleSearch = async (v) => {
    const res = await searchValue(v);
    setSearchResult(res);
    setStatus(res.message || (res.found ? `Found ${v}` : `${v} not found`));
  };
  const handleDelete = async (v) => applyTreeResponse(await deleteValue(v));
  const handleClear = async () => applyTreeResponse(await clearTree());
  const handleSample = async () => applyTreeResponse(await buildSample());
  const handleTraversal = async (type) => {
    const data = await getTraversal(type);
    setTraversal(data.traversal || []);
    setStatus(data.message || `Traversal: ${type}`);
    setTree(data.tree || null);
    setMeta({
      height: data.height ?? 0,
      min: data.min ?? null,
      max: data.max ?? null,
      size: data.size ?? 0,
    });
  };

  // NEW: parse helper for flexible delimiters
  function parseNumbers(text) {
    if (!text || !text.trim()) return [];
    return text
      .split(/[,\s;]+/)
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n));
  }

  // NEW: process list -> build tree, save, show
  const handleProcessList = async () => {
    const nums = parseNumbers(listText);
    if (nums.length === 0) {
      setStatus("Please enter one or more numbers (e.g., 50, 30; 70 20 40).");
      return;
    }
    try {
      const data = await processNumbers(nums);
      // data has { id, tree, message, success }
      setStatus(data.message || "Processed numbers.");
      setTree(data.tree || null);
      setJsonToShow(data.tree || null); // make it easy to open JSON view
      setShowJson(false);
      // refresh meta from current /tree response for consistency
      await loadTree();
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  };

  // NEW: fetch previous trees
  const loadPreviousTrees = async (page = 0, size = pageInfo.size) => {
    try {
      const res = await getPreviousTrees(page, size);
      // res is a Spring Page
      setHistory(res.content || []);
      setPageInfo({
        page: res.number,
        size: res.size,
        totalPages: res.totalPages,
        totalElements: res.totalElements,
      });
      setStatus(
        `Loaded ${res.numberOfElements ?? res.content?.length ?? 0} record(s).`
      );
    } catch (e) {
      setStatus(`Error loading history: ${e.message}`);
    }
  };

  // NEW: load a previous tree into the viewer
  const handleLoadPrevious = (item) => {
    if (!item) return;
    setTree(item.tree || null);
    setStatus(
      `Loaded record #${item.id} (${new Date(item.createdAt).toLocaleString()})`
    );
    setJsonToShow(item.tree || null);
    setShowJson(false);
    // meta like height/min/max/size are not stored on the record; keep current meta
  };

  // NEW: toggle JSON view
  const toggleJson = (obj = tree) => {
    setJsonToShow(obj || tree);
    setShowJson((v) => !v);
  };

  return (
    <div className="app">
      <h1>Binary Search Tree Visualizer</h1>

      <Controls
        onInsert={handleInsert}
        onSearch={handleSearch}
        onDelete={handleDelete}
        onClear={handleClear}
        onSample={handleSample}
        onTraversal={handleTraversal}
      />

      {/* NEW: Batch tools */}
      <section className="panel">
        <h2>Batch: Process List of Numbers</h2>
        <div className="row">
          <input
            value={listText}
            onChange={(e) => setListText(e.target.value)}
            placeholder="e.g. 50, 30; 70 20 40"
            className="text-input"
          />
          <button onClick={handleProcessList}>Process Numbers</button>
          <button onClick={() => toggleJson(tree)} disabled={!tree}>
            {showJson ? "Hide JSON" : "View Tree JSON"}
          </button>
        </div>
        {showJson && (
          <pre className="json-view" aria-label="Tree JSON">
            {JSON.stringify(jsonToShow, null, 2)}
          </pre>
        )}
      </section>

      <div className="content">
        <div className="tree">
          <h2>Tree</h2>
          <TreeGrid root={tree} />
        </div>
        <InfoPanel
          meta={meta}
          status={status}
          searchResult={searchResult}
          traversal={traversal}
        />
      </div>

      {/* NEW: Previous trees */}
      <section className="panel">
        <div className="row between">
          <h2>Previous Trees</h2>
          <div>
            <button onClick={() => loadPreviousTrees(0)}>Load Previous</button>
            {pageInfo.totalPages > 1 && (
              <>
                <button
                  onClick={() =>
                    loadPreviousTrees(Math.max(0, pageInfo.page - 1))
                  }
                  disabled={pageInfo.page <= 0}
                >
                  ◀ Prev
                </button>
                <button
                  onClick={() =>
                    loadPreviousTrees(
                      Math.min(pageInfo.totalPages - 1, pageInfo.page + 1)
                    )
                  }
                  disabled={pageInfo.page >= pageInfo.totalPages - 1}
                >
                  Next ▶
                </button>
                <span style={{ marginLeft: 8 }}>
                  Page {pageInfo.page + 1} / {pageInfo.totalPages}
                </span>
              </>
            )}
          </div>
        </div>

        {history.length === 0 ? (
          <p>No history loaded yet.</p>
        ) : (
          <ul className="history-list">
            {history.map((item) => (
              <li key={item.id} className="history-item">
                <div className="history-main">
                  <div>
                    <strong>Record #{item.id}</strong>{" "}
                    <span className="muted">
                      — {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="muted">
                    Numbers:{" "}
                    {Array.isArray(item.numbers) ? item.numbers.join(", ") : ""}
                  </div>
                </div>
                <div className="history-actions">
                  <button onClick={() => handleLoadPrevious(item)}>
                    Load Tree
                  </button>
                  <button onClick={() => toggleJson(item.tree)}>
                    View JSON
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
