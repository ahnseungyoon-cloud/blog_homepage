import Link from "next/link";
import Image from "next/image";

export interface Post {
  id: string;
  title: string;
  summary: string;
  thumbnail_url: string;
  category: string;
  created_at: string;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${post.id}`} className="group flex flex-col gap-4">
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {post.thumbnail_url ? (
          <Image
            src={post.thumbnail_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            No Image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 px-1">
        <div className="text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase">
          {post.category}
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 text-sm leading-relaxed">
          {post.summary}
        </p>
        <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
          {date}
        </div>
      </div>
    </Link>
  );
}
