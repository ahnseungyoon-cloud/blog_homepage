"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { addComment, deleteComment } from "@/app/blog/comment_actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare, CornerDownRight, Trash2, Send } from "lucide-react";

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  user_email?: string; // Add if joined
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  currentUser: { id: string; email?: string } | null;
}

export default function CommentSection({ 
  postId, 
  initialComments, 
  currentUser 
}: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    const text = parentId ? replyContent : content;
    if (!text.trim()) return;

    startTransition(async () => {
      try {
        const res = await addComment(postId, text, parentId);
        if (res.success) {
          if (parentId) {
            setReplyTo(null);
            setReplyContent("");
          } else {
            setContent("");
          }
          router.refresh();
        }
      } catch (error) {
        alert("Failed to post comment");
      }
    });
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    startTransition(async () => {
      try {
        const res = await deleteComment(commentId);
        if (res.success) {
          router.refresh();
        }
      } catch (error) {
        alert("Failed to delete comment");
      }
    });
  };

  const renderComments = (parentId: string | null, depth = 0) => {
    return initialComments
      .filter((c) => c.parent_id === parentId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((comment) => (
        <div key={comment.id} className={`${depth > 0 ? "ml-8 mt-4" : "mt-8"}`}>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <Image 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`} 
                alt="Avatar" 
                width={32} 
                height={32} 
              />
            </div>
            <div className="flex-1">
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl px-4 py-3 relative group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {comment.user_email || "User"}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
                
                {/* Actions */}
                <div className="flex items-center gap-4 mt-2">
                  {currentUser && depth < 3 && (
                    <button 
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="text-xs text-zinc-500 hover:text-blue-500 flex items-center gap-1 transition"
                    >
                      <MessageSquare size={12} /> Reply
                    </button>
                  )}
                  {currentUser?.id === comment.user_id && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-zinc-500 hover:text-red-500 flex items-center gap-1 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Reply Input Area */}
              {replyTo === comment.id && (
                <form onSubmit={(e) => handleAddComment(e, comment.id)} className="mt-4 flex gap-2">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 min-h-[80px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                  />
                  <button 
                    type="submit" 
                    disabled={isPending || !replyContent.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl self-end transition"
                  >
                    <Send size={18} />
                  </button>
                </form>
              )}

              {/* Recursive children */}
              {renderComments(comment.id, depth + 1)}
            </div>
          </div>
        </div>
      ));
  };

  return (
    <div className="w-full mt-16 pt-16 border-t border-zinc-200 dark:border-zinc-800">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 flex items-center gap-2">
        <MessageSquare size={24} />
        Comments ({initialComments.length})
      </h3>

      {/* Main Comment Form */}
      {currentUser ? (
        <form onSubmit={(e) => handleAddComment(e)} className="mb-12">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <Image 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`} 
                alt="Your Avatar" 
                width={40} 
                height={40} 
              />
            </div>
            <div className="flex-1 space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are your thoughts?"
                className="w-full min-h-[120px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending || !content.trim()}
                  className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-6 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition shadow-lg"
                >
                  {isPending ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 text-center mb-12">
          <p className="text-zinc-500 mb-4">Please log in to join the conversation.</p>
          <Link 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Log In
          </Link>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {initialComments.length > 0 ? (
          renderComments(null)
        ) : (
          <p className="text-center text-zinc-500 py-12">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
}
