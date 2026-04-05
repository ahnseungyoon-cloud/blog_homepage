"use server";

import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function publishPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const summary = content.slice(0, 150) + "..."; // Simple summary

  // Handle optional thumbnail upload
  const thumbnailFile = formData.get("thumbnail") as File | null;
  let thumbnailUrl: string | null = null;

  if (thumbnailFile) {
    // Convert to Uint8Array for image processing
    const arrayBuffer = await thumbnailFile.arrayBuffer();
    let imageBuffer: Uint8Array = new Uint8Array(arrayBuffer);

    // Resize if larger than 2 MB
    if (thumbnailFile.size > 2 * 1024 * 1024) {
      const sharp = (await import("sharp")).default;
      imageBuffer = await sharp(imageBuffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .toBuffer();
    }
    // Generate a unique file name
    const ext = thumbnailFile.name.split('.').pop() || "png";
    const fileName = `${uuidv4()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("thumbnails")
      .upload(fileName, imageBuffer, {
        contentType: thumbnailFile.type,
        upsert: false,
      });
    if (uploadError) {
      console.error("Thumbnail upload error:", uploadError);
      throw new Error(uploadError.message);
    }
    const { data: publicData } = supabase.storage
      .from("thumbnails")
      .getPublicUrl(fileName);
    thumbnailUrl = publicData?.publicUrl ?? null;
  }

  const { data, error } = await supabase.from("posts").insert([
    {
      title,
      content,
      category,
      summary,
      user_id: user.id,
      thumbnail_url: thumbnailUrl ?? `https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800`,
    },
  ]).select();

  if (error) {
    console.error("Error publishing post:", error);
    throw new Error(error.message);
  }

  return { success: true };
}
