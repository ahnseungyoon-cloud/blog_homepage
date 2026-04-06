"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import PostCard, { Post } from "./PostCard";
import Pagination from "./Pagination";

const POSTS_PER_PAGE = 6;

export default function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    const fetchPostsAndCategories = async () => {
      setLoading(true);
      
      // Fetch Categories
      const { data: categoryData } = await supabase.from("categories").select("name").order("created_at");
      if (categoryData) {
        setCategories(["All", ...categoryData.map(c => c.name)]);
      }

      // Fetch Posts
      let query = supabase
        .from("posts")
        .select("*", { count: "exact" });

      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory);
      }

      // Pagination
      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;
      query = query.range(from, to).order("created_at", { ascending: false });

      const { data, error, count } = await query;
      
      if (!error && data) {
        setPosts(data as Post[]);
        setTotalPosts(count || 0);
      } else if (error) {
        console.error("Error fetching posts:", error.message, error.details, error.hint);
      }
      
      setLoading(false);
    };

    fetchPostsAndCategories();
  }, [selectedCategory, currentPage, supabase]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1); // Reset to page 1 on category change
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-12">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
              selectedCategory === cat
                ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-black"
                : "bg-transparent border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="w-full py-20 flex justify-center items-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-t-blue-600 border-zinc-200 dark:border-zinc-800 rounded-full animate-spin"></div>
            <p className="text-zinc-500 font-medium">Blogging...</p>
          </div>
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="w-full py-32 text-center text-zinc-500 dark:text-zinc-500 bg-zinc-50 border border-dashed border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 rounded-2xl">
          <p className="text-lg">No posts found in this category.</p>
        </div>
      )}
    </section>
  );
}
