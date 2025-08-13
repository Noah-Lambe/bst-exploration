import React from "react";

export default function InfoPanel({ meta, status, searchResult, traversal }) {
  return (
    <div className="info">
      <div className="status">
        <strong>Status:</strong> {status || "(idle)"}
      </div>

      <h2>Info</h2>
      <div>Size: {meta.size}</div>
      <div>Height: {meta.height}</div>
      <div>Min: {meta.min ?? "-"}</div>
      <div>Max: {meta.max ?? "-"}</div>

      {Array.isArray(traversal) && traversal.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div>Traversal: [ {traversal.join(", ")} ]</div>
        </div>
      )}

      {searchResult && (
        <div style={{ marginTop: 12 }}>
          <h3>Last Search</h3>
          <div>Found: {String(searchResult.found)}</div>
          {searchResult.path?.length ? (
            <div>Path: [ {searchResult.path.join(", ")} ]</div>
          ) : null}
          {searchResult.message ? (
            <div>Message: {searchResult.message}</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
