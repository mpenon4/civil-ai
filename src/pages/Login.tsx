import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HardHat, Hammer, Briefcase, Mail, Lock, Loader2, User, KeyRound, ArrowLeft, CheckCircle, Building2 } from 'lucide-react';
import { signIn, signUpEngineer, signUpOperator, signUpContractor, resendVerificationEmail } from '../lib/supabase';

type AuthMode = 'select' | 'engineer-login' | 'engineer-register' | 'operator-login' | 'operator-register' | 'contractor-login' | 'contractor-register' | 'verify-email';

const Login = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('select');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [projectCode, setProjectCode] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pendingEmail, setPendingEmail] = useState('');

    const handleEngineerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'engineer-login') {
                const { user } = await signIn(email, password);
                if (user?.user_metadata?.role === 'engineer') {
                    navigate('/hub');
                } else {
                    setError('Esta cuenta no es de ingeniero');
                }
            } else {
                await signUpEngineer(email, password, fullName);
                setPendingEmail(email);
                setMode('verify-email');
            }
        } catch (err: any) {
            setError(err.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    const handleOperatorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'operator-login') {
                const { user } = await signIn(email, password);
                if (user?.user_metadata?.role === 'operator') {
                    navigate('/operator');
                } else {
                    setError('Esta cuenta no es de operador');
                }
            } else {
                if (!projectCode) {
                    setError('Ingresa el código de obra');
                    setLoading(false);
                    return;
                }
                await signUpOperator(email, password, fullName, projectCode);
                setPendingEmail(email);
                setMode('verify-email');
            }
        } catch (err: any) {
            setError(err.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    const handleContractorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'contractor-login') {
                const { user } = await signIn(email, password);
                if (user?.user_metadata?.role === 'contractor') {
                    navigate('/hub');
                } else {
                    setError('Esta cuenta no es de constructora');
                }
            } else {
                if (!companyName) {
                    setError('Ingresa el nombre de tu empresa');
                    setLoading(false);
                    return;
                }
                await signUpContractor(email, password, fullName, companyName);
                setPendingEmail(email);
                setMode('verify-email');
            }
        } catch (err: any) {
            setError(err.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = async () => {
        setLoading(true);
        try {
            await resendVerificationEmail(pendingEmail);
            setError('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2531&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-slate-900/50"></div>

            <div className="relative z-10 w-full max-w-4xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Branding */}
                <div className="flex flex-col justify-center items-start text-white">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-6">
                        <HardHat className="text-white" size={32} />
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-4">ProBuild</h1>
                    <p className="text-xl text-slate-400 max-w-sm leading-relaxed">
                        Gestión de construcción de próxima generación. Inteligencia artificial y visualización 3D para el sitio de obra moderno.
                    </p>
                </div>

                {/* Auth Section */}
                <div className="space-y-4">

                    {/* ROLE SELECTION */}
                    {mode === 'select' && (
                        <>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Seleccione su Rol</h3>

                            <button
                                onClick={() => setMode('engineer-login')}
                                className="w-full bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-blue-500/50 p-6 rounded-2xl flex items-center gap-6 group transition-all hover:bg-slate-800"
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <Briefcase size={24} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Ingeniero / Jefe de Obra</h4>
                                    <p className="text-sm text-slate-500">Multi-Workspaces, Finanzas y gestión de equipos.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setMode('operator-login')}
                                className="w-full bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-amber-500/50 p-6 rounded-2xl flex items-center gap-6 group transition-all hover:bg-slate-800"
                            >
                                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                    <Hammer size={24} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Operador de Campo</h4>
                                    <p className="text-sm text-slate-500">Tareas diarias, reportes y acceso a planos.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setMode('contractor-login')}
                                className="w-full bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 p-6 rounded-2xl flex items-center gap-6 group transition-all hover:bg-slate-800"
                            >
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <Building2 size={24} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Constructora / Contratista</h4>
                                    <p className="text-sm text-slate-500">Gestión de proyectos y asignación de recursos.</p>
                                </div>
                            </button>
                        </>
                    )}

                    {/* VERIFY EMAIL */}
                    {mode === 'verify-email' && (
                        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center">
                            <CheckCircle className="mx-auto text-emerald-500 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-white mb-2">Verificá tu Email</h3>
                            <p className="text-slate-400 mb-4">
                                Enviamos un link de verificación a<br />
                                <span className="text-amber-500 font-medium">{pendingEmail}</span>
                            </p>
                            <p className="text-sm text-slate-500 mb-4">
                                Revisá tu bandeja de entrada (y spam) y hacé click en el link para activar tu cuenta.
                            </p>
                            <button
                                onClick={handleResendEmail}
                                disabled={loading}
                                className="text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                {loading ? 'Enviando...' : '¿No llegó? Reenviar email'}
                            </button>
                            <button
                                onClick={() => setMode('select')}
                                className="block w-full mt-4 text-sm text-slate-600 hover:text-slate-400 transition-colors"
                            >
                                ← Volver al inicio
                            </button>
                        </div>
                    )}

                    {/* ENGINEER LOGIN/REGISTER */}
                    {(mode === 'engineer-login' || mode === 'engineer-register') && (
                        <form onSubmit={handleEngineerSubmit} className="bg-slate-900/80 backdrop-blur-md border border-blue-500/30 p-6 rounded-2xl space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Briefcase className="text-blue-500" size={20} />
                                <h3 className="text-lg font-bold text-white">
                                    {mode === 'engineer-login' ? 'Ingresar como Ingeniero' : 'Registrar Ingeniero'}
                                </h3>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {mode === 'engineer-register' && (
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Nombre completo"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="animate-spin" size={18} />}
                                {mode === 'engineer-login' ? 'Ingresar' : 'Crear Cuenta'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setMode(mode === 'engineer-login' ? 'engineer-register' : 'engineer-login')}
                                className="w-full text-center text-sm text-slate-500 hover:text-white transition-colors"
                            >
                                {mode === 'engineer-login' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Ingresá'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setMode('select'); setError(''); }}
                                className="w-full flex items-center justify-center gap-1 text-sm text-slate-600 hover:text-slate-400 transition-colors"
                            >
                                <ArrowLeft size={14} /> Volver
                            </button>
                        </form>
                    )}

                    {/* OPERATOR LOGIN/REGISTER */}
                    {(mode === 'operator-login' || mode === 'operator-register') && (
                        <form onSubmit={handleOperatorSubmit} className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 p-6 rounded-2xl space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Hammer className="text-amber-500" size={20} />
                                <h3 className="text-lg font-bold text-white">
                                    {mode === 'operator-login' ? 'Ingresar como Operador' : 'Registrar Operador'}
                                </h3>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {mode === 'operator-register' && (
                                <>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Nombre completo"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Código de Obra (del ingeniero)"
                                            value={projectCode}
                                            onChange={(e) => setProjectCode(e.target.value.toUpperCase())}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none font-mono uppercase tracking-wider"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 rounded-lg hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="animate-spin" size={18} />}
                                {mode === 'operator-login' ? 'Ingresar' : 'Crear Cuenta'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setMode(mode === 'operator-login' ? 'operator-register' : 'operator-login')}
                                className="w-full text-center text-sm text-slate-500 hover:text-white transition-colors"
                            >
                                {mode === 'operator-login' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Ingresá'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setMode('select'); setError(''); }}
                                className="w-full flex items-center justify-center gap-1 text-sm text-slate-600 hover:text-slate-400 transition-colors"
                            >
                                <ArrowLeft size={14} /> Volver
                            </button>
                        </form>
                    )}

                    {/* CONTRACTOR LOGIN/REGISTER */}
                    {(mode === 'contractor-login' || mode === 'contractor-register') && (
                        <form onSubmit={handleContractorSubmit} className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 p-6 rounded-2xl space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="text-emerald-500" size={20} />
                                <h3 className="text-lg font-bold text-white">
                                    {mode === 'contractor-login' ? 'Ingresar como Constructora' : 'Registrar Constructora'}
                                </h3>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {mode === 'contractor-register' && (
                                <>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Nombre completo"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Nombre de la empresa / constructora"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    placeholder="Email corporativo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold py-3 rounded-lg hover:from-emerald-500 hover:to-emerald-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="animate-spin" size={18} />}
                                {mode === 'contractor-login' ? 'Ingresar' : 'Crear Cuenta'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setMode(mode === 'contractor-login' ? 'contractor-register' : 'contractor-login')}
                                className="w-full text-center text-sm text-slate-500 hover:text-white transition-colors"
                            >
                                {mode === 'contractor-login' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Ingresá'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setMode('select'); setError(''); }}
                                className="w-full flex items-center justify-center gap-1 text-sm text-slate-600 hover:text-slate-400 transition-colors"
                            >
                                <ArrowLeft size={14} /> Volver
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Login;
