import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, ExternalLink, RefreshCw } from 'lucide-react';
import { ModernCard } from '../components/Layout';

// For Google Sheets embed, the sheet must be published to web
// Go to Sheets → File → Share → Publish to Web → Select "Web page" → Copy embed URL

const Finances = () => {
    const [sheetUrl, setSheetUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Default embed URL (your sheet when published)
    const defaultSheetEmbed = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQExample/pubhtml?widget=true&headers=false';

    // Mock financial data
    const stats = [
        { label: 'Presupuesto Total', value: '$1,200,000', change: '+0%', icon: PieChart, color: 'text-blue-400' },
        { label: 'Ejecutado', value: '$450,000', change: '37.5%', icon: TrendingUp, color: 'text-emerald-400' },
        { label: 'Disponible', value: '$750,000', change: '62.5%', icon: DollarSign, color: 'text-amber-400' },
        { label: 'Sobrecostos', value: '$12,500', change: '+2.8%', icon: TrendingDown, color: 'text-red-400' },
    ];

    return (
        <div className="p-8 space-y-6 text-white h-full overflow-y-auto">
            <header className="flex justify-between items-center pb-6 border-b border-slate-800">
                <div>
                    <h2 className="text-3xl font-light tracking-wide">Control Financiero</h2>
                    <p className="text-slate-400">Torre Residencial Alpha - Sincronizado con Google Sheets</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">
                    <RefreshCw size={16} />
                    Actualizar
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <ModernCard key={i} className="relative overflow-hidden">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">{stat.label}</p>
                                <p className="text-2xl font-mono font-light">{stat.value}</p>
                                <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
                            </div>
                            <stat.icon className={`${stat.color} opacity-50`} size={24} />
                        </div>
                    </ModernCard>
                ))}
            </div>

            {/* Embedded Google Sheet */}
            <ModernCard className="!p-0 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="text-sm font-bold uppercase text-slate-400 flex items-center gap-2">
                        <img src="https://www.google.com/images/about/sheets-icon.svg" alt="Sheets" className="w-5 h-5" />
                        Planilla de Costos (Google Sheets)
                    </h3>
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <input
                                type="text"
                                placeholder="Pegar URL del Sheet publicado..."
                                value={sheetUrl}
                                onChange={(e) => setSheetUrl(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-sm w-64 focus:border-amber-500 focus:outline-none"
                            />
                        ) : null}
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-xs text-slate-500 hover:text-white transition-colors"
                        >
                            {isEditing ? 'Cerrar' : 'Cambiar Sheet'}
                        </button>
                        <a
                            href={sheetUrl || defaultSheetEmbed}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-white"
                        >
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>

                {/* Sheet Embed */}
                <div className="bg-white" style={{ height: '500px' }}>
                    {sheetUrl ? (
                        <iframe
                            src={sheetUrl}
                            className="w-full h-full border-0"
                            title="Google Sheet Financiero"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400">
                            <img src="https://www.google.com/images/about/sheets-icon.svg" alt="Sheets" className="w-16 h-16 opacity-30 mb-4" />
                            <p className="text-lg font-medium mb-2">Conectar Google Sheet</p>
                            <p className="text-sm text-slate-500 max-w-md text-center mb-4">
                                Para ver tu planilla aquí, primero publícala en la web:
                                <br />
                                <strong>Archivo → Compartir → Publicar en la web</strong>
                            </p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-amber-400 transition-colors"
                            >
                                Agregar URL del Sheet
                            </button>
                        </div>
                    )}
                </div>
            </ModernCard>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
                <button className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left transition-colors">
                    <TrendingUp className="text-emerald-400 mb-2" size={24} />
                    <p className="font-medium">Registrar Gasto</p>
                    <p className="text-xs text-slate-500">Agregar nuevo costo</p>
                </button>
                <button className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left transition-colors">
                    <PieChart className="text-blue-400 mb-2" size={24} />
                    <p className="font-medium">Generar Reporte</p>
                    <p className="text-xs text-slate-500">Exportar a PDF</p>
                </button>
                <button className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left transition-colors">
                    <DollarSign className="text-amber-400 mb-2" size={24} />
                    <p className="font-medium">Proyecciones</p>
                    <p className="text-xs text-slate-500">Ver estimados</p>
                </button>
            </div>
        </div>
    );
};

export default Finances;
