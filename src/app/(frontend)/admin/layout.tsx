'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCog,
  CreditCard,
  ShoppingBag,
  Package,
  Mail,
  Calendar,
  ClipboardList,
  LogOut,
} from 'lucide-react';

// ── Nav config ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Dashboard',     href: '/admin',               icon: LayoutDashboard },
  { label: 'Team',          href: '/admin/team',          icon: UserCog         },
  { label: 'Customers',     href: '/admin/customers',     icon: Users           },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard      },
  { label: 'Orders',        href: '/admin/orders',        icon: ShoppingBag     },
  { label: 'Products',      href: '/admin/products',      icon: Package         },
  { label: 'Newsletter',    href: '/admin/newsletter',    icon: Mail            },
  { label: 'Appointments',  href: '/admin/appointments',  icon: Calendar        },
  { label: 'Applications',  href: '/admin/applications',  icon: ClipboardList   },
] as const;

// ── Page title derived from pathname ─────────────────────────────────────────

function getPageTitle(pathname: string): string {
  const match = NAV_ITEMS.slice().reverse().find((item) =>
    pathname === item.href || pathname.startsWith(item.href + '/'),
  );
  return match?.label ?? 'Admin';
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const title    = getPageTitle(pathname);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-[#07090F] font-[family-name:var(--font-inter)]">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 fixed inset-y-0 left-0 flex flex-col bg-[#0E1220] border-r border-[#1E2538] z-20">

        {/* Brand */}
        <div className="px-6 py-6 border-b border-[#1E2538]">
          <p className="text-[10px] tracking-[0.18em] uppercase text-[#E8963A] font-semibold mb-0.5">
            SaverMiles
          </p>
          <p className="text-xs text-[#5C6378]">Admin Console</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const isActive =
                href === '/admin'
                  ? pathname === '/admin'
                  : pathname === href || pathname.startsWith(href + '/');

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-colors duration-150 relative
                      ${isActive
                        ? 'bg-[#13182A] text-[#F5F5F0]'
                        : 'text-[#9DA3B4] hover:bg-[#13182A]/60 hover:text-[#F5F5F0]'
                      }
                    `}
                  >
                    {/* Active left-border accent */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#E8963A] rounded-full" />
                    )}
                    <Icon size={16} className={isActive ? 'text-[#E8963A]' : 'text-current'} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-[#1E2538]">
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
              text-[#9DA3B4] hover:bg-[#13182A]/60 hover:text-red-400
              transition-colors duration-150
            "
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col ml-60 min-h-screen">

        {/* Top bar */}
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

        {/* Page content */}
        <main className="flex-1 p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
