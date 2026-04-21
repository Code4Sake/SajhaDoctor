import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './Auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import {
  Home, Calendar, Search, FileText, Heart, Settings, LogOut,
  Users, BarChart3, DollarSign, Video, Bell, Menu, X,
  ChevronLeft, Power, Stethoscope
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   DASHBOARD SHELL — Shared layout for Patient & Doctor
   Matches SajhaDoctor premium landing page design system
   ═══════════════════════════════════════════════════════ */

const patientNav = [
  { to: '/dashboard',              icon: Home,        tKey: 'dash.home' },
  { to: '/dashboard/appointments', icon: Calendar,    tKey: 'dash.appointments' },
  { to: '/dashboard/find-doctors', icon: Search,      tKey: 'dash.findDoctors' },
  { to: '/dashboard/prescriptions',icon: FileText,    tKey: 'dash.prescriptions' },
  { to: '/dashboard/health',       icon: Heart,       tKey: 'dash.healthRecords' },
  { to: '/dashboard/settings',     icon: Settings,    tKey: 'dash.settings' },
];

const doctorNav = [
  { to: '/doctor',              icon: Home,       tKey: 'dash.home' },
  { to: '/doctor/appointments', icon: Calendar,   tKey: 'dash.appointments' },
  { to: '/doctor/patients',     icon: Users,      tKey: 'dash.patients' },
  { to: '/doctor/prescriptions',icon: FileText,   tKey: 'dash.prescriptions' },
  { to: '/doctor/analytics',    icon: BarChart3,  tKey: 'dash.analytics' },
  { to: '/doctor/settings',     icon: Settings,   tKey: 'dash.settings' },
];

export default function DashboardShell() {
  const { user, profile, userType, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const navItems = userType === 'doctor' ? doctorNav : patientNav;
  const displayName = profile
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
    : user?.displayName || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // Close mobile sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // Block body scroll when mobile sidebar open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/home/Login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--s50)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-[3px] border-t-transparent"
          style={{ borderColor: 'var(--blue-600)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--s50)', fontFamily: 'var(--font)' }}>

      {/* ═══ DESKTOP SIDEBAR ═══ */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 transition-all duration-500"
        style={{
          width: collapsed ? '80px' : '260px',
          background: 'var(--white)',
          borderRight: '1px solid var(--s100)',
          boxShadow: '4px 0 24px -4px rgba(15,23,42,0.04)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-[72px]" style={{ borderBottom: '1px solid var(--s100)' }}>
          {!collapsed && (
            <motion.div className="flex items-center gap-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--blue-700), var(--blue-500))' }}>
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="font-extrabold text-lg tracking-tight" style={{ color: 'var(--navy-800)' }}>
                Sajha<span style={{ color: 'var(--blue-600)' }}>Doctor</span>
              </span>
            </motion.div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-[var(--s50)] transition-colors">
            <ChevronLeft size={18} style={{ color: 'var(--s400)', transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard' || item.to === '/doctor'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.85rem] font-semibold transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? ''
                    : 'hover:bg-[var(--s50)]'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'var(--blue-50)' : undefined,
                color: isActive ? 'var(--blue-600)' : 'var(--s500)',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-full"
                      style={{ background: 'var(--blue-600)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {!collapsed && <span>{t(item.tKey)}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile + Logout */}
        <div className="p-3 space-y-2" style={{ borderTop: '1px solid var(--s100)' }}>
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: 'var(--navy-800)' }}>{displayName}</p>
                <p className="text-xs truncate" style={{ color: 'var(--s400)' }}>
                  {userType === 'doctor' ? t('dash.doctor') : t('dash.patient')}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[0.85rem] font-semibold transition-all duration-300"
            style={{ color: 'var(--s400)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--s400)'; }}
          >
            <LogOut size={20} />
            {!collapsed && <span>{t('dash.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* ═══ MOBILE SIDEBAR OVERLAY ═══ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 lg:hidden"
              style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 h-full w-72 z-50 lg:hidden flex flex-col"
              style={{ background: 'var(--white)', boxShadow: '8px 0 32px -4px rgba(15,23,42,0.12)' }}
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between px-5 h-[72px]" style={{ borderBottom: '1px solid var(--s100)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, var(--blue-700), var(--blue-500))' }}>
                    <span className="text-white font-black text-sm">S</span>
                  </div>
                  <span className="font-extrabold text-lg tracking-tight" style={{ color: 'var(--navy-800)' }}>
                    Sajha<span style={{ color: 'var(--blue-600)' }}>Doctor</span>
                  </span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg" style={{ background: 'var(--s50)' }}>
                  <X size={18} style={{ color: 'var(--s600)' }} />
                </button>
              </div>
              <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item, i) => (
                  <motion.div key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/dashboard' || item.to === '/doctor'}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-[0.9rem] font-semibold transition-all"
                      style={({ isActive }) => ({
                        background: isActive ? 'var(--blue-50)' : 'transparent',
                        color: isActive ? 'var(--blue-600)' : 'var(--s500)',
                      })}
                    >
                      <item.icon size={20} />
                      <span>{t(item.tKey)}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="p-3" style={{ borderTop: '1px solid var(--s100)' }}>
                <button onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-[0.9rem] font-semibold"
                  style={{ color: '#EF4444' }}>
                  <LogOut size={20} /> {t('dash.logout')}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-500"
        style={{ marginLeft: isDesktop ? (collapsed ? '80px' : '260px') : '0' }}>

        {/* Top Header */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between h-[64px] lg:h-[72px] px-4 lg:px-8"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px) saturate(1.5)',
            borderBottom: '1px solid var(--s100)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl transition-colors"
              style={{ background: 'var(--s50)' }}
            >
              <Menu size={20} style={{ color: 'var(--s600)' }} />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--navy-800)' }}>
                {(() => { const found = navItems.find(n => location.pathname === n.to || (n.to !== '/dashboard' && n.to !== '/doctor' && location.pathname.startsWith(n.to))); return found ? t(found.tKey) : t('dash.home'); })()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="minimal" />
            <motion.button
              className="relative p-2.5 rounded-xl transition-colors"
              style={{ background: 'var(--s50)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={18} style={{ color: 'var(--s500)' }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--blue-600)' }} />
            </motion.button>
            <div className="flex items-center gap-2.5 pl-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))' }}>
                {initials}
              </div>
              <span className="hidden md:block text-sm font-bold" style={{ color: 'var(--navy-800)' }}>{displayName}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around h-16"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--s100)',
          boxShadow: '0 -4px 24px -4px rgba(15,23,42,0.06)',
        }}
      >
        {navItems.slice(0, 5).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard' || item.to === '/doctor'}
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors"
            style={({ isActive }) => ({
              color: isActive ? 'var(--blue-600)' : 'var(--s400)',
            })}
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: 'var(--blue-600)' }}
                    />
                  )}
                </div>
                <span className="text-[0.6rem] font-bold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
