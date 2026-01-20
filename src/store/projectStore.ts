import { create } from 'zustand';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked' | 'delayed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type WeatherCondition = 'sunny' | 'rain' | 'storm';

export interface Task {
    id: string;
    title: string;
    location: string;
    type: 'indoor' | 'outdoor';
    status: TaskStatus;
    priority: TaskPriority;
    progress: number; // 0-100
    assignee?: string;
    sectionId?: string; // Linked section
}

export type SectionStatus = 'pending' | 'in-progress' | 'completed';

export interface ConstructionSection {
    id: string;
    name: string;
    description?: string;
    priority: number; // Lower = higher priority (1 is highest)
    status: SectionStatus;
    assignedOperators: number;
    linkedPlans: string[]; // IDs of linked plans
    createdBy: 'engineer' | 'manager';
    createdAt: Date;
}

export interface ProjectStore {
    // Project State
    tasks: Task[];
    sections: ConstructionSection[];
    weather: WeatherCondition;
    personnelCount: number;
    funds: {
        budget: number;
        spent: number;
        projected: number;
    };
    logs: { id: string; time: string; message: string; type: 'ai-alert' | 'update' | 'voice-log' }[];

    // Actions
    setWeather: (w: WeatherCondition) => void;
    togglePersonnelShortage: (isShort: boolean) => void;
    optimizeSchedule: () => void;
    addLog: (msg: string, type: 'ai-alert' | 'update' | 'voice-log') => void;

    // Section Actions
    addSection: (section: Omit<ConstructionSection, 'id' | 'createdAt'>) => void;
    updateSection: (id: string, updates: Partial<ConstructionSection>) => void;
    deleteSection: (id: string) => void;
    reorderSections: (sectionIds: string[]) => void;
    assignOperators: (sectionId: string, count: number) => void;
    linkPlanToSection: (sectionId: string, planId: string) => void;
    unlinkPlanFromSection: (sectionId: string, planId: string) => void;
}

// Mock Data
const INITIAL_TASKS: Task[] = [
    { id: '1', title: 'Cimentación Torre A', location: 'Sector Norte', type: 'outdoor', status: 'in-progress', priority: 'high', progress: 45, sectionId: 'sec-1' },
    { id: '2', title: 'Instalación Eléctrica P1', location: 'Torre B', type: 'indoor', status: 'pending', priority: 'medium', progress: 0, sectionId: 'sec-2' },
    { id: '3', title: 'Vaciado de Losa', location: 'Sector Sur', type: 'outdoor', status: 'pending', priority: 'critical', progress: 0, sectionId: 'sec-1' },
    { id: '4', title: 'Acabados Interiores', location: 'Oficinas', type: 'indoor', status: 'in-progress', priority: 'low', progress: 60, sectionId: 'sec-3' },
    { id: '5', title: 'Excavación Perimetral', location: 'Exterior', type: 'outdoor', status: 'pending', priority: 'medium', progress: 0 },
];

