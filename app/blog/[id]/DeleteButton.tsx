"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/app/blog/actions";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  id: string;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      startTransition(async () => {
        try {
          const res = await deletePost(id);
          if (res?.success) {
            router.push("/");
            router.refresh();
          }
        } catch (error) {
          console.error(error);
          alert("게시글 삭제 중 오류가 발생했습니다.");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 size={16} />
      {isPending ? "삭제 중..." : "게시글 삭제"}
    </button>
  );
}
