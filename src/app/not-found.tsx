import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
      <div className="text-primary text-9xl font-black italic tracking-tighter">404</div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase">Lost in Space</h1>
        <p className="text-white/40 font-bold max-w-md">The page you are looking for doesn't exist or has been moved to another dimension.</p>
      </div>
      <Link href="/" className="bg-primary text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
        Return Home
      </Link>
    </div>
  );
}
