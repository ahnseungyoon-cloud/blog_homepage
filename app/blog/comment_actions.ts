"use server";

import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function addComment(postId: string, content: string, parentId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const { error } = await supabase.from("comments").insert([
    {
      id: uuidv4(),
      post_id: postId,
      user_id: user.id,
      parent_id: parentId || null,
      content,
    },
  ]);
  if (error) {
    console.error("Error adding comment:", error);
    throw new Error(error.message);
  }
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  // Ensure the comment belongs to the user
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single();
  if (fetchError) {
    console.error("Error fetching comment:", fetchError);
    throw new Error(fetchError.message);
  }
  if (comment.user_id !== user.id) {
    throw new Error("Permission denied");
  }
  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) {
    console.error("Error deleting comment:", error);
    throw new Error(error.message);
  }
  return { success: true };
}
