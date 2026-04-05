-- Clear existing data if necessary (optional, but good for fresh seeds)
-- TRUNCATE TABLE public.posts CASCADE;

-- Insert seed data for preview
INSERT INTO public.posts (id, title, summary, thumbnail_url, category, created_at)
VALUES 
  (gen_random_uuid(), 'Next.js 15 App Router: 무엇이 달라졌을까?', '최신 Next.js 15버전의 App Router 변경점과 마이그레이션 가이드를 쉽게 설명합니다. 성능 개선과 새로운 기능들을 정리했습니다.', 'https://picsum.photos/seed/nextjs/600/400', 'Next.js', now()),
  (gen_random_uuid(), 'Supabase 시작하기: Firebase 대안으로 완벽할까?', '오픈소스 BaaS인 수파베이스의 장단점을 알아보고, React 프로젝트에 연동하는 기본 예제를 실습해 봅니다.', 'https://picsum.photos/seed/supabase/600/400', 'Supabase', now() - interval '2 days'),
  (gen_random_uuid(), 'React Server Components의 이해', '클라이언트 컴포넌트와 서버 컴포넌트의 차이를 알아보고, 언제 어느 것을 사용해야 할지 고민해결의 실마리를 제공합니다.', 'https://picsum.photos/seed/react/600/400', 'React', now() - interval '5 days'),
  (gen_random_uuid(), 'TailwindCSS 4버전 사용해보기', 'PostCSS 플러그인 없이 더 빨라진 테일윈드 버전 4의 프리뷰 버전을 실제로 구성하고 적용해 보는 가이드입니다.', 'https://picsum.photos/seed/tailwind/600/400', 'Frontend', now() - interval '1 week'),
  (gen_random_uuid(), '주니어 개발자의 1년 회고록', '지난 1년간 여러 가지 프로젝트를 진행하며 깨달은 점, 기술 스택의 변화, 그리고 앞으로의 목표에 대해 이야기합니다.', 'https://picsum.photos/seed/life/600/400', 'Life', now() - interval '2 months'),
  (gen_random_uuid(), 'Vercel 환경에서 무중단 배포 경험담', '최적의 프론트엔드 배포 플랫폼 버셀을 이용해 CI/CD 파이프라인을 구축하고 Next.js 앱을 효율적으로 호스팅하는 방법', 'https://picsum.photos/seed/vercel/600/400', 'Next.js', now() - interval '3 months');
