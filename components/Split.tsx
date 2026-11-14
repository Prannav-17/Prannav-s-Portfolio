import { Fragment } from "react";

// Splits text into masked words on the server, so headings can rise word by word
// without the browser rewriting React-managed text later. The space sits outside
// each word's box: inside an inline-block a trailing space would be dropped.
export function Words({ text }: { text: string }) {
  const parts = text.split(" ");
  return (
    <>
      {parts.map((w, i) => (
        <Fragment key={i}><span className="w"><span className="wi">{w}</span></span>{i < parts.length - 1 ? " " : ""}</Fragment>
      ))}
    </>
  );
}

// Letters that roll up on hover: each letter carries a copy of itself drawn by CSS (::after),
// so the element's text stays the plain word. Give the parent link an aria-label.
export function Roll({ text }: { text: string }) {
  return (
    <span className="roll">
      {[...text].map((c, i) => (
        <span key={i} data-c={c} style={{ ["--i" as string]: i }}>{c}</span>
      ))}
    </span>
  );
}
