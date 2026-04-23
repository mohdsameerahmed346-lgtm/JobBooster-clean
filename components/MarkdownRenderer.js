"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children }) {
          const match = /language-(\w+)/.exec(className || "");

          return !inline && match ? (
            <div className="relative group">
              <CopyButton text={String(children)} />

              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="bg-gray-700 px-1 rounded">
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

/* COPY BUTTON */
function CopyButton({ text }) {
  const copy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <button
      onClick={copy}
      className="absolute top-2 right-2 text-xs bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100"
    >
      Copy
    </button>
  );
        }
