import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
<<<<<<< HEAD
  if (client) return client;

  client = createBrowserClient(
=======
  return createBrowserClient(
>>>>>>> 7818550
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}
