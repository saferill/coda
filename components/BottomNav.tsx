'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Mencari', href: '/search', icon: Search },
    { name: 'Pustaka', href: '/library', icon: Library },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121110]/80 backdrop-blur-md border-t border-[#FAF9F6]/5 pb-safe">
      <div className="flex justify-around items-center h-16 px-6 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300',
                isActive ? 'text-[#FAF9F6] scale-105' : 'text-[#FAF9F6]/40 hover:text-[#FAF9F6]/70'
              )}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 1.5 : 1} />
              {isActive && <span className="text-[9px] font-sans tracking-widest uppercase">{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
