"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface EditorContainerProps {
  content: string;
  setContent: (content: string) => void;
}

export default function EditorContainer({ content, setContent }: EditorContainerProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent gap-4">
      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl w-full border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("write")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === "write"
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Write
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === "preview"
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden min-h-0">
        {/* Raw Editor */}
        <div 
          className={`flex-col h-full bg-zinc-100/50 dark:bg-zinc-900/30 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-inner md:flex ${
            activeTab === "write" ? "flex" : "hidden"
          }`}
        >
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts..."
            className="flex-1 w-full bg-transparent p-6 font-mono text-base leading-relaxed resize-none focus:outline-none placeholder:text-zinc-400 dark:text-zinc-300"
          />
        </div>

        {/* Live Preview */}
        <div 
          className={`flex-col h-full bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm md:flex ${
            activeTab === "preview" ? "flex" : "hidden"
          }`}
        >
          <div className="h-full overflow-y-auto p-6 md:p-8 prose prose-zinc dark:prose-invert max-w-none prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-900/50">
            {content ? (
              <ReactMarkdown
                components={{
                  img: ({ node, ...props }) => {
                    if (!props.src) return null;
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                    return <img {...props} />;
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <div className="text-zinc-400 italic">Preview will appear here...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
