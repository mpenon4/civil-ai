import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarClock, MessageSquareText, HardHat, TrendingUp, Layers, FolderKanban } from 'lucide-react';

export const Sidebar = (_props: { activeView: string, setView: (v: string) => void }) => {
    const items = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Control Panel', path: '/dashboard' },
        { id: 'schedule', icon: CalendarClock, label: 'Smart Schedule', path: '/schedule' },
        { id: 'sections', icon: FolderKanban, label: 'Secciones', path: '/sections' },
        { id: 'plans', icon: Layers, label: 'Planos & 3D', path: '/plans' },
        { id: 'funds', icon: TrendingUp, label: 'Finanzas', path: '/funds' },
        { id: 'comms', icon: MessageSquareText, label: 'Live Data', path: '/comms' },
    ];

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-20 shadow-2xl">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <HardHat className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="font-bold text-white tracking-tight">ProBuild</h1>
                    <p className="text-xs text-slate-500">Manager Pro v2.0</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {items.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive
                                ? 'bg-slate-800 text-white shadow-inner border-l-4 border-amber-500'
                                : 'hover:bg-slate-800/50 hover:text-white'
                            }`}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} className={isActive ? 'text-amber-500' : 'text-slate-500 group-hover:text-slate-300'} />
                                <span className="font-medium text-sm">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 bg-slate-950/50 m-4 rounded-xl border border-slate-800/50">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Estado del Sistema</h4>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-green-400">IA Activa</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-xs text-blue-400">Sync: WhatsApp</span>
                </div>
            </div>
        </aside>
    );
};

export const ModernCard = ({ children, title, className = '' }: { children: React.ReactNode, title?: string, className?: string }) => (
    <div className={`bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl ${className}`}>
        {title && <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">{title}</h3>}
        {children}
    </div>
);
