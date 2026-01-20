import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Layout';
import Dashboard from './pages/Dashboard';
import SmartSchedule from './pages/SmartSchedule';
import OperatorView from './pages/OperatorView';
import Login from './pages/Login';
import ProjectHub from './pages/ProjectHub';
import PlansViewer from './pages/PlansViewer';
import Finances from './pages/Finances';
import SectionsManager from './pages/SectionsManager';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isProjectHub = location.pathname === '/hub';
  const isOperatorMobile = location.pathname === '/operator';

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-amber-500/30">

      {/* Show Sidebar only inside specific project views, not on Login or Hub */}
      {!isLoginPage && !isProjectHub && !isOperatorMobile && (
        <Sidebar activeView={location.pathname.replace('/', '')} setView={() => { }} />
      )}

      <main className={`flex-1 relative bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center ${(!isLoginPage && !isProjectHub && !isOperatorMobile) ? 'ml-64' : ''}`}>
        {/* Dark Overlay */}
        <div className={`absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-0 ${isOperatorMobile ? 'bg-slate-950/95' : ''}`}></div>

        {/* Content */}
        <div className="absolute inset-0 z-10 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/hub" element={<ProjectHub />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schedule" element={<SmartSchedule />} />
            <Route path="/plans" element={<PlansViewer />} />
            <Route path="/sections" element={<SectionsManager />} />
            <Route path="/funds" element={<Finances />} />
            <Route path="/operator" element={<OperatorView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
