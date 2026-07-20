'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Sparkles, Briefcase, FileText, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Icon-only rail, matching the reference: dark rounded column, logo tile up top,
// stacked icon buttons, avatar pinned to the bottom.
const NAV = [
  { href: '/overview', label: 'Overview', icon: LayoutGrid },
  { href: '/matches', label: 'Matches', icon: Sparkles },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/applications', label: 'Applications', icon: FileText },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden shrink-0 lg:flex fixed bottom-0 left-0 z-40 w-full items-center justify-center bg-card md:top-0 md:h-auto md:w-[76px]
     md:flex-col md:justify-start md:gap-8 md:py-6 md:px-0">
      <div className="flex w-[76px] flex-col items-center justify-between rounded-[28px] bg-ink py-5">
        {/* Logo tile */}
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent">
            <span className="font-display text-xl font-bold text-ink">A</span>
          </div>

          {/* Icon nav */}
          <nav className="mt-8 flex flex-col items-center gap-2">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${
                    active ? 'bg-white/10 text-accent' : 'text-foreground hover:bg-black/5 hover:text-black dark::hover:bg-white/5 '
                  }`}
                >
                  <Icon className="h-[20px] w-[20px]" />
                  {/* hover label */}
                  <span className="pointer-events-none absolute left-full z-20 ml-3 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-card-hover transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: logout + avatar */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={logout}
            title="Log out"
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-white/50 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-[20px] w-[20px]" />
          </button>
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-accent-soft">
            <span className="text-sm font-semibold text-accent-ink">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
