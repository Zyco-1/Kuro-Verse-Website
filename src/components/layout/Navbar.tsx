'use client';

import Link from 'next/link';
import { Search, Menu, User, LogOut, LogIn, X, Mail, Lock, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const savedUser = localStorage.getItem('kuroverse_user');
    if (savedUser) {
        try {
            setUser(JSON.parse(savedUser));
        } catch (e) {
            localStorage.removeItem('kuroverse_user');
        }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuth = (_e?: React.FormEvent) => {
    _e?.preventDefault();
    const mockUser = { name: 'KuroMember', email: 'user@example.com' };
    localStorage.setItem('kuroverse_user', JSON.stringify(mockUser));
    setUser(mockUser);
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
          <Link href="/" className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors text-white/70">Home</Link>
          <Link href="/trending" className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors text-white/70">Trending</Link>
          <Link href="/popular" className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors text-white/70">Popular</Link>
          <Link href="/airing" className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors text-white/70">Airing</Link>
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
                <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-primary/30 transition-all">
                    <User size={18} className="text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest">{user.name}</span>
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

      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-zinc-950 border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
                <button
                    onClick={() => setIsAuthModalOpen(false)}
                    className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-glow text-primary flex items-center gap-3">
                            <Sparkles className="fill-primary" />
                            {authMode === 'login' ? 'Welcome Back' : 'Get Started'}
                        </h2>
                        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
                            {authMode === 'login' ? 'Log in to sync your library' : 'Create an account to start streaming'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="flex flex-col gap-4">
                        {authMode === 'signup' && (
                             <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                                    required
                                />
                            </div>
                        )}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 mt-2"
                        >
                            {authMode === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="flex flex-col gap-6">
                        <div className="relative flex items-center gap-4">
                            <div className="h-px bg-white/5 flex-1" />
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Or social login</span>
                            <div className="h-px bg-white/5 flex-1" />
                        </div>

                        <button
                            onClick={handleAuth}
                            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                        >
                            Continue with Google
                        </button>
                    </div>

                    <p className="text-center text-xs font-bold text-white/40">
                        {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setAuthModalMode(authMode === 'login' ? 'signup' : 'login')}
                            className="text-primary hover:underline ml-2"
                        >
                            {authMode === 'login' ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
