import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/blog/ShareButtons";
import DeleteButton from "./DeleteButton";
import CommentSection from "@/components/blog/CommentSection";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();
  const isAuthor = user?.id === post.user_id;

  // Fetch comments
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Placeholder for author as the current schema might not have populated users
  const authorName = "관리자";

  const contentToDisplay = post.content || post.summary || "내용이 없습니다.";

  return (
    <div className="w-full bg-white dark:bg-[#111]">
      {/* Header Segment */}
      <h1 className="sr-only">{post.title}</h1>
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase mb-4 hover:underline"
        >
          {post.category}
        </Link>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-8 text-balance">
          {post.title}
        </h2>
        
        {/* Author Info & Share */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full border-t border-b border-zinc-200 dark:border-zinc-800 py-4 mb-12 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
              {/* Dummy Avatar */}
              <svg className="w-6 h-6 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{authorName}</span>
              <span className="text-xs text-zinc-500">{date}</span>
            </div>
          </div>

          <ShareButtons title={post.title} />
        </div>

        {/* Thumbnail */}
        {post.thumbnail_url && (
          <div className="w-full aspect-video relative rounded-2xl overflow-hidden mb-12 bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 800px"
              priority
              unoptimized
            />
          </div>
        )}

        {/* Content */}
        <div className="w-full text-left blog-content prose dark:prose-invert prose-zinc max-w-none prose-img:rounded-2xl prose-img:mx-auto prose-p:leading-relaxed prose-p:text-lg dark:prose-p:text-zinc-300">
          <ReactMarkdown 
            remarkPlugins={[remarkBreaks]}
            components={{
              img: ({ node, ...props }) => (
                <span className="block my-8">
                  <img 
                    {...props} 
                    className="rounded-2xl w-full h-auto shadow-lg"
                    style={{ maxHeight: '600px', objectFit: 'contain' }}
                    loading="lazy"
                  />
                </span>
              ),
              p: ({ children }) => <p className="mb-6">{children}</p>,
            }}
          >
            {contentToDisplay}
          </ReactMarkdown>
        </div>

        {/* Admin Actions */}
        {isAuthor && (
          <div className="w-full flex justify-end pt-8 mt-12 border-t border-zinc-200 dark:border-zinc-800">
            <DeleteButton id={post.id} />
          </div>
        )}

        {/* Comment Section */}
        <div className="w-full mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <CommentSection 
            postId={post.id} 
            initialComments={comments || []} 
            currentUser={user ? { id: user.id, email: user.email } : null} 
          />
        </div>
      </div>
    </div>
  );
}
