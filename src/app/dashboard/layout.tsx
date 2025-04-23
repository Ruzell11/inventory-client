"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Bell, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Toaster } from "react-hot-toast";

const navigation = [
  { name: 'Charts', href: '/dashboard/charts', icon: '📊' },
  { name: 'Products', href: '/dashboard/products', icon: '🏭' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
  { name: 'Reports', href: '/dashboard/reports', icon: '📑' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transform bg-white shadow-lg transition-all duration-200 ease-in-out md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isCollapsed && <h1 className="text-xl font-semibold text-black">Dashboard</h1>}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 text-black" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-black" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-6 w-6 text-black" />
            </Button>
          </div>
        </div>
        <nav className="mt-5 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                  isActive
                    ? 'bg-gray-100 text-black'
                    : 'text-black hover:bg-gray-50 hover:text-black',
                  isCollapsed ? 'justify-center' : ''
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <span className={cn('mr-3', isCollapsed ? 'mr-0' : '')}>
                  {item.icon}
                </span>
                {!isCollapsed && item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-200 ease-in-out',
          isCollapsed ? 'md:pl-16' : 'md:pl-64'
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden"
          >
            <Menu className="h-6 w-6 text-gray-900" />
          </Button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-gray-900" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
} 