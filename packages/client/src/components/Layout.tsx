import { NavLink, Outlet } from 'react-router-dom';
import { Castle, MessageSquare, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
   { to: '/', label: 'Home', icon: Castle },
   { to: '/chat', label: 'Chat', icon: MessageSquare },
   { to: '/summary', label: 'Reviews', icon: Star },
];

export function Layout() {
   return (
      <div className="min-h-svh bg-background">
         <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
               <span className="text-lg font-bold tracking-tight">
                  WonderWorld
               </span>
               <nav className="flex items-center gap-1">
                  {navItems.map(({ to, label, icon: Icon }) => (
                     <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                           cn(
                              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                              isActive
                                 ? 'bg-primary text-primary-foreground'
                                 : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                           )
                        }
                     >
                        <Icon className="size-4" />
                        {label}
                     </NavLink>
                  ))}
               </nav>
            </div>
         </header>
         <main className="mx-auto max-w-5xl px-4 py-8">
            <Outlet />
         </main>
      </div>
   );
}
