import React, { useState } from "react";

export default function Controls({
  onInsert,
  onSearch,
  onDelete,
  onSample,
  onClear,
  onTraversal,
}) {
  const [value, setValue] = useState("");
  const [type, setType] = useState("inorder");

  return (
    <div className="toolbar">
      <input
        type="number"
        placeholder="value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={() => {
          if (value !== "") onInsert(value);
          setValue("");
        }}
      >
        Insert
      </button>
      <button
        onClick={() => {
          if (value !== "") onSearch(value);
        }}
      >
        Search
      </button>
      <button
        onClick={() => {
          if (value !== "") onDelete(value);
          setValue("");
        }}
      >
        Delete
      </button>
      <button onClick={onSample}>Sample</button>
      <button onClick={onClear}>Clear</button>

      <div className="traversal">
        <label>Traversal:&nbsp;</label>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            onTraversal(e.target.value);
          }}
        >
          <option value="inorder">inorder</option>
          <option value="preorder">preorder</option>
          <option value="postorder">postorder</option>
        </select>
      </div>
    </div>
  );
}
