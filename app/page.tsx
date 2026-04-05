import BlogSection from "@/components/home/BlogSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full flex justify-center py-24 px-6 relative overflow-hidden bg-white dark:bg-[#111] border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-3xl relative z-10 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Thoughts</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl text-balance leading-relaxed">
            프론트엔드 개발, 회고, 기술 팁 등을 공유하는 블로그입니다.
            현재 Next.js App Router와 Supabase를 활용하여 구성되었습니다.
          </p>
        </div>
      </section>

      {/* Blog List Section (Client Component) */}
      <BlogSection />
    </div>
  );
}
