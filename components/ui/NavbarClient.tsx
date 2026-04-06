"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavbarClient({ initialUser }: { initialUser: any }) {
  const [user, setUser] = useState<any>(initialUser);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session) => {
      if (session?.user?.id !== user?.id) {
        setUser(session?.user || null);
        router.refresh(); // Trigger server-side re-render of layout
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase, user, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  return (
    <div className="flex gap-4 items-center">
      {user ? (
        <>
          <Link href="/write" className="text-sm font-medium bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-4 py-2 rounded-full hover:opacity-90 transition">
            Write
          </Link>
          <button 
            onClick={handleLogout} 
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition"
          >
            Logout
          </button>
        </>
      ) : (
        <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition">
          Login
        </Link>
      )}
    </div>
  );
}
