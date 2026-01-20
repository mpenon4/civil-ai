import { useProjectStore } from '../store/projectStore';
import { Clock, MapPin, CheckCircle, AlertTriangle, HardHat, CloudSun, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mobile-optimized view for field workers
// No voice recording - that comes via WhatsApp externally

const OperatorView = () => {
    const { tasks } = useProjectStore();
    const navigate = useNavigate();

    const todayTasks = tasks.filter(t => t.status !== 'completed');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <header className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 sticky top-0 z-10 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <HardHat size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">T<span className="text-amber-500">AI</span>SK</h1>
                            <p className="text-xs text-slate-400">Operador de Campo</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full">
                        <CloudSun size={16} className="text-amber-400" />
                        <span className="text-sm font-medium">28°C</span>
                    </div>
                </div>

                {/* Site Info */}
                <div className="mt-4 bg-slate-800/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} className="text-amber-500" />
                        <span className="font-medium">Torre Residencial Alpha</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Buenos Aires, AR • Sector Norte</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 pb-24">
                {/* Today's Tasks */}
                <section className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Clock size={18} className="text-amber-500" />
                            Tareas de Hoy
                        </h2>
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
                            {todayTasks.length} pendientes
                        </span>
                    </div>

                    <div className="space-y-3">
                        {todayTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`bg-slate-900 rounded-xl p-4 border-l-4 ${task.priority === 'critical' ? 'border-purple-500' :
                                    task.priority === 'high' ? 'border-red-500' :
                                        task.status === 'blocked' ? 'border-slate-600' : 'border-blue-500'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${task.type === 'outdoor' ? 'bg-cyan-900 text-cyan-300' : 'bg-indigo-900 text-indigo-300'
                                            }`}>
                                            {task.type === 'outdoor' ? 'Exterior' : 'Interior'}
                                        </span>
                                        {task.status === 'blocked' && (
                                            <span className="ml-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-900 text-red-300">
                                                Bloqueada
                                            </span>
                                        )}
                                    </div>
                                    {task.priority === 'critical' && (
                                        <AlertTriangle size={16} className="text-purple-400" />
                                    )}
                                </div>

                                <h3 className="font-bold text-lg">{task.title}</h3>
                                <p className="text-sm text-slate-400 mb-3">{task.location}</p>

                                {/* Progress Bar */}
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                                            style={{ width: `${task.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-mono">{task.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Completed Today */}
                {completedTasks.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
                            <CheckCircle size={18} className="text-emerald-500" />
                            Completadas
                        </h2>
                        <div className="space-y-2">
                            {completedTasks.map((task) => (
                                <div key={task.id} className="bg-slate-900/50 rounded-xl p-3 opacity-60">
                                    <p className="font-medium line-through">{task.title}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-2 flex justify-around">
                <button className="flex flex-col items-center p-2 text-amber-500">
                    <Clock size={20} />
                    <span className="text-[10px] mt-1">Tareas</span>
                </button>
                <button
                    onClick={() => navigate('/plans')}
                    className="flex flex-col items-center p-2 text-slate-500 hover:text-white"
                >
                    <Layers size={20} />
                    <span className="text-[10px] mt-1">Planos</span>
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="flex flex-col items-center p-2 text-slate-500 hover:text-white"
                >
                    <HardHat size={20} />
                    <span className="text-[10px] mt-1">Salir</span>
                </button>
            </nav>
        </div>
    );
};

export default OperatorView;