const INITIAL_SECTIONS: ConstructionSection[] = [
    { id: 'sec-1', name: 'Cimentación Zona A', description: 'Trabajos de cimentación y excavación en zona norte', priority: 1, status: 'in-progress', assignedOperators: 12, linkedPlans: ['1'], createdBy: 'engineer', createdAt: new Date('2026-01-15') },
    { id: 'sec-2', name: 'Instalaciones Eléctricas', description: 'Sistema eléctrico general del edificio', priority: 2, status: 'pending', assignedOperators: 6, linkedPlans: [], createdBy: 'engineer', createdAt: new Date('2026-01-16') },
    { id: 'sec-3', name: 'Acabados Torre B', description: 'Acabados interiores y pintura', priority: 3, status: 'in-progress', assignedOperators: 8, linkedPlans: ['3'], createdBy: 'engineer', createdAt: new Date('2026-01-17') },
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
    tasks: INITIAL_TASKS,
    sections: INITIAL_SECTIONS,
    weather: 'sunny',
    personnelCount: 45,
    funds: {
        budget: 1200000,
        spent: 450000,
        projected: 1150000,
    },
    logs: [
        { id: 'init-1', time: '08:00 AM', message: 'Sistema iniciado. Clima favorable.', type: 'update' },
        { id: 'init-2', time: '08:15 AM', message: 'Audio recibido (Jefe de Obra): "Material descargado en zona C."', type: 'voice-log' },
    ],

    setWeather: (w) => set({ weather: w }),

    togglePersonnelShortage: (isShort) => set({ personnelCount: isShort ? 20 : 45 }),

    addLog: (msg, type) => set(state => ({
        logs: [{ id: Math.random().toString(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: msg, type }, ...state.logs]
    })),

    optimizeSchedule: () => {
        const { weather, personnelCount, tasks, addLog } = get();
        let newTasks = [...tasks];
        let logMsg = "Optimización completada: ";

        // Weather Logic
        if (weather === 'rain' || weather === 'storm') {
            newTasks = newTasks.map(t => {
                if (t.type === 'outdoor' && t.status !== 'completed') {
                    return { ...t, status: 'blocked', priority: 'low' };
                }
                if (t.type === 'indoor' && t.status === 'pending') {
                    return { ...t, priority: 'high' }; // Move indoor up
                }
                return t;
            });
            logMsg += "Suspensión de tareas exteriores por lluvia. ";
            addLog("ALERTA CLIMÁTICA: Reorganizando cronograma por lluvia.", "ai-alert");
        } else {
            // Sunny Logic (Reset)
            newTasks = newTasks.map(t => {
                if (t.type === 'outdoor' && t.status === 'blocked') return { ...t, status: 'pending', priority: 'high' };
                return t;
            });
        }

        // Personnel Logic
        if (personnelCount < 30) {
            newTasks = newTasks.map(t => {
                if (t.priority !== 'critical') return { ...t, status: 'delayed' };
                return t;
            });
            logMsg += "Priorizando tareas críticas por falta de personal.";
            addLog("RECURSOS: Personal insuficiente detectado. Priorizando rutas críticas.", "ai-alert");
        }

        // Sort: Critical > High > Medium > Low
        const priorityWeight = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        newTasks.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

        set({ tasks: newTasks });
        addLog(logMsg, "update");
    },

    // Section CRUD Actions
    addSection: (section) => set(state => {
        const newSection: ConstructionSection = {
            ...section,
            id: `sec-${Date.now()}`,
            createdAt: new Date(),
        };
        return { sections: [...state.sections, newSection].sort((a, b) => a.priority - b.priority) };
    }),

    updateSection: (id, updates) => set(state => ({
        sections: state.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    })),

    deleteSection: (id) => set(state => ({
        sections: state.sections.filter(s => s.id !== id),
        tasks: state.tasks.map(t => t.sectionId === id ? { ...t, sectionId: undefined } : t)
    })),

    reorderSections: (sectionIds) => set(state => {
        const reordered = sectionIds.map((id, index) => {
            const section = state.sections.find(s => s.id === id);
            return section ? { ...section, priority: index + 1 } : null;
        }).filter(Boolean) as ConstructionSection[];
        return { sections: reordered };
    }),

    assignOperators: (sectionId, count) => set(state => ({
        sections: state.sections.map(s => s.id === sectionId ? { ...s, assignedOperators: count } : s)
    })),

    linkPlanToSection: (sectionId, planId) => set(state => ({
        sections: state.sections.map(s =>
            s.id === sectionId && !s.linkedPlans.includes(planId)
                ? { ...s, linkedPlans: [...s.linkedPlans, planId] }
                : s
        )
    })),

    unlinkPlanFromSection: (sectionId, planId) => set(state => ({
        sections: state.sections.map(s =>
            s.id === sectionId
                ? { ...s, linkedPlans: s.linkedPlans.filter(p => p !== planId) }
                : s
        )
    })),
}));
