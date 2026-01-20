import { useState, useRef } from 'react';
import { Layers, Maximize2, ZoomIn, ZoomOut, Download, Box, ChevronLeft, ChevronRight, Plus, Upload, X, FolderOpen, FileText, Trash2 } from 'lucide-react';

// Types
interface FileItem {
    id: string;
    title: string;
    url: string;
    type: 'render' | 'blueprint';
    section: string;
    fileName: string;
    uploadedAt: Date;
}

interface Section {
    id: string;
    name: string;
}

// Default sections
const DEFAULT_SECTIONS: Section[] = [
    { id: 'estructural', name: 'Estructural' },
    { id: 'electrico', name: 'Eléctrico' },
    { id: 'sanitario', name: 'Sanitario' },
    { id: 'arquitectura', name: 'Arquitectura' },
    { id: 'exterior', name: 'Exterior' },
];

// Sample data (will be replaced by uploaded files)
const SAMPLE_ITEMS: FileItem[] = [
    { id: '1', title: 'Vista Exterior - Fachada Norte', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80', type: 'render', section: 'exterior', fileName: 'fachada_norte.jpg', uploadedAt: new Date() },
    { id: '2', title: 'Vista Aérea - Complejo', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80', type: 'render', section: 'exterior', fileName: 'vista_aerea.jpg', uploadedAt: new Date() },
    { id: '3', title: 'Planta Baja - Distribución', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=80', type: 'blueprint', section: 'arquitectura', fileName: 'planta_baja.pdf', uploadedAt: new Date() },
];

const PlansViewer = () => {
    const [activeTab, setActiveTab] = useState<'render' | 'blueprint'>('render');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [items, setItems] = useState<FileItem[]>(SAMPLE_ITEMS);
    const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
    const [selectedSection, setSelectedSection] = useState<string>('all');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showAddSection, setShowAddSection] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');

    // Upload modal state
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadSection, setUploadSection] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadPreview, setUploadPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter items
    const filteredItems = items.filter(item => {
        const matchesType = item.type === activeTab;
        const matchesSection = selectedSection === 'all' || item.section === selectedSection;
        return matchesType && matchesSection;
    });

    const currentItem = filteredItems[currentIndex];

    const nextSlide = () => setCurrentIndex((i) => (i + 1) % Math.max(filteredItems.length, 1));
    const prevSlide = () => setCurrentIndex((i) => (i - 1 + filteredItems.length) % Math.max(filteredItems.length, 1));

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadFile(file);

            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setUploadPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setUploadPreview('');
            }
        }
    };

    // Handle upload
    const handleUpload = () => {
        if (!uploadFile || !uploadTitle || !uploadSection) return;

        // Create object URL for local preview (in production, upload to Supabase Storage)
        const url = URL.createObjectURL(uploadFile);

        const newItem: FileItem = {
            id: Date.now().toString(),
            title: uploadTitle,
            url: url,
            type: activeTab,
            section: uploadSection,
            fileName: uploadFile.name,
            uploadedAt: new Date(),
        };

        setItems([...items, newItem]);

        // Reset modal
        setShowUploadModal(false);
        setUploadTitle('');
        setUploadSection('');
        setUploadFile(null);
        setUploadPreview('');

        // Switch to the new item
        setSelectedSection(uploadSection);
        setCurrentIndex(filteredItems.length);
    };

    // Handle delete
    const handleDelete = (id: string) => {
        setItems(items.filter(item => item.id !== id));
        if (currentIndex >= filteredItems.length - 1) {
            setCurrentIndex(Math.max(0, currentIndex - 1));
        }
    };

    // Add new section
    const handleAddSection = () => {
        if (!newSectionName.trim()) return;
        const id = newSectionName.toLowerCase().replace(/\s+/g, '-');
        setSections([...sections, { id, name: newSectionName }]);
        setNewSectionName('');
        setShowAddSection(false);
    };

    // Get accepted file types
    const getAcceptedTypes = () => {
        if (activeTab === 'render') {
            return 'image/*';
        } else {
            return 'image/*,.pdf,.dwg,.dxf';
        }
    };

    return (
        <div className="p-8 text-white h-full flex flex-col">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-light tracking-wide text-white">Visualización y Planos</h2>
                    <p className="text-slate-400">Torre Residencial Alpha - Gestión de Documentos</p>
                </div>

                {/* Type Tabs */}
                <div className="flex gap-2">
                    <div className="flex bg-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => { setActiveTab('render'); setCurrentIndex(0); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'render' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                        >
                            <span className="flex items-center gap-2"><Box size={16} /> Renders 3D</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('blueprint'); setCurrentIndex(0); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'blueprint' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                        >
                            <span className="flex items-center gap-2"><Layers size={16} /> Planos</span>
                        </button>
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <Plus size={18} /> Agregar {activeTab === 'render' ? 'Render' : 'Plano'}
                    </button>
                </div>
            </header>

            {/* Section Filter */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                <button
                    onClick={() => { setSelectedSection('all'); setCurrentIndex(0); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedSection === 'all' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                >
                    Todos
                </button>
                {sections.map(section => (
                    <button
                        key={section.id}
                        onClick={() => { setSelectedSection(section.id); setCurrentIndex(0); }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedSection === section.id ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                    >
                        {section.name}
                    </button>
                ))}
                <button
                    onClick={() => setShowAddSection(true)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-500 hover:text-white border border-dashed border-slate-700 hover:border-slate-500 transition-colors"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Main Viewer */}
            {filteredItems.length > 0 ? (
                <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative group">
                    {/* Toolbar */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                        <button className="p-3 bg-slate-800/80 backdrop-blur text-white rounded-lg hover:bg-slate-700 shadow-lg"><Maximize2 size={20} /></button>
                        <button className="p-3 bg-slate-800/80 backdrop-blur text-white rounded-lg hover:bg-slate-700 shadow-lg"><ZoomIn size={20} /></button>
                        <button className="p-3 bg-slate-800/80 backdrop-blur text-white rounded-lg hover:bg-slate-700 shadow-lg"><ZoomOut size={20} /></button>
                        <button className="p-3 bg-slate-800/80 backdrop-blur text-white rounded-lg hover:bg-slate-700 shadow-lg"><Download size={20} /></button>
                        <button
                            onClick={() => handleDelete(currentItem.id)}
                            className="p-3 bg-red-800/80 backdrop-blur text-white rounded-lg hover:bg-red-600 shadow-lg"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    {filteredItems.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-slate-800/80 backdrop-blur text-white rounded-full hover:bg-slate-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-20 top-1/2 -translate-y-1/2 z-10 p-3 bg-slate-800/80 backdrop-blur text-white rounded-full hover:bg-slate-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Image/Document */}
                    <img
                        src={currentItem.url}
                        alt={currentItem.title}
                        className="w-full h-full object-contain bg-slate-950 transition-opacity duration-300"
                    />

                    {/* Overlay Info */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-8 pt-16">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-xs uppercase font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 mb-2 inline-block">
                                    {sections.find(s => s.id === currentItem.section)?.name || currentItem.section}
                                </span>
                                <h3 className="text-2xl font-bold">{currentItem.title}</h3>
                                <p className="text-slate-400 text-sm">{currentItem.fileName}</p>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-2">
                                {filteredItems.slice(0, 5).map((item, i) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === currentIndex ? 'border-amber-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                                {filteredItems.length > 5 && (
                                    <div className="w-16 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-sm">
                                        +{filteredItems.length - 5}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-500">
                    <FolderOpen size={64} className="mb-4 opacity-30" />
                    <p className="text-lg">No hay {activeTab === 'render' ? 'renders' : 'planos'} en esta sección</p>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="mt-4 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <Upload size={18} /> Subir archivo
                    </button>
                </div>
            )}

            {/* Page Indicator */}
            {filteredItems.length > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    {filteredItems.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-amber-500 w-6' : 'bg-slate-700'}`}
                        />
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">
                                Agregar {activeTab === 'render' ? 'Render 3D' : 'Plano Técnico'}
                            </h3>
                            <button
                                onClick={() => { setShowUploadModal(false); setUploadFile(null); setUploadPreview(''); }}
                                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* File Upload Area */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${uploadFile ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-500'
                                    }`}
                            >
                                {uploadPreview ? (
                                    <img src={uploadPreview} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                                ) : uploadFile ? (
                                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                                        <FileText size={24} />
                                        <span>{uploadFile.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="mx-auto text-slate-500 mb-2" size={32} />
                                        <p className="text-slate-400">Click para seleccionar archivo</p>
                                        <p className="text-slate-600 text-sm mt-1">
                                            {activeTab === 'render' ? 'JPG, PNG, WEBP' : 'JPG, PNG, PDF, DWG'}
                                        </p>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={getAcceptedTypes()}
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Título</label>
                                <input
                                    type="text"
                                    placeholder={activeTab === 'render' ? 'Ej: Vista Norte - Fachada Principal' : 'Ej: Planta Baja - Distribución'}
                                    value={uploadTitle}
                                    onChange={(e) => setUploadTitle(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            {/* Section */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Sección</label>
                                <select
                                    value={uploadSection}
                                    onChange={(e) => setUploadSection(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                >
                                    <option value="">Seleccionar sección</option>
                                    {sections.map(section => (
                                        <option key={section.id} value={section.id}>{section.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Upload Button */}
                            <button
                                onClick={handleUpload}
                                disabled={!uploadFile || !uploadTitle || !uploadSection}
                                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Upload size={18} /> Subir Archivo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Section Modal */}
            {showAddSection && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">Nueva Sección</h3>
                        <input
                            type="text"
                            placeholder="Nombre de la sección"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none mb-4"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setShowAddSection(false); setNewSectionName(''); }}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddSection}
                                disabled={!newSectionName.trim()}
                                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2 rounded-lg disabled:opacity-50 transition-colors"
                            >
                                Crear
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlansViewer;
