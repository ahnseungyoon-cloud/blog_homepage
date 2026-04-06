import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
          DevBlog.
        </Link>
        <NavbarClient initialUser={user} />
      </div>
    </nav>
  );
}
