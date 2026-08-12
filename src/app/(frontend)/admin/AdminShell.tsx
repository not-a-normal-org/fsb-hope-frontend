'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Inbox,
  CreditCard,
  ShoppingBag,
  Package,
  Mail,
  Calendar,
  ClipboardList,
  Handshake,
  Newspaper,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

import type { NavItem } from '@/lib/access';

// Icon per nav key (data-driven nav lives in src/lib/access.ts).
const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  team: UserCog,
  leads: Inbox,
  customers: Users,
  subscriptions: CreditCard,
  orders: ShoppingBag,
  products: Package,
  newsletter: Mail,
  appointments: Calendar,
  applications: ClipboardList,
  referrals: Handshake,
  blog: Newspaper,
};

export default function AdminShell({
  nav,
  user,
  children,
}: {
  nav: NavItem[];
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const active = [...nav]
    .sort((a, b) => b.href.length - a.href.length)
    .find((i) => pathname === i.href || pathname.startsWith(i.href + '/'));
  const title = active?.label ?? 'Admin';

  async function handleLogout() {
    await fetch('/api/account/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-[#07090F] font-[family-name:var(--font-inter)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 fixed inset-y-0 left-0 flex flex-col bg-[#0E1220] border-r border-[#1E2538] z-20">
        <div className="px-6 py-6 border-b border-[#1E2538]">
          <p className="text-[10px] tracking-[0.18em] uppercase text-[#E8963A] font-semibold mb-0.5">
            SaverMiles
          </p>
          <p className="text-xs text-[#5C6378]">Admin Console</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-0.5">
            {nav.map(({ key, label, href }) => {
              const Icon = ICONS[key] ?? LayoutDashboard;
              // Links outside the /admin route group (e.g. the CMS) need a full
              // navigation, not a client-side Link.
              const external = !href.startsWith('/admin');
              const isActive =
                !external &&
                (href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(href + '/'));
              const className = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 relative ${
                isActive
                  ? 'bg-[#13182A] text-[#F5F5F0]'
                  : 'text-[#9DA3B4] hover:bg-[#13182A]/60 hover:text-[#F5F5F0]'
              }`;
              const inner = (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#E8963A] rounded-full" />
                  )}
                  <Icon size={16} className={isActive ? 'text-[#E8963A]' : 'text-current'} />
                  {label}
                </>
              );
              return (
                <li key={href}>
                  {external ? (
                    <a href={href} className={className}>
                      {inner}
                    </a>
                  ) : (
                    <Link href={href} className={className}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-[#1E2538]">
          <div className="px-3 pb-3">
            <p className="text-xs text-[#F5F5F0] truncate">{user.name || user.email}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#E8963A] mt-0.5">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#9DA3B4] hover:bg-[#13182A]/60 hover:text-red-400 transition-colors duration-150"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col ml-60 min-h-screen">
        <header className="sticky top-0 z-10 flex items-center justify-between px-8 h-14 bg-[#07090F] border-b border-[#1E2538]">
          <h1 className="text-sm font-semibold text-[#F5F5F0]">{title}</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-[#9DA3B4] hover:text-red-400 transition-colors"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
