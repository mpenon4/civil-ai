import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, getCurrentUser } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    userRole: 'engineer' | 'operator' | null;
    assignedProjectId: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    userRole: null,
    assignedProjectId: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check current session
        getCurrentUser().then((user) => {
            setUser(user);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const userRole = user?.user_metadata?.role as 'engineer' | 'operator' | null;
    const assignedProjectId = user?.user_metadata?.assigned_project_id || null;

    return (
        <AuthContext.Provider value={{ user, loading, userRole, assignedProjectId }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

// Route protection component
export function RequireAuth({
    children,
    allowedRoles
}: {
    children: ReactNode;
    allowedRoles?: ('engineer' | 'operator')[]
}) {
    const { user, loading, userRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Not logged in, redirect to login
                navigate('/', { replace: true });
            } else if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
                // Logged in but wrong role
                if (userRole === 'operator') {
                    navigate('/operator', { replace: true });
                } else {
                    navigate('/hub', { replace: true });
                }
            }
        }
    }, [user, loading, userRole, allowedRoles, navigate, location]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        return null;
    }

    return <>{children}</>;
}
