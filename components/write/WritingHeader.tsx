"use client";

import Link from "next/link";
import { useState } from "react";
import { publishPost } from "@/app/write/actions";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import Image from "next/image";

interface WritingHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  category: string;
  setCategory: (category: string) => void;
  content: string;
}

export default function WritingHeader({ 
  title, 
  setTitle, 
  category, 
  setCategory,
  content 
}: WritingHeaderProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const router = useRouter();

  const handlePublish = async () => {
    if (!title || !content) {
      alert("Please enter title and content");
      return;
    }

    setIsPublishing(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }
      
      const res = await publishPost(formData);
      if (res?.success) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to publish post");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            DevLog
          </Link>
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
          <nav className="hidden md:flex gap-4">
            <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition">Explore</Link>
            <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition">Community</Link>
          </nav>
        </div>

        {/* Title Input */}
        <div className="flex-1 max-w-2xl px-4">
          <input
            type="text"
            placeholder="Post Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-lg font-semibold placeholder:text-zinc-400 dark:text-zinc-50"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-sm bg-zinc-100 dark:bg-zinc-900 border-none rounded-md px-3 py-1.5 focus:ring-1 focus:ring-zinc-400"
          >
            <option>Next.js</option>
            <option>React</option>
            <option>Supabase</option>
            <option>Frontend</option>
            <option>Life</option>
          </select>
          {/* Thumbnail Upload */}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="thumbnail-input"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setThumbnailFile(file);
              if (file) {
                const url = URL.createObjectURL(file);
                setThumbnailPreview(url);
              } else {
                setThumbnailPreview(null);
              }
            }}
          />
          <label htmlFor="thumbnail-input" className="cursor-pointer text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition">
            Upload Thumbnail
          </label>
          {thumbnailPreview && (
            <img src={thumbnailPreview} alt="Thumbnail preview" className="h-12 w-12 object-cover rounded-md ml-2" />
          )}
          
          <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition">
            Save Draft
          </button>
          
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-sm shadow-emerald-500/20"
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </button>

          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 ml-2" />
          
          <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition">
            <Bell size={20} />
          </button>
          
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
            <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" width={32} height={32} />
          </div>
        </div>
      </div>
    </header>
  );
}
