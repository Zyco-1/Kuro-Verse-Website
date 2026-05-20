'use client';

import Link from 'next/link';
import { Search, Menu, User, LogOut, LogIn, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const savedUser = localStorage.getItem('kuroverse_user');
    if (savedUser) setUser(savedUser);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('kuroverse_user', 'KuroMember');
    setUser('KuroMember');
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('kuroverse_user');
    setUser(null);
  };

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

        {user ? (
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <User size={18} className="text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest">{user}</span>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                </button>
            </div>
        ) : (
            <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:flex items-center gap-2 bg-primary text-black px-6 py-2 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
                <LogIn size={18} />
                <span>Join</span>
            </button>
        )}
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                <button
                    onClick={() => setIsAuthModalOpen(false)}
                    className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-primary">Welcome Back</h2>
                        <p className="text-white/40 font-bold">Sync your watch history across all devices.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleLogin}
                            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-3"
                        >
                            Continue with Google
                        </button>
                         <button
                            onClick={handleLogin}
                            className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                        >
                            Continue as Guest
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-widest">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
