export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black py-8 mt-16 pb-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          DevBlog.
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} By Seungyoon. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
