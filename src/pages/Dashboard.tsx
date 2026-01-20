import { useProjectStore } from '../store/projectStore';
import { ModernCard } from '../components/Layout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Cloud, CloudRain, Users, DollarSign, Activity } from 'lucide-react';

const Dashboard = () => {
    const { funds, logs, weather, personnelCount, setWeather } = useProjectStore();

    const financeData = [
        { name: 'Gastado', value: funds.spent },
        { name: 'Disponible', value: funds.budget - funds.spent },
    ];
    const COLORS = ['#ef4444', '#3b82f6'];

    return (
        <div className="p-8 space-y-6 animate-fade-in text-white h-full overflow-y-auto">
            <header className="flex justify-between items-end pb-6 border-b border-slate-800">
                <div>
                    <h2 className="text-3xl font-light tracking-wide text-white">Panel de Control</h2>
                    <p className="text-slate-400">Resumen Ejecutivo - Proyecto Torre Alpha</p>
                </div>
                <div className="flex gap-4">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${weather === 'rain' ? 'bg-slate-800 border-blue-500/50' : 'bg-slate-800 border-amber-500/50'}`}>
                        {weather === 'rain' ? <CloudRain className="text-blue-400" /> : <Cloud className="text-amber-400" />}
                        <div className="flex flex-col">
                            <span className="text-xs uppercase text-slate-500 font-bold">Clima Actual</span>
                            <select
                                className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
                                value={weather}
                                onChange={(e) => setWeather(e.target.value as any)}
                            >
                                <option value="sunny">Soleado</option>
                                <option value="rain">Lluvia</option>
                                <option value="storm">Tormenta</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                        <Users className="text-emerald-400" />
                        <div className="flex flex-col">
                            <span className="text-xs uppercase text-slate-500 font-bold">Personal Activo</span>
                            <span className="text-sm font-bold text-white">{personnelCount} / 50</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* KPI Cards */}
                <ModernCard className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={100} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-slate-400 text-sm font-bold uppercase">Presupuesto Ejecutado</h3>
                        <p className="text-4xl font-mono font-light text-white mt-2">${funds.spent.toLocaleString()}</p>
                        <div className="w-full bg-slate-700 h-1 mt-4 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full" style={{ width: `${(funds.spent / funds.budget) * 100}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">de ${funds.budget.toLocaleString()} asignados</p>
                    </div>
                </ModernCard>

                <ModernCard>
                    <h3 className="text-slate-400 text-sm font-bold uppercase mb-4">Balance Financiero</h3>
                    <div className="h-40 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={financeData}
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {financeData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-slate-200">{(100 - (funds.spent / funds.budget) * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                    <p className="text-center text-xs text-slate-500 -mt-2">Disponible</p>
                </ModernCard>

                <ModernCard className="bg-slate-900/80 border-amber-500/20">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="text-amber-500 animate-pulse" size={18} />
                        <h3 className="text-amber-500 text-sm font-bold uppercase tracking-wider">Live Feed (WhatsApp AI)</h3>
                    </div>
                    <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {logs.map((log) => (
                            <div key={log.id} className={`p-3 rounded-lg border-l-2 text-sm ${log.type === 'ai-alert' ? 'bg-red-500/10 border-red-500 text-red-200' : 'bg-slate-800/50 border-blue-500 text-slate-300'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs opacity-50 font-mono">{log.time}</span>
                                    {log.type === 'ai-alert' && <span className="text-[10px] bg-red-500 text-white px-1 rounded">ALERTA</span>}
                                </div>
                                <p>{log.message}</p>
                            </div>
                        ))}
                    </div>
                </ModernCard>
            </div>

            <div className="grid grid-cols-2 gap-6 h-64">
                <ModernCard title="Eficiencia Semanal">
                    <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                        Gráfico de histórico de rendimiento (Simulado)
                    </div>
                </ModernCard>
                <ModernCard title="Distribución de Recursos">
                    <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                        Mapa de calor de personal (Simulado)
                    </div>
                </ModernCard>
            </div>
        </div>
    );
};

export default Dashboard;
