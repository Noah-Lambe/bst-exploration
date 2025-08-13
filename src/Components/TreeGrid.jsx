import React from "react";

export default function TreeGrid({ root }) {
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
        if (n) q.push(n.left || null, n.right || null);
        else q.push(null, null);
      }
    }
    rows.push(row);
  }

  const base = 30;

  return (
    <table className="tree-grid">
      <tbody>
        {rows.map((row, depth) => {
          const span = Math.pow(2, h - depth);
          return (
            <tr key={depth}>
              {row.map((n, i) => (
                <td key={i} colSpan={span} style={{ padding: 0, border: 0 }}>
                  <div
                    className="node-box"
                    style={{
                      width: span * base,
                      margin: "0 auto",
                      textAlign: "center",
                      padding: "2px 0",
                    }}
                  >
                    {n ? n.data : "\u00A0"}
                  </div>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
