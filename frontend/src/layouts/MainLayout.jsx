import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { User, Settings } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen font-body flex flex-col pt-2" style={{ backgroundColor: '#F6F5F2' }}>
      
      {/* ── TOP NAV ── */}
      <header className="px-8 mt-2 flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo area */}
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-2xl tracking-wide text-foreground">VIT FFCS</span>
          </div>
          
          {/* Main Navigation */}
          <nav className="flex items-center gap-6">
            <NavLink 
              to="/setup" 
              className={({isActive}) => `text-[15px] font-medium transition-colors ${isActive || location.pathname==='/' ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground pb-1"}`}
            >
              Setup
            </NavLink>
            <NavLink 
              to="/timetable" 
              className={({isActive}) => `text-[15px] font-medium transition-colors ${isActive ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground pb-1"}`}
            >
              Timetable
            </NavLink>
            <NavLink 
              to="/visualizer" 
              className={({isActive}) => `text-[15px] font-medium transition-colors ${isActive ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground pb-1"}`}
            >
              Visualizer
            </NavLink>
          </nav>
        </div>

        {/* Right Nav Icons */}
        <div className="flex items-center gap-3 text-foreground/80">
          <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <User size={20} />
          </button>
          <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden mt-4">
        <Outlet />
      </main>

    </div>
  );
}
