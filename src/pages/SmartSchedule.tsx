
import { useProjectStore, type Task } from '../store/projectStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Umbrella, Users, Zap, AlertTriangle, CloudRain, Briefcase } from 'lucide-react';

const SmartSchedule = () => {
    const { tasks, weather, personnelCount, togglePersonnelShortage, optimizeSchedule } = useProjectStore();

    const outdoorTasks = tasks.filter(t => t.type === 'outdoor');
    const indoorTasks = tasks.filter(t => t.type === 'indoor');

    return (
        <div className="p-8 space-y-6 h-full overflow-y-auto text-white">
            <header className="flex justify-between items-center pb-6 border-b border-slate-800">
                <div>
                    <h2 className="text-3xl font-light tracking-wide text-white">Planificación Inteligente</h2>
                    <p className="text-slate-400">Motor de Optimización AI v4.0</p>
                </div>
                <button
                    onClick={optimizeSchedule}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/30 active:scale-95"
                >
                    <Zap size={20} className="fill-white" />
                    <span className="hidden md:inline">OPTIMIZAR CRONOGRAMA</span>
                </button>
            </header>

            {/* Control Panel */}
            <div className="flex gap-4 p-4 bg-slate-900/50 border border-slate-700 rounded-2xl">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors cursor-pointer ${weather === 'rain' ? 'bg-blue-900/30 border-blue-500' : 'bg-slate-800 border-slate-700'}`}>
                    {weather === 'rain' ? <CloudRain className="text-blue-400" /> : <Umbrella className="text-slate-500" />}
                    <div>
                        <span className="block text-xs text-slate-400 uppercase font-bold">Simulación Clima</span>
                        <span className={`font-bold ${weather === 'rain' ? 'text-blue-300' : 'text-slate-300'}`}>
                            {weather === 'rain' ? 'Lluvia Activa' : 'Normal'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => togglePersonnelShortage(personnelCount > 30)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${personnelCount < 30 ? 'bg-red-900/30 border-red-500' : 'bg-slate-800 border-slate-700'}`}
                >
                    <Users className={personnelCount < 30 ? 'text-red-400' : 'text-slate-500'} />
                    <div className="text-left">
                        <span className="block text-xs text-slate-400 uppercase font-bold">Personal</span>
                        <span className={`font-bold ${personnelCount < 30 ? 'text-red-300' : 'text-slate-300'}`}>
                            {personnelCount < 30 ? 'Escasez Crítica' : 'Completo'}
                        </span>
                    </div>
                </button>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TaskColumn title="Pendientes (Prioridad)" tasks={tasks.filter(t => t.status === 'pending')} />
                <TaskColumn title="En Progreso" tasks={tasks.filter(t => t.status === 'in-progress')} />

                {/* Blocked/Delayed Column */}
                <div className="bg-slate-900/30 border border-red-900/30 rounded-2xl p-4">
                    <h3 className="text-red-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-red-900/30 pb-2 flex items-center justify-between">
                        <span>Bloqueadas / Retrasadas</span>
                        <AlertTriangle size={16} />
                    </h3>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {tasks.filter(t => t.status === 'blocked' || t.status === 'delayed').map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </AnimatePresence>
                        {tasks.filter(t => t.status === 'blocked' || t.status === 'delayed').length === 0 && (
                            <p className="text-slate-600 text-center text-sm py-4">No hay tareas bloqueadas.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TaskColumn = ({ title, tasks }: { title: string, tasks: Task[] }) => (
    <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4">
        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">{title}</h3>
        <div className="space-y-3">
            <AnimatePresence>
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </AnimatePresence>
        </div>
    </div>
);

const TaskCard = ({ task }: { task: Task }) => {
    const priorityColor = {
        'critical': 'border-r-4 border-r-purple-500',
        'high': 'border-r-4 border-r-red-500',
        'medium': 'border-r-4 border-r-blue-500',
        'low': 'border-r-4 border-r-slate-500'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`bg-slate-700 p-4 rounded-xl shadow-lg hover:bg-slate-600 transition-colors cursor-grab active:cursor-grabbing group ${priorityColor[task.priority]}`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${task.type === 'outdoor' ? 'bg-cyan-900 text-cyan-200' : 'bg-indigo-900 text-indigo-200'
                    }`}>
                    {task.type}
                </span>
                {task.priority === 'critical' && <Zap size={14} className="text-purple-400 fill-purple-400 animate-pulse" />}
            </div>
            <h4 className="font-bold text-white leading-tight">{task.title}</h4>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><Briefcase size={12} /> {task.location}</span>
                <span>{task.progress}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full" style={{ width: `${task.progress}%` }}></div>
            </div>
        </motion.div>
    );
}

export default SmartSchedule;
