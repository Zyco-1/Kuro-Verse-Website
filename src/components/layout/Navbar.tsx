'use client';

import Link from 'next/link';
import { Search, Play, User, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between',
        scrolled ? 'bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      )}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <span className="bg-primary text-black p-1 rounded">KURO</span>
          <span className="text-white">VERSE</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/trending" className="hover:text-primary transition-colors">Trending</Link>
          <Link href="/popular" className="hover:text-primary transition-colors">Popular</Link>
          <Link href="/airing" className="hover:text-primary transition-colors">Airing</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/search" className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Search size={20} className="text-white/70" />
        </Link>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden">
          <Menu size={20} className="text-white/70" />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full cursor-pointer hover:bg-white/10 transition-colors">
          <User size={16} className="text-white/70" />
          <span className="text-xs font-semibold">Guest</span>
        </div>
      </div>
    </nav>
  );
}
