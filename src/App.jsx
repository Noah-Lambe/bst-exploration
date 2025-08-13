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

  // Handlers
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
    </div>
  );
}
