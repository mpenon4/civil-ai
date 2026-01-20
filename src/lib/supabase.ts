// Supabase Configuration
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cxxaveycmpsiagmvnysz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eGF2ZXljbXBzaWFnbXZueXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NzY5NDgsImV4cCI6MjA4NDQ1Mjk0OH0.n84-L5zoZ4Kv6qV0lCtwaO2mdn8YkljRQ8fz3naSqRc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== AUTH FUNCTIONS ====================

export async function signUpEngineer(email: string, password: string, fullName: string) {
    // Register as engineer (admin role)
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                role: 'engineer',
                full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/hub`
        }
    });
    if (error) throw error;
    return data;
}

export async function signUpOperator(email: string, password: string, fullName: string, projectCode: string) {
    // Verify project code exists
    const { data: project, error: codeError } = await supabase
        .from('projects')
        .select('id, name')
        .eq('invite_code', projectCode.toUpperCase())
        .single();

    if (codeError || !project) {
        throw new Error('Código de obra inválido o expirado');
    }

    // Register as operator
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                role: 'operator',
                full_name: fullName,
                assigned_project_id: project.id,
                assigned_project_name: project.name,
            },
            emailRedirectTo: `${window.location.origin}/operator`
        }
    });
    if (error) throw error;
    return data;
}

export async function signUpContractor(email: string, password: string, fullName: string, companyName: string) {
    // Register as contractor (company owner/manager role)
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                role: 'contractor',
                full_name: fullName,
                company_name: companyName,
            },
            emailRedirectTo: `${window.location.origin}/hub`
        }
    });
    if (error) throw error;
    return data;
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
    });
    if (error) throw error;
}

// ==================== PROJECT CODE FUNCTIONS ====================

export function generateProjectCode(): string {
    // Generate a 6-character alphanumeric code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 1, 0 to avoid confusion
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export async function createProjectWithCode(name: string, city: string, ownerId: string) {
    const inviteCode = generateProjectCode();

    const { data, error } = await supabase
        .from('projects')
        .insert({
            name,
            location_city: city,
            invite_code: inviteCode,
            owner_id: ownerId,
            status: 'active',
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getProjectByCode(code: string) {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('invite_code', code.toUpperCase())
        .single();

    if (error) throw error;
    return data;
}

// ==================== DATABASE TYPES ====================

export interface Project {
    id: string;
    name: string;
    location_city: string;
    location_lat?: number;
    location_lng?: number;
    budget?: number;
    spent?: number;
    status: 'active' | 'delayed' | 'completed';
    invite_code: string;
    owner_id: string;
    created_at: string;
}

export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: 'engineer' | 'operator' | 'contractor';
    company_name?: string;
    assigned_project_id?: string;
    created_at: string;
}
