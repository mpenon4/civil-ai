import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Building2, MapPin, Users, Cloud, Copy, Check, QrCode, Share2 } from 'lucide-react';
import { supabase, getCurrentUser, generateProjectCode } from '../lib/supabase';
import { getStaticMapUrl } from '../services/weatherService';

interface Project {
    id: string;
    name: string;
    location_city: string;
    location_lat?: number;
    location_lng?: number;
    status: string;
    invite_code: string;
    progress?: number;
    budget?: number;
}

// Mock projects for demo (when DB is empty)
const MOCK_PROJECTS: Project[] = [
    {
        id: '1',
        name: 'Torre Residencial Alpha',
        location_city: 'Buenos Aires, AR',
        location_lat: -34.6037,
        location_lng: -58.3816,
        status: 'active',
        invite_code: 'ALPHA1',
        progress: 45,
        budget: 1200000,
    },
    {
        id: '2',
        name: 'Centro Comercial Beta',
        location_city: 'Córdoba, AR',
        location_lat: -31.4201,
        location_lng: -64.1888,
        status: 'delayed',
        invite_code: 'BETA22',
        progress: 12,
        budget: 4500000,
    },
    {
        id: '3',
        name: 'Puente Industrial Gamma',
        location_city: 'Rosario, AR',
        location_lat: -32.9468,
        location_lng: -60.6393,
        status: 'active',
        invite_code: 'GAMMA3',
        progress: 78,
        budget: 8000000,
    },
];

const ProjectHub = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [userName, setUserName] = useState('Ingeniero');
    const [showCodeModal, setShowCodeModal] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadUser();
        loadProjects();
    }, []);

    async function loadUser() {
        const user = await getCurrentUser();
        if (user?.user_metadata?.full_name) {
            setUserName(user.user_metadata.full_name);
        }
    }

    async function loadProjects() {
        try {
            const user = await getCurrentUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('owner_id', user.id);

            if (!error && data && data.length > 0) {
                setProjects(data);
            }
        } catch (e) {
            // Use mock data if DB fails
            console.log('Using mock projects');
        }
    }

    const copyCode = async (code: string) => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const statusColors: Record<string, string> = {
        active: 'bg-emerald-500',
        delayed: 'bg-amber-500',
        completed: 'bg-blue-500',
    };

    const statusLabels: Record<string, string> = {
        active: 'EN EJECUCIÓN',
        delayed: 'RETRASADO',
        completed: 'COMPLETADO',
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-light text-white tracking-wide">Mis Proyectos</h1>
                    <p className="text-slate-400 mt-1">Bienvenido, {userName}</p>
                </div>
                <button
                    onClick={() => navigate('/schedule')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Nuevo Proyecto
                </button>
            </header>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all group"
                    >
                        {/* Map Preview */}
                        <div className="h-32 relative">
                            <img
                                src={getStaticMapUrl(project.location_lat || 0, project.location_lng || 0, 13)}
                                alt="Map"
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

                            {/* Status Badge */}
                            <div className="absolute top-3 left-3">
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${statusColors[project.status]} text-white`}>
                                    {statusLabels[project.status]}
                                </span>
                            </div>

                            {/* Share Code Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowCodeModal(project.id); }}
                                className="absolute top-3 right-3 p-2 bg-slate-800/80 backdrop-blur rounded-lg text-white hover:bg-amber-500 transition-colors"
                                title="Compartir código de obra"
                            >
                                <Share2 size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-white mb-1">{project.name}</h3>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                                <MapPin size={14} />
                                <span>{project.location_city}</span>
                            </div>

                            {/* Progress */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>Avance</span>
                                    <span>{project.progress || 0}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                                        style={{ width: `${project.progress || 0}%` }}
                                    />
                                </div>
                            </div>

                            {/* Invite Code */}
                            <div className="flex items-center justify-between bg-slate-800 rounded-lg p-3 mb-4">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Código de Obra</p>
                                    <p className="text-lg font-mono font-bold text-amber-500 tracking-wider">{project.invite_code}</p>
                                </div>
                                <button
                                    onClick={() => copyCode(project.invite_code)}
                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} className="text-slate-400" />}
                                </button>
                            </div>

                            {/* Enter Button */}
                            <Link
                                to="/dashboard"
                                className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-2.5 rounded-lg transition-all"
                            >
                                Gestionar Proyecto
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Share Code Modal */}
            {showCodeModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <QrCode className="text-amber-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Código de Obra</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Compartí este código con tus operadores para que se registren y accedan al proyecto.
                        </p>

                        <div className="bg-slate-800 rounded-xl p-4 mb-4">
                            <p className="text-3xl font-mono font-bold text-amber-500 tracking-[0.3em]">
                                {projects.find(p => p.id === showCodeModal)?.invite_code}
                            </p>
                        </div>

                        <button
                            onClick={() => copyCode(projects.find(p => p.id === showCodeModal)?.invite_code || '')}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-lg mb-2 flex items-center justify-center gap-2"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Copiado!' : 'Copiar Código'}
                        </button>
                        <button
                            onClick={() => setShowCodeModal(null)}
                            className="w-full text-slate-500 hover:text-white py-2 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectHub;
