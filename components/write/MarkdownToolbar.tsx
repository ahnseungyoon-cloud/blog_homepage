"use client";

import { useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { 
  Bold, 
  Italic, 
  Code, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  List, 
  Quote,
  Loader2
} from "lucide-react";

interface MarkdownToolbarProps {
  content: string;
  setContent: (content: string) => void;
}

export default function MarkdownToolbar({ content, setContent }: MarkdownToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const insertText = (before: string, after: string = "") => {
    setContent(`${content}\n${before}${after}`);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: add file size/type validation
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("thumbnails")
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("thumbnails")
        .getPublicUrl(filePath);

      insertText(`![${file.name}](`, `${publicUrl})`);
    } catch (error: any) {
      console.error("Error uploading image:", error.message);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const tools = [
    { icon: Bold, label: "Bold", action: () => insertText("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertText("*", "*") },
    { icon: Code, label: "Code", action: () => insertText("```\n", "\n```") },
    { icon: LinkIcon, label: "Link", action: () => insertText("[", "](url)") },
    { icon: ImageIcon, label: "Image", action: handleImageClick, isLoading: isUploading },
    { icon: List, label: "List", action: () => insertText("- ") },
    { icon: Quote, label: "Quote", action: () => insertText("> ") },
  ];

  return (
    <div className="flex items-center gap-2 py-3 border-b border-zinc-200 dark:border-zinc-800 mb-4 px-2">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      {tools.map((tool, index) => (
        <button
          key={index}
          onClick={tool.action}
          disabled={tool.isLoading}
          className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition disabled:opacity-50"
          title={tool.label}
        >
          {tool.isLoading ? (
            <Loader2 size={18} className="animate-spin text-blue-500" />
          ) : (
            <tool.icon size={18} />
          )}
        </button>
      ))}
    </div>
  );
}
