"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import WritingHeader from "@/components/write/WritingHeader";
import MarkdownToolbar from "@/components/write/MarkdownToolbar";
import EditorContainer from "@/components/write/EditorContainer";

export default function WritePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("React"); // Default
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    checkUser();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <WritingHeader 
        title={title} 
        setTitle={setTitle} 
        category={category}
        setCategory={setCategory}
        content={content}
      />
      <main className="flex-1 flex flex-col overflow-hidden max-w-[1600px] mx-auto w-full px-6 py-4">
        <MarkdownToolbar content={content} setContent={setContent} />
        <EditorContainer content={content} setContent={setContent} />
      </main>
    </div>
  );
}
