import { useState } from 'react';
import { useProjectStore, type ConstructionSection, type SectionStatus } from '../store/projectStore';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    Plus,
    GripVertical,
    Users,
    FileStack,
    Edit2,
    Trash2,
    X,
    Check,
    ChevronDown,
    ChevronUp,
    FolderKanban,
    AlertCircle
} from 'lucide-react';

const SectionsManager = () => {
    const { sections, addSection, updateSection, deleteSection, reorderSections, assignOperators } = useProjectStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<ConstructionSection | null>(null);
    const [orderedSections, setOrderedSections] = useState(sections);

    // Sync local state with store when sections change
    const syncedSections = sections.sort((a, b) => a.priority - b.priority);

    const handleReorder = (newOrder: ConstructionSection[]) => {
        setOrderedSections(newOrder);
    };

    const handleReorderComplete = () => {
        reorderSections(orderedSections.map(s => s.id));
    };

    const openCreateModal = () => {
        setEditingSection(null);
        setIsModalOpen(true);
    };

    const openEditModal = (section: ConstructionSection) => {
        setEditingSection(section);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Eliminar esta sección? Las tareas asociadas quedarán sin sección.')) {
            deleteSection(id);
        }
    };

    const getStatusColor = (status: SectionStatus) => {
        switch (status) {
            case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'in-progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    const getStatusLabel = (status: SectionStatus) => {
        switch (status) {
            case 'completed': return 'Completada';
            case 'in-progress': return 'En Progreso';
            default: return 'Pendiente';
        }
    };

    return (
        <div className="p-8 space-y-6 h-full overflow-y-auto text-white">
            {/* Header */}
            <header className="flex justify-between items-center pb-6 border-b border-slate-800">
                <div>
                    <h2 className="text-3xl font-light tracking-wide text-white flex items-center gap-3">
                        <FolderKanban className="text-amber-500" />
                        Secciones de Construcción
                    </h2>
                    <p className="text-slate-400">Organiza y prioriza las áreas de trabajo</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/30 active:scale-95"
                >
                    <Plus size={20} />
                    <span>Nueva Sección</span>
                </button>
            </header>

            {/* Instructions */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="text-blue-400" size={20} />
                <p className="text-slate-400 text-sm">
                    <span className="text-blue-400 font-medium">Tip:</span> Arrastra las secciones para cambiar su prioridad. La sección superior tiene mayor prioridad.
                </p>
            </div>

            {/* Sections List */}
            <Reorder.Group
                axis="y"
                values={syncedSections}
                onReorder={handleReorder}
                className="space-y-4"
            >
                <AnimatePresence>
                    {syncedSections.map((section, index) => (
                        <SectionCard
                            key={section.id}
                            section={section}
                            index={index}
                            onEdit={() => openEditModal(section)}
                            onDelete={() => handleDelete(section.id)}
                            onAssignOperators={(count) => assignOperators(section.id, count)}
                            getStatusColor={getStatusColor}
                            getStatusLabel={getStatusLabel}
                        />
                    ))}
                </AnimatePresence>
            </Reorder.Group>

            {sections.length === 0 && (
                <div className="text-center py-16">
                    <FolderKanban className="mx-auto text-slate-600 mb-4" size={64} />
                    <h3 className="text-xl text-slate-500 mb-2">No hay secciones</h3>
                    <p className="text-slate-600">Crea tu primera sección para organizar el proyecto</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <SectionModal
                        section={editingSection}
                        onClose={() => setIsModalOpen(false)}
                        onSave={(data) => {
                            if (editingSection) {
                                updateSection(editingSection.id, data);
                            } else {
                                addSection({
                                    ...data,
                                    priority: sections.length + 1,
                                    linkedPlans: [],
                                    createdBy: 'engineer',
                                });
                            }
                            setIsModalOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Section Card Component
interface SectionCardProps {
    section: ConstructionSection;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
    onAssignOperators: (count: number) => void;
    getStatusColor: (status: SectionStatus) => string;
    getStatusLabel: (status: SectionStatus) => string;
}

const SectionCard = ({ section, index, onEdit, onDelete, onAssignOperators, getStatusColor, getStatusLabel }: SectionCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [operatorInput, setOperatorInput] = useState(section.assignedOperators.toString());

    const handleOperatorChange = () => {
        const count = parseInt(operatorInput) || 0;
        onAssignOperators(count);
    };

    return (
        <Reorder.Item
            value={section}
            id={section.id}
            className="cursor-grab active:cursor-grabbing"
        >
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-600 transition-colors"
            >
                {/* Main Content */}
                <div className="p-5">
                    <div className="flex items-start gap-4">
                        {/* Drag Handle & Priority */}
                        <div className="flex flex-col items-center gap-2">
                            <GripVertical className="text-slate-600 hover:text-slate-400 transition-colors" size={20} />
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {index + 1}
                            </div>
                        </div>

                        {/* Section Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold text-white truncate">{section.name}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(section.status)}`}>
                                    {getStatusLabel(section.status)}
                                </span>
                            </div>
                            {section.description && (
                                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{section.description}</p>
                            )}

                            {/* Stats Row */}
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Users size={16} className="text-blue-400" />
                                    <span>{section.assignedOperators} operarios</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <FileStack size={16} className="text-purple-400" />
                                    <span>{section.linkedPlans.length} planos</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onEdit}
                                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-2 rounded-lg bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                            >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-slate-700 bg-slate-900/50"
                        >
                            <div className="p-5 space-y-4">
                                {/* Manager: Assign Operators */}
                                <div className="bg-slate-800 rounded-xl p-4">
                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Asignar Operarios (Manager)
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            min="0"
                                            value={operatorInput}
                                            onChange={(e) => setOperatorInput(e.target.value)}
                                            className="w-24 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                                        />
                                        <button
                                            onClick={handleOperatorChange}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Actualizar
                                        </button>
                                    </div>
                                </div>

                                {/* Linked Plans */}
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-2">Planos Vinculados</h4>
                                    {section.linkedPlans.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {section.linkedPlans.map(planId => (
                                                <span key={planId} className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-lg text-sm border border-purple-700/30">
                                                    Plano #{planId}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 text-sm">Sin planos vinculados. Ve a "Planos & 3D" para vincular.</p>
                                    )}
                                </div>

                                {/* Metadata */}
                                <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-500">
                                    <span>Creado por: {section.createdBy === 'engineer' ? 'Ingeniero' : 'Manager'}</span>
                                    <span>Fecha: {new Date(section.createdAt).toLocaleDateString('es-ES')}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Reorder.Item>
    );
};

// Modal Component
interface SectionModalProps {
    section: ConstructionSection | null;
    onClose: () => void;
    onSave: (data: { name: string; description?: string; status: SectionStatus; assignedOperators: number }) => void;
}

const SectionModal = ({ section, onClose, onSave }: SectionModalProps) => {
    const [name, setName] = useState(section?.name || '');
    const [description, setDescription] = useState(section?.description || '');
    const [status, setStatus] = useState<SectionStatus>(section?.status || 'pending');
    const [operators, setOperators] = useState(section?.assignedOperators.toString() || '0');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({
            name: name.trim(),
            description: description.trim() || undefined,
            status,
            assignedOperators: parseInt(operators) || 0,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h3 className="text-xl font-semibold text-white">
                        {section ? 'Editar Sección' : 'Nueva Sección'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <X className="text-slate-400" size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Nombre de la Sección *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Cimentación Bloque A"
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Descripción (opcional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe el alcance de esta sección..."
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Estado
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as SectionStatus)}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                            >
                                <option value="pending">Pendiente</option>
                                <option value="in-progress">En Progreso</option>
                                <option value="completed">Completada</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Operarios Asignados
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={operators}
                                onChange={(e) => setOperators(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/30"
                        >
                            <Check size={18} />
                            {section ? 'Guardar Cambios' : 'Crear Sección'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default SectionsManager;
