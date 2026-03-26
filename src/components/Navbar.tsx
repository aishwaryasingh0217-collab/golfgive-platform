'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { Menu, X, Trophy, Heart, UserCircle, LogOut, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/85 backdrop-blur-[20px] border-b border-emerald-400/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-emerald-500 to-amber-400 flex items-center justify-center text-lg font-extrabold text-[#020617]">
              G
            </div>
            <span className="font-heading font-bold text-xl bg-gradient-to-br from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              GolfGive
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/#how-it-works">How It Works</NavLink>
            <NavLink href="/charities">Charities</NavLink>
            <NavLink href="/#pricing">Pricing</NavLink>
            {user ? (
              <>
                <Link href="/dashboard" className="btn-primary btn-small ml-2">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="btn-secondary btn-small">
                    <Shield size={16} /> Admin
                  </Link>
                )}
                <button onClick={signOut} className="btn-secondary btn-small bg-transparent">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="btn-secondary btn-small ml-2">Sign In</Link>
                <Link href="/auth?mode=signup" className="btn-primary btn-small">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center p-2 text-slate-200 bg-transparent border-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[70px] left-0 right-0 bg-[#020617]/98 border-t border-emerald-400/10 p-5 shadow-2xl animate-fade-in shadow-black/50 backdrop-blur-xl">
          <div className="flex flex-col gap-3">
            <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="text-slate-300 no-underline py-3 px-2 text-base font-medium border-b border-slate-800/50 hover:text-emerald-400 transition-colors">
              How It Works
            </Link>
            <Link href="/charities" onClick={() => setMobileOpen(false)} className="text-slate-300 no-underline py-3 px-2 text-base font-medium border-b border-slate-800/50 hover:text-emerald-400 transition-colors">
              Charities
            </Link>
            <Link href="/#pricing" onClick={() => setMobileOpen(false)} className="text-slate-300 no-underline py-3 px-2 text-base font-medium border-b border-slate-800/50 hover:text-emerald-400 transition-colors">
              Pricing
            </Link>
            
            <div className="flex flex-col gap-3 pt-4 pb-2">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center text-center">
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="btn-secondary w-full justify-center text-center">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="btn-secondary w-full justify-center text-center">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth" onClick={() => setMobileOpen(false)} className="btn-secondary w-full justify-center text-center">
                    Sign In
                  </Link>
                  <Link href="/auth?mode=signup" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-slate-400 no-underline px-3.5 py-2 rounded-lg text-[0.9rem] font-medium transition-all duration-200 hover:text-emerald-400 hover:bg-emerald-400/10"
    >
      {children}
    </Link>
  );
}
