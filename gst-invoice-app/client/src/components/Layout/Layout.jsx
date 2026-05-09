import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, FileText, Plus, Settings, LogOut,
  Moon, Sun, Monitor, Menu, X, Wallet, Package, Info,
  MessageCircle, Mail, Copy, Check, Building2, MapPin
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/invoices/new', icon: Plus, label: 'New Invoice' },
  { to: '/gstr1', icon: FileText, label: 'GSTR-1 Report' },
  { to: '/payments', icon: Wallet, label: 'Payment Tracker' },
  { to: '/inventory', icon: Package, label: 'Inventory Report' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const CONTACTS = [
  {
    role: 'Owner',
    name: 'ANIKET KANSAL',
    phone: '8126700718',
    email: 'aniketkansal3007@gmail.com',
    color: '#2563eb',
    bg: '#eff6ff',
    initial: 'A',
  },
  {
    role: 'Partner',
    name: 'AKSHANSH MITTAL',
    phone: '8766392706',
    email: 'akshanshmittal8@gmail.com',
    color: '#d97706',
    bg: '#fffbeb',
    initial: 'A',
  },
];

function AboutModal({ onClose, user }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = [
      '=== GST Studio - Contact Info ===',
      '',
      'OWNER: ANIKET KANSAL',
      'Phone/WhatsApp: +91 8126700718',
      'Email: aniketkansal3007@gmail.com',
      '',
      'PARTNER: AKSHANSH MITTAL',
      'Phone/WhatsApp: +91 8766392706',
      'Email: akshanshmittal8@gmail.com',
      '',
      '--- Business Details ---',
      'Company: ' + (user?.companyName || '-'),
      'GSTIN: ' + (user?.gstNumber || '-'),
      'Address: ' + (user?.address || '-'),
      'State: ' + (user?.state || '-'),
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white dark:bg-ink-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto"
        style={{ border: '1px solid #e8e8e0', maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100 dark:border-ink-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-ink-800 dark:bg-amber-500 flex items-center justify-center">
              <Info size={16} className="text-white dark:text-ink-950" />
            </div>
            <div>
              <p className="font-display font-semibold text-ink-800 dark:text-ink-100 text-sm leading-none">About GST Studio</p>
              <p className="text-xs text-ink-400 mt-0.5">Contact and Business Info</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-400 hover:text-ink-600 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CONTACTS.map(c => (
              <div
                key={c.role}
                className="rounded-xl p-4 border"
                style={{ background: c.bg, borderColor: c.color + '30' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                    style={{ background: c.color }}
                  >
                    {c.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-800 text-sm leading-tight">{c.name}</p>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: c.color + '18', color: c.color }}
                    >
                      {c.role}
                    </span>
                  </div>
                </div>
                
                  href={'https://wa.me/91' + c.phone}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold mb-2 transition-all hover:opacity-90"
                  style={{ background: '#25d366', color: 'white' }}
                >
                  <MessageCircle size={13} />
                  WhatsApp: {c.phone}
                </a>
                
                  href={'mailto:' + c.email}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-black/5"
                  style={{ color: c.color, background: c.color + '10' }}
                >
                  <Mail size={13} />
                  <span className="truncate">{c.email}</span>
                </a>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-ink-100 dark:border-ink-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-ink-50 dark:bg-ink-800 border-b border-ink-100 dark:border-ink-700">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Business Details</p>
            </div>
            <div className="divide-y divide-ink-100 dark:divide-ink-800">
              <div className="flex items-start gap-3 px-4 py-3">
                <Building2 size={14} className="text-ink-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-ink-400 uppercase tracking-wide mb-0.5">Company</p>
                  <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">{user?.companyName || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 px-4 py-3">
                <FileText size={14} className="text-ink-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-ink-400 uppercase tracking-wide mb-0.5">GSTIN</p>
                  <p className="text-sm font-mono font-semibold text-ink-800 dark:text-ink-100">{user?.gstNumber || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 px-4 py-3">
                <MapPin size={14} className="text-ink-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-ink-400 uppercase tracking-wide mb-0.5">Address</p>
                  <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed whitespace-pre-line">{user?.address || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 px-4 py-3">
                <Info size={14} className="text-ink-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-ink-400 uppercase tracking-wide mb-0.5">State</p>
                  <p className="text-sm text-ink-700 dark:text-ink-200">{user?.state || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: copied ? '#16a34a' : '#1c1c18', color: 'white' }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Contact Info'}
          </button>

          <p className="text-center text-xs text-ink-300 dark:text-ink-600">
            GST Studio v1.0 · Built with love for Indian businesses
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, changeTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const themeIcon = { light: Sun, dark: Moon, system: Monitor }[theme];
  const ThemeIcon = themeIcon;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-ink-50 dark:bg-ink-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} user={user} />}

      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-ink-900
        border-r border-ink-200 dark:border-ink-800 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100 dark:border-ink-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ink-800 dark:bg-amber-500 flex items-center justify-center">
              <FileText size={16} className="text-white dark:text-ink-950" />
            </div>
            <div>
              <p className="font-display font-semibold text-ink-800 dark:text-ink-100 text-sm leading-none">GST Studio</p>
              <p className="text-xs text-ink-400 mt-0.5 font-mono">Invoice Manager</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-ink-400 hover:text-ink-600">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-ink-800 dark:bg-amber-500 text-white dark:text-ink-950'
                  : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800'
                }
              `}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => { setAboutOpen(true); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800"
          >
            <Info size={16} />
            About
          </button>
        </nav>

        <div className="px-3 py-2 border-t border-ink-100 dark:border-ink-800">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-ink-50 dark:bg-ink-800">
            <span className="text-xs font-medium text-ink-500 dark:text-ink-400 flex items-center gap-2">
              <ThemeIcon size={13} /> Theme
            </span>
            <div className="flex gap-1">
              {[
                { key: 'light', Icon: Sun },
                { key: 'dark', Icon: Moon },
                { key: 'system', Icon: Monitor },
              ].map(({ key, Icon }) => (
                <button
                  key={key}
                  onClick={() => changeTheme(key)}
                  className={`p-1.5 rounded transition-all ${
                    theme === key
                      ? 'bg-ink-800 dark:bg-amber-500 text-white dark:text-ink-950'
                      : 'text-ink-400 hover:text-ink-600 dark:hover:text-ink-200'
                  }`}
                >
                  <Icon size={12} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-3 py-4 border-t border-ink-100 dark:border-ink-800">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-ink-200 dark:bg-ink-700 flex items-center justify-center text-sm font-bold text-ink-600 dark:text-ink-300">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-800 dark:text-ink-100 truncate">{user?.name}</p>
              <p className="text-xs text-ink-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all font-medium"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-ink-900 border-b border-ink-200 dark:border-ink-800">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-300">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-ink-800 dark:bg-amber-500 flex items-center justify-center">
              <FileText size={12} className="text-white dark:text-ink-950" />
            </div>
            <span className="font-display font-semibold text-ink-800 dark:text-ink-100 text-sm">GST Studio</span>
          </div>
          <div className="w-8" />
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
