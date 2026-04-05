"use client";

import { 
  Bold, 
  Italic, 
  Code, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  List, 
  Quote 
} from "lucide-react";

interface MarkdownToolbarProps {
  content: string;
  setContent: (content: string) => void;
}

export default function MarkdownToolbar({ content, setContent }: MarkdownToolbarProps) {
  const insertText = (before: string, after: string = "") => {
    // Current selection handling could be added here, but for now simple append
    setContent(`${content}\n${before}${after}`);
  };

  const tools = [
    { icon: Bold, label: "Bold", action: () => insertText("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertText("*", "*") },
    { icon: Code, label: "Code", action: () => insertText("```\n", "\n```") },
    { icon: LinkIcon, label: "Link", action: () => insertText("[", "](url)") },
    { icon: ImageIcon, label: "Image", action: () => insertText("![alt text](", "https://)") },
    { icon: List, label: "List", action: () => insertText("- ") },
    { icon: Quote, label: "Quote", action: () => insertText("> ") },
  ];

  return (
    <div className="flex items-center gap-2 py-3 border-b border-zinc-200 dark:border-zinc-800 mb-4 px-2">
      {tools.map((tool, index) => (
        <button
          key={index}
          onClick={tool.action}
          className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition"
          title={tool.label}
        >
          <tool.icon size={18} />
        </button>
      ))}
    </div>
  );
}
