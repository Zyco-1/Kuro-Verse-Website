'use client';

import Link from 'next/link';
import { Search, Menu, User } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 px-6 md:px-16 py-4 flex items-center justify-between",
      isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent"
    )}>
      <div className="flex items-center gap-12">
        <Link href="/" className="text-2xl font-black tracking-tighter text-primary italic hover:scale-105 transition-transform">
          KURO<span className="text-white">VERSE</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">Home</Link>
          <Link href="/trending" className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">Trending</Link>
          <Link href="/popular" className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">Popular</Link>
          <Link href="/airing" className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">Airing</Link>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/search" className="p-2 hover:bg-white/5 rounded-full transition-colors text-primary">
          <Search size={24} strokeWidth={3} />
        </Link>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors md:hidden">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-primary/50 transition-all cursor-pointer group">
          <User size={18} className="group-hover:text-primary" />
          <span className="text-xs font-black uppercase tracking-widest">Guest</span>
        </div>
      </div>
    </nav>
  );
}
