import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Calculator, 
  RefreshCw, 
  FileText, 
  QrCode, 
  Lock, 
  Timer, 
  MoreHorizontal, 
  Home, 
  Search, 
  Plus, 
  ChevronDown, 
  User, 
  Clock, 
  Edit3, 
  Settings,
  MapPin,
  ArrowRight,
  Trash2,
  Check,
  X,
  Battery,
  Wifi,
  Signal,
  Calendar,
  Cloud,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Bell,
  Shield,
  HelpCircle,
  Info,
  Mic,
  Copy,
  Hash,
  Activity,
  Zap,
  Download,
  Share2,
  RotateCcw,
  Ruler,
  Cpu,
  Pause,
  Play,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { QRCodeSVG } from 'qrcode.react';

import { translations, type Language } from './translations';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const vibrate = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(10);
  }
};

const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};

// --- Types ---
interface Note {
  id: string;
  title: string;
  content: string;
  preview: string;
  tag: string;
  color: string;
  date: number;
  pinned?: boolean;
  isHidden?: boolean;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface CalcHistory {
  expression: string;
  result: string;
  timestamp: number;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinedDate: number;
}

// --- Components ---

const StatusBar = ({ theme }: { theme?: 'dark' | 'light' }) => {
  const [time, setTime] = useState(new Date());
  const isDark = theme === 'dark';
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn(
      "flex justify-between items-center px-6 py-2 text-[10px] font-bold z-50 transition-colors",
      isDark ? "text-white/90" : "text-slate-900/90"
    )}>
      <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={10} />
        <Wifi size={10} />
        <Battery size={10} className="rotate-90" />
      </div>
    </div>
  );
};

const NavigationBar = ({ activeTab, onTabChange, theme, t }: { activeTab: string; onTabChange: (tab: string) => void, theme?: 'dark' | 'light', t: any }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'calc', icon: Calculator, label: 'Calc' },
    { id: 'notes', icon: FileText, label: 'Notes' },
    { id: 'tools', icon: Zap, label: 'Tools' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "backdrop-blur-xl border-t px-4 py-2 flex justify-around items-center rounded-t-[2.5rem] shadow-2xl z-50 transition-colors",
      isDark ? "bg-slate-900/80 border-white/10" : "bg-white/80 border-slate-200"
    )}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              vibrate();
              onTabChange(tab.id);
            }}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-all duration-300 relative",
              isActive 
                ? (isDark ? "text-indigo-400" : "text-blue-600") 
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="nav-glow"
                className={cn(
                  "absolute -top-1 w-8 h-1 rounded-full",
                  isDark ? "bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" : "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                )}
              />
            )}
            <Icon size={20} className={cn("transition-transform", isActive && "scale-110")} />
            <span className="text-[8px] font-bold uppercase tracking-widest">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// --- Screens ---

const SplashScreen = ({ onComplete, theme }: { onComplete: () => void, theme: 'dark' | 'light' }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-12 bg-black z-[9999] overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" 
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10"
      >
        <div className="w-32 h-32 rounded-[3rem] bg-indigo-600 flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.4)] relative overflow-hidden group">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap size={64} className="text-white" fill="white" />
          </motion.div>
          <motion.div 
            animate={{ 
              x: ["-100%", "200%"],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" 
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute -bottom-3 -right-3 bg-indigo-400 text-slate-950 text-[12px] font-black px-4 py-1.5 rounded-full border-4 border-slate-950 shadow-xl"
        >
          V1
        </motion.div>
      </motion.div>
      
      <div className="flex flex-col items-center gap-3 z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-4xl font-black tracking-tighter text-white"
        >
          AllInOne
        </motion.h1>
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent w-full"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-400/60"
        >
          All-In-One Suite
        </motion.p>
      </div>

      <div className="absolute bottom-20 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="w-full h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
        />
      </div>
    </div>
  );
};

const HomeScreen = ({ user, onNavigate, theme, t }: { user: UserProfile; onNavigate: (screen: string) => void, theme: 'dark' | 'light', t: any }) => {
  const [recentNotes, setRecentNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('pro_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = theme === 'dark';

  const filteredNotes = recentNotes
    .filter(n => !n.isHidden)
    .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.preview.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.date - a.date)
    .slice(0, 5); // Show top 5 recent notes

  return (
    <div className="flex flex-col gap-6 h-full pb-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
              filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg",
              isDark ? "bg-indigo-500/20 shadow-indigo-500/10" : "bg-blue-500/10 shadow-blue-500/5"
            )}
          >
            ⚡
          </motion.div>
          <div>
            <p className={cn(
              "font-black uppercase tracking-wider",
              isDark ? "text-slate-400" : "text-slate-500",
              "text-sm sm:text-base"
            )}>
              {t.home.welcome}
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section - Minimalist Animated */}
      <div className="py-8 sm:py-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-1"
        >
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "text-[8vw] sm:text-[5vw] font-black tracking-tighter leading-[0.8] uppercase",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            All-In-<span className={isDark ? "text-indigo-500" : "text-blue-600"}>One</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className={cn(
              "flex items-center gap-4 mt-4",
              isDark ? "text-slate-400" : "text-slate-500"
            )}
          >
            <div className={cn("h-px flex-1", isDark ? "bg-white/10" : "bg-slate-200")} />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] whitespace-nowrap">
              {t.home.overview}
            </span>
            <div className={cn("h-px flex-1", isDark ? "bg-white/10" : "bg-slate-200")} />
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Plus, label: t.notes.addNote, color: 'primary', action: () => onNavigate('notes') },
              { icon: Search, label: t.home.find, color: 'slate', action: () => onNavigate('notes') },
              { icon: Activity, label: t.home.stats, color: 'emerald', action: () => onNavigate('settings') },
              { icon: MoreHorizontal, label: t.home.more, color: 'slate', action: () => onNavigate('tools') },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="flex flex-col items-center gap-2"
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all active:scale-90",
                  item.color === 'primary' 
                    ? (isDark ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/30" : "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30")
                    : (isDark ? "bg-slate-800/50 border-white/5 text-slate-400" : "bg-white border-slate-200 text-slate-500 shadow-sm")
                )}>
                  <item.icon size={20} />
                </div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Recent Notes Section */}
          <div className={cn(
            "border rounded-[2.5rem] p-6 flex flex-col gap-4 h-full",
            isDark ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200 shadow-sm"
          )}>
            <div className="flex justify-between items-center">
              <h4 className={cn("font-black text-sm", isDark ? "text-white" : "text-slate-900")}>Recent Notes</h4>
              <button 
                onClick={() => onNavigate('notes')}
                className={cn("text-[10px] font-black uppercase hover:underline", isDark ? "text-indigo-400" : "text-blue-600")}
              >
                View All
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search recent notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-9 pr-4 py-2 rounded-xl text-xs border transition-all focus:outline-none",
                  isDark 
                    ? "bg-slate-800/50 border-white/5 text-white placeholder:text-slate-500 focus:border-indigo-500/50" 
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500/50"
                )}
              />
            </div>

            <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1 scrollbar-hide mt-2">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No recent notes found
                </div>
              ) : (
                filteredNotes.map(note => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => onNavigate('notes')}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]",
                      isDark 
                        ? "bg-slate-800/30 border-white/5 hover:border-indigo-500/30" 
                        : "bg-slate-50 border-slate-100 hover:border-blue-500/30 hover:shadow-sm"
                    )}
                  >
                    <h5 className={cn("font-bold text-xs mb-1 truncate", isDark ? "text-slate-200" : "text-slate-800")}>
                      {note.title}
                    </h5>
                    <p className={cn("text-[10px] line-clamp-2", isDark ? "text-slate-500" : "text-slate-500")}>
                      {note.preview}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalculatorScreen = ({ theme, t, onNavigate }: { theme: 'dark' | 'light', t: any, onNavigate: (screen: string, subTool?: any) => void }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [mode, setMode] = useState<'standard' | 'scientific'>('standard');
  const [history, setHistory] = useState<CalcHistory[]>(() => {
    const saved = localStorage.getItem('calc_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Unit Converter State
  const [unitCategory, setUnitCategory] = useState<'length' | 'area' | 'weight' | 'temperature' | 'power' | 'numberSystem' | 'speed'>('length');
  const [unitValue, setUnitValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('cm');

  const isDark = theme === 'dark';

  const units: Record<string, Record<string, number>> = {
    length: {
      cm: 0.01, m: 1, mm: 0.001, nm: 1e-9, pm: 1e-12, pc: 3.086e16,
      inch: 0.0254, mile: 1609.34, foot: 0.3048, yard: 0.9144
    },
    area: {
      'm^2': 1, 'km^2': 1e6, 'dm^2': 0.01, 'mm^2': 1e-6
    },
    weight: {
      kg: 1, g: 0.001, mg: 1e-6, microgram: 1e-9, pound: 0.453592
    },
    temperature: {
      C: 1, F: 1, K: 1 // Special handling in conversion function
    },
    power: {
      W: 1, KW: 1000, Hp: 745.7, Ps: 735.5, 'kgm/s': 9.80665
    },
    speed: {
      'm/s': 1, 'km/s': 1000, 'km/h': 1/3.6
    }
  };

  const convertUnits = () => {
    const val = parseFloat(unitValue);
    if (isNaN(val)) return '0';

    if (unitCategory === 'temperature') {
      let celsius = val;
      if (fromUnit === 'F') celsius = (val - 32) * 5/9;
      if (fromUnit === 'K') celsius = val - 273.15;

      if (toUnit === 'C') return celsius.toFixed(2);
      if (toUnit === 'F') return (celsius * 9/5 + 32).toFixed(2);
      if (toUnit === 'K') return (celsius + 273.15).toFixed(2);
    }

    if (unitCategory === 'numberSystem') {
      try {
        const dec = parseInt(unitValue, fromUnit === 'bin' ? 2 : fromUnit === 'Oct' ? 8 : fromUnit === 'Hex' ? 16 : 10);
        if (isNaN(dec)) return 'Error';
        if (toUnit === 'bin') return dec.toString(2);
        if (toUnit === 'Oct') return dec.toString(8);
        if (toUnit === 'Hex') return dec.toString(16).toUpperCase();
        return dec.toString(10);
      } catch (e) { return 'Error'; }
    }

    const baseValue = val * (units[unitCategory][fromUnit] || 1);
    const result = baseValue / (units[unitCategory][toUnit] || 1);
    return result.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const handleKey = (key: string) => {
    vibrate();
    if (key === '=') {
      try {
        const sanitized = expression
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/\^/g, '**')
          .replace(/√\(/g, 'Math.sqrt(');
        
        const result = eval(sanitized);
        const formattedResult = Number(result).toLocaleString(undefined, { maximumFractionDigits: 4 });
        const newEntry = { expression, result: formattedResult, timestamp: Date.now() };
        setHistory([newEntry, ...history].slice(0, 5));
        localStorage.setItem('calc_history', JSON.stringify([newEntry, ...history].slice(0, 5)));
        setDisplay(formattedResult);
        setExpression(formattedResult);
      } catch (e) {
        setDisplay('Error');
        setExpression('');
      }
    } else if (key === 'C') {
      setDisplay('0');
      setExpression('');
    } else if (key === '⌫') {
      setExpression(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setExpression(prev => prev === '0' ? key : prev + key);
      setDisplay(prev => prev === '0' ? key : prev + key);
    }
  };

  const buttons = mode === 'standard' 
    ? [
        ['C', '(', ')', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['0', '.', '⌫', '=']
      ]
    : [
        ['sin(', 'cos(', 'tan(', 'C'],
        ['log(', 'ln(', '(', ')'],
        ['√(', '^', 'π', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['0', '.', 'e', '=']
      ];

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Top Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            vibrate();
            onNavigate('tools', 'unit');
          }}
          className={cn(
            "flex-1 py-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all active:scale-95",
            isDark ? "bg-slate-800/50 border-white/5 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm"
          )}
        >
          <Ruler size={16} className="text-blue-500" />
          {t.tools.unitConverter}
        </button>
        <button
          onClick={() => {
            vibrate();
            setMode(mode === 'scientific' ? 'standard' : 'scientific');
          }}
          className={cn(
            "flex-1 py-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all active:scale-95",
            mode === 'scientific'
              ? (isDark ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/30" : "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30")
              : (isDark ? "bg-slate-800/50 border-white/5 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm")
          )}
        >
          <Cpu size={16} className={cn(mode === 'scientific' ? "text-white" : "text-indigo-500")} />
          {mode === 'scientific' ? t.calc.scientific : t.calc.standard}
        </button>
      </div>

      <div className={cn(
        "border rounded-[2.5rem] p-8 flex flex-col items-end justify-center gap-2 min-h-[160px] relative overflow-hidden transition-colors",
        isDark ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200 shadow-sm"
      )}>
        <div className="absolute top-4 left-6 flex flex-col gap-1 opacity-20">
          {history.length > 0 ? history.slice(0, 2).map((h, i) => (
            <span key={i} className={cn("text-[10px] font-mono", isDark ? "text-white" : "text-slate-900")}>{h.expression} = {h.result}</span>
          )) : (
            <span className={cn("text-[10px] font-mono", isDark ? "text-white" : "text-slate-900")}>{t.calc.noHistory}</span>
          )}
        </div>
        <p className="text-slate-500 text-sm font-mono h-6">{expression || ' '}</p>
        <p className={cn("text-5xl font-black font-mono truncate w-full text-right tracking-tighter", isDark ? "text-white" : "text-slate-900")}>{display}</p>
      </div>

      <div className="grid grid-cols-4 gap-3 flex-1 pb-4">
        {buttons.flat().map((btn, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKey(btn)}
            className={cn(
              "rounded-3xl flex items-center justify-center font-black text-lg transition-all shadow-lg",
              btn === '=' 
                ? (isDark ? "bg-indigo-500 text-white shadow-indigo-500/20" : "bg-blue-600 text-white shadow-blue-600/20") 
                : ['÷', '×', '-', '+', 'C', '(', ')', '⌫', 'sin(', 'cos(', 'tan(', 'log(', 'ln(', '√(', '^', 'π', 'e'].includes(btn) 
                  ? (isDark ? "bg-slate-800/80 text-indigo-400 border border-white/5" : "bg-blue-50 text-blue-600 border border-blue-100") 
                  : (isDark ? "bg-slate-900/50 text-white border border-white/5" : "bg-white text-slate-900 border border-slate-200")
            )}
          >
            {btn === '⌫' ? <Trash2 size={20} /> : btn}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const NotesScreen = ({ theme, t }: { theme?: 'dark' | 'light', t: any }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('pro_notes');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Marketing Strategy', content: 'Focus on social media growth and organic reach. Analyze competitors and identify key trends in the industry.', preview: 'Focus on social media growth and organic reach...', tag: 'Work', color: 'indigo', date: Date.now(), pinned: true },
      { id: '2', title: 'Weekend Getaway', content: 'Pack hiking boots, camera, and extra batteries. Research local trails and book a cabin in the mountains.', preview: 'Pack hiking boots, camera, and extra batteries...', tag: 'Travel', color: 'emerald', date: Date.now() - 86400000 },
    ];
  });
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const isDark = theme === 'dark';

  useEffect(() => {
    localStorage.setItem('pro_notes', JSON.stringify(notes));
  }, [notes]);

  const saveNote = () => {
    if (!newNoteTitle.trim()) return;
    vibrate();

    if (editingNoteId) {
      setNotes(notes.map(n => n.id === editingNoteId ? {
        ...n,
        title: newNoteTitle,
        content: newNoteContent,
        preview: newNoteContent.slice(0, 100),
        date: Date.now()
      } : n));
      setEditingNoteId(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newNoteTitle,
        content: newNoteContent,
        preview: newNoteContent.slice(0, 100),
        tag: 'Personal',
        color: isDark ? 'indigo' : 'blue',
        date: Date.now()
      };
      setNotes([newNote, ...notes]);
    }

    setIsAdding(false);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const editNote = (note: Note) => {
    vibrate();
    setEditingNoteId(note.id);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content || note.preview);
    setIsAdding(true);
  };

  const deleteNote = (id: string) => {
    vibrate();
    setNotes(notes.filter(n => n.id !== id));
  };

  const toggleHideNote = (id: string) => {
    vibrate();
    setNotes(notes.map(n => n.id === id ? { ...n, isHidden: !n.isHidden } : n));
  };

  const filteredNotes = notes.filter(n => {
    return n.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full gap-6 relative">
      <div className="flex justify-between items-center">
        <h2 className={cn("font-black text-xl flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
          {t.notes.title}
        </h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAdding(true)}
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all active:scale-90",
              isDark ? "bg-indigo-500 shadow-indigo-500/20" : "bg-blue-600 shadow-blue-600/20"
            )}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.notes.search}
          className={cn(
            "w-full border rounded-2xl py-3.5 pl-12 pr-4 text-xs transition-all focus:outline-none",
            isDark 
              ? "bg-slate-900/50 border-white/5 text-white placeholder:text-slate-600 focus:border-indigo-500/50" 
              : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500/50 shadow-sm"
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-1 scrollbar-hide pb-20">
        {filteredNotes.length > 0 ? filteredNotes.map(note => (
          note.isHidden ? (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center h-full min-h-[140px]"
            >
              <button
                onClick={() => toggleHideNote(note.id)}
                className={cn(
                  "w-16 h-16 rounded-full flex flex-col items-center justify-center gap-1 shadow-sm border transition-all hover:scale-110 active:scale-95",
                  isDark ? "bg-slate-800/80 border-white/10 text-slate-400 hover:text-indigo-400" : "bg-white border-slate-200 text-slate-500 hover:text-blue-500"
                )}
                title={t.notes.unhideNote}
              >
                <EyeOff size={20} />
                <span className="text-[8px] font-bold uppercase tracking-widest">{t.notes.hidden}</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                "border rounded-[2rem] p-5 flex flex-col gap-3 group transition-colors",
                isDark ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200 shadow-sm"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {note.pinned && <Zap size={10} className={cn(isDark ? "text-indigo-400 fill-indigo-400" : "text-blue-500 fill-blue-500")} />}
                  <h4 className={cn("font-bold text-sm", isDark ? "text-white" : "text-slate-900")}>{note.title}</h4>
                </div>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border",
                  (isDark || note.color === 'indigo') 
                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                    : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                )}>
                  {note.tag}
                </span>
              </div>
              <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2">{note.preview}</p>
              <div className={cn("flex justify-between items-center pt-2 border-t", isDark ? "border-white/5" : "border-slate-100")}>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                  {new Date(note.date).toLocaleDateString()}
                </span>
                <div className="flex gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleHideNote(note.id)} 
                    className="text-slate-400 hover:text-indigo-400 transition-colors"
                    title={t.notes.hideNote}
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    onClick={() => editNote(note)}
                    className="text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => deleteNote(note.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          )
        )) : (
          <div className="flex flex-col items-center justify-center py-12 opacity-50">
            <FileText size={48} className="mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">{t.notes.noNotes}</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={cn(
              "absolute inset-0 z-50 flex flex-col p-6 gap-6",
              isDark ? "bg-slate-950" : "bg-white"
            )}
          >
            <div className="flex justify-between items-center">
              <h3 className={cn("font-black text-lg", isDark ? "text-white" : "text-slate-900")}>
                {editingNoteId ? t.notes.editNote || "Edit Note" : t.notes.newNote}
              </h3>
              <button onClick={() => {
                setIsAdding(false);
                setEditingNoteId(null);
                setNewNoteTitle('');
                setNewNoteContent('');
              }} className="text-slate-400">
                <X size={24} />
              </button>
            </div>
            <input
              value={newNoteTitle}
              onChange={e => setNewNoteTitle(e.target.value)}
              placeholder={t.notes.noteTitle}
              className={cn(
                "bg-transparent font-black text-2xl focus:outline-none",
                isDark ? "text-white placeholder:text-slate-800" : "text-slate-900 placeholder:text-slate-200"
              )}
            />
            <textarea
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
              placeholder={t.notes.startWriting}
              className={cn(
                "bg-transparent text-sm flex-1 resize-none focus:outline-none leading-relaxed",
                isDark ? "text-slate-400 placeholder:text-slate-800" : "text-slate-500 placeholder:text-slate-200"
              )}
            />
            <button 
              onClick={saveNote}
              className={cn(
                "text-white font-black py-4 rounded-3xl shadow-xl active:scale-95 transition-all",
                isDark ? "bg-indigo-500 shadow-indigo-500/20" : "bg-blue-600 shadow-blue-600/20"
              )}
            >
              {t.notes.save}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ToolsScreen = ({ theme, t, activeSubTool, setActiveSubTool }: { theme: 'dark' | 'light', t: any, activeSubTool: string, setActiveSubTool: (tool: any) => void }) => {
  const isDark = theme === 'dark';
  
  // Stopwatch State
  const [time, setTime] = useState(0); // in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  
  // Password Gen State
  const [passLength, setPassLength] = useState(16);
  const [generatedPass, setGeneratedPass] = useState('');

  // QR Generator State
  const [qrText, setQrText] = useState('https://allinone.app');

  // Unit Converter State
  const [unitValue, setUnitValue] = useState<string>('1');
  const [unitCategory, setUnitCategory] = useState<string>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('cm');
  const [showUnitSelector, setShowUnitSelector] = useState(true);

  // Dhikr Counter State
  const [dhikrCount, setDhikrCount] = useState(() => {
    const saved = localStorage.getItem('pro_dhikr');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('pro_dhikr', dhikrCount.toString());
  }, [dhikrCount]);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => setTime(t => t + 10), 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const nano = Math.floor((ms % 1000) / 10); // Representing centiseconds as "nanoseconds" for UI feel
    return {
      h: hours.toString().padStart(2, '0'),
      m: mins.toString().padStart(2, '0'),
      s: secs.toString().padStart(2, '0'),
      n: nano.toString().padStart(2, '0')
    };
  };

  const generatePassword = () => {
    vibrate();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < passLength; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPass(pass);
  };

  const downloadQRCode = () => {
    vibrate();
    const svg = document.querySelector('.qr-container svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "qrcode.png";
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const units: Record<string, Record<string, number>> = {
    length: {
      cm: 0.01, m: 1, mm: 0.001, nm: 1e-9, pm: 1e-12, pc: 3.086e16,
      inch: 0.0254, mile: 1609.34, foot: 0.3048, yard: 0.9144
    },
    area: {
      'm^2': 1, 'km^2': 1e6, 'dm^2': 0.01, 'mm^2': 1e-6
    },
    weight: {
      kg: 1, g: 0.001, mg: 1e-6, microgram: 1e-9, pound: 0.453592
    },
    temperature: {
      C: 1, F: 1, K: 1
    },
    power: {
      W: 1, KW: 1000, Hp: 745.7, Ps: 735.5, 'kgm/s': 9.80665
    },
    speed: {
      'm/s': 1, 'km/s': 1000, 'km/h': 1/3.6
    }
  };

  const convertUnit = () => {
    const val = parseFloat(unitValue);
    if (isNaN(val)) return '0';

    if (unitCategory === 'temperature') {
      let celsius = val;
      if (fromUnit === 'F') celsius = (val - 32) * 5/9;
      if (fromUnit === 'K') celsius = val - 273.15;

      if (toUnit === 'C') return celsius.toFixed(2);
      if (toUnit === 'F') return (celsius * 9/5 + 32).toFixed(2);
      if (toUnit === 'K') return (celsius + 273.15).toFixed(2);
    }

    if (unitCategory === 'numberSystem') {
      try {
        const dec = parseInt(unitValue, fromUnit === 'bin' ? 2 : fromUnit === 'Oct' ? 8 : fromUnit === 'Hex' ? 16 : 10);
        if (isNaN(dec)) return 'Error';
        if (toUnit === 'bin') return dec.toString(2);
        if (toUnit === 'Oct') return dec.toString(8);
        if (toUnit === 'Hex') return dec.toString(16).toUpperCase();
        return dec.toString(10);
      } catch (e) { return 'Error'; }
    }

    const baseValue = val * (units[unitCategory][fromUnit] || 1);
    const result = baseValue / (units[unitCategory][toUnit] || 1);
    return result.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const tools = [
    { id: 'qr', icon: QrCode, label: t.tools.qrGen, color: 'indigo', desc: t.tools.qrDesc },
    { id: 'pass', icon: Shield, label: t.tools.passwordGen, color: 'emerald', desc: t.tools.passDesc },
    { id: 'timer', icon: Timer, label: t.tools.stopwatch, color: 'rose', desc: t.tools.timerDesc },
    { id: 'dhikr', icon: Hash, label: t.tools.dhikr, color: 'amber', desc: t.tools.dhikrDesc },
    { id: 'unit', icon: Zap, label: t.tools.unitConverter, color: 'blue', desc: t.tools.unitDesc },
  ];

  const SubToolHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => { vibrate(); setActiveSubTool('main'); }}
          className={cn(
            "p-2 rounded-xl transition-colors",
            isDark ? "bg-white/5 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-blue-600"
          )}
        >
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <h3 className={cn("font-black text-lg", isDark ? "text-white" : "text-slate-900")}>{title}</h3>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-6 relative">
      <AnimatePresence mode="wait">
        {activeSubTool === 'main' ? (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1">
              <h2 className={cn("font-black text-2xl tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t.tools.title}</h2>
              <p className="text-slate-500 text-xs font-medium">{t.tools.desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <motion.button
                  key={tool.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    vibrate();
                    setActiveSubTool(tool.id as any);
                  }}
                  className={cn(
                    "border rounded-[2rem] p-5 flex items-center gap-5 text-left group transition-all",
                    isDark ? "bg-slate-900/50 border-white/5 hover:bg-white/5" : "bg-white border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-3xl flex items-center justify-center border transition-all",
                    tool.color === 'indigo' ? (isDark ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-500" : "bg-indigo-50 border-indigo-100 text-indigo-600") :
                    tool.color === 'emerald' ? (isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-emerald-50 border-emerald-100 text-emerald-600") :
                    tool.color === 'rose' ? (isDark ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-rose-50 border-rose-100 text-rose-600") :
                    tool.color === 'blue' ? (isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-blue-50 border-blue-100 text-blue-600") :
                    (isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-amber-50 border-amber-100 text-amber-600")
                  )}>
                    <tool.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className={cn("font-bold text-sm", isDark ? "text-white" : "text-slate-900")}>{tool.label}</h4>
                    <p className="text-slate-500 text-[10px] font-medium">{tool.desc}</p>
                  </div>
                  <ChevronRight size={18} className={cn("transition-colors", isDark ? "text-slate-700 group-hover:text-indigo-400" : "text-slate-300 group-hover:text-blue-600")} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : activeSubTool === 'qr' ? (
          <motion.div
            key="qr"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            <SubToolHeader title={t.tools.qrGen} />
            <div className={cn(
              "flex-1 rounded-[2.5rem] p-8 flex flex-col items-center gap-8",
              isDark ? "bg-slate-900/50 border border-white/5" : "bg-white border border-slate-200 shadow-sm"
            )}>
              <div className={cn(
                "p-6 rounded-3xl bg-white flex items-center justify-center shadow-2xl qr-container",
                !isDark && "border border-slate-100"
              )}>
                <QRCodeSVG value={qrText} size={200} level="H" includeMargin={true} />
              </div>
              
              <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">{t.tools.qrContent}</label>
                  <input 
                    type="text"
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    placeholder={t.tools.qrPlaceholder}
                    className={cn(
                      "w-full px-6 py-4 rounded-2xl font-bold text-sm outline-none transition-all",
                      isDark ? "bg-slate-950 text-white border border-white/5 focus:border-indigo-500/50" : "bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => { vibrate(); setQrText('https://allinone.app'); }}
                    className={cn(
                      "py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
                      isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {t.tools.qrReset}
                  </button>
                  <button 
                    onClick={downloadQRCode}
                    className={cn(
                      "py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2",
                      isDark ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    )}
                  >
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeSubTool === 'pass' ? (
          <motion.div
            key="pass"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            <SubToolHeader title={t.tools.passwordGen} />
            <div className={cn(
              "flex-1 rounded-[2.5rem] p-8 flex flex-col gap-8",
              isDark ? "bg-slate-900/50 border border-white/5" : "bg-white border border-slate-200 shadow-sm"
            )}>
              <div className={cn(
                "w-full rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 relative group transition-all",
                isDark ? "bg-slate-950 border border-white/5" : "bg-slate-50 border border-slate-200"
              )}>
                <p className={cn("font-mono text-xl break-all tracking-wider", isDark ? "text-indigo-400" : "text-blue-600")}>
                  {generatedPass || '••••••••••••'}
                </p>
                {generatedPass && (
                  <button 
                    onClick={() => { vibrate(); navigator.clipboard.writeText(generatedPass); }}
                    className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors"
                  >
                    <Copy size={14} /> {t.tools.passCopy}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{t.tools.passLength}</label>
                    <span className={cn("text-sm font-black", isDark ? "text-white" : "text-slate-900")}>{passLength}</span>
                  </div>
                  <input 
                    type="range" min="8" max="32" 
                    value={passLength} 
                    onChange={e => setPassLength(parseInt(e.target.value))}
                    className={cn(
                      "w-full h-2 rounded-lg appearance-none cursor-pointer",
                      isDark ? "bg-slate-800 accent-indigo-500" : "bg-slate-200 accent-blue-600"
                    )}
                  />
                </div>

                <button 
                  onClick={generatePassword}
                  className={cn(
                    "w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95",
                    isDark ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                  )}
                >
                  {t.tools.passSecure}
                </button>
              </div>

              <div className={cn(
                "mt-auto p-4 rounded-2xl border flex items-start gap-3",
                isDark ? "bg-indigo-500/5 border-indigo-500/10" : "bg-blue-50 border-blue-100"
              )}>
                <Shield size={16} className={isDark ? "text-indigo-400" : "text-blue-600"} />
                <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                  {t.tools.passLocal}
                </p>
              </div>
            </div>
          </motion.div>
        ) : activeSubTool === 'timer' ? (
          <motion.div
            key="timer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            <SubToolHeader title={t.tools.stopwatch} />
            <div className={cn(
              "flex-1 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-12",
              isDark ? "bg-slate-900/50 border border-white/5" : "bg-white border border-slate-200 shadow-sm"
            )}>
              <div className="relative">
                <div className={cn(
                  "w-64 h-64 rounded-full border-[6px] flex items-center justify-center relative transition-colors",
                  isDark ? "border-slate-800" : "border-slate-100"
                )}>
                  <motion.div 
                    animate={isRunning ? { rotate: 360 } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className={cn(
                      "absolute -inset-[6px] border-t-[6px] rounded-full",
                      isDark ? "border-indigo-500" : "border-blue-600"
                    )}
                  />
                  <div className="flex flex-col items-center">
                    <div className="flex items-baseline gap-1">
                      <span className={cn("text-5xl font-black font-mono tracking-tighter", isDark ? "text-white" : "text-slate-900")}>
                        {formatTime(time).m}:{formatTime(time).s}
                      </span>
                      <span className={cn("text-xl font-bold font-mono", isDark ? "text-indigo-400" : "text-blue-600")}>
                        {formatTime(time).n}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">
                      <Clock size={12} /> {formatTime(time).h}H
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <button 
                  onClick={() => { vibrate(); setIsRunning(!isRunning); }}
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90",
                    isRunning 
                      ? "bg-rose-500 shadow-rose-500/30 text-white" 
                      : (isDark ? "bg-indigo-600 shadow-indigo-600/30 text-white" : "bg-blue-600 shadow-blue-600/30 text-white")
                  )}
                >
                  {isRunning ? <Pause size={40} fill="white" /> : <Play size={40} fill="white" />}
                </button>
                <button 
                  onClick={() => { vibrate(); setTime(0); setIsRunning(false); }}
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90",
                    isDark ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-900"
                  )}
                >
                  <RotateCcw size={40} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : activeSubTool === 'dhikr' ? (
          <motion.div
            key="dhikr"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            <SubToolHeader title={t.tools.dhikr} />
            <div className={cn(
              "flex-1 rounded-[2.5rem] p-8 flex flex-col items-center justify-between py-12",
              isDark ? "bg-slate-900/50 border border-white/5" : "bg-white border border-slate-200 shadow-sm"
            )}>
              <div className="text-center">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{t.tools.dhikrTotal}</p>
                <h3 className={cn("text-8xl font-black tracking-tighter", isDark ? "text-white" : "text-slate-900")}>{dhikrCount}</h3>
              </div>
              
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => { vibrate(); setDhikrCount(prev => prev + 1); }}
                className={cn(
                  "w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all border-[8px]",
                  isDark 
                    ? "bg-gradient-to-br from-amber-400 to-amber-600 border-white/10 shadow-amber-500/20" 
                    : "bg-gradient-to-br from-blue-500 to-blue-700 border-white shadow-blue-500/20"
                )}
              >
                <Plus size={48} className={isDark ? "text-slate-900" : "text-white"} strokeWidth={3} />
              </motion.button>

              <button 
                onClick={() => { vibrate(); setDhikrCount(0); }}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md",
                  isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-amber-400" : "bg-white text-slate-600 hover:bg-slate-100 hover:text-blue-600 border border-slate-200"
                )}
                title={t.tools.dhikrReset}
              >
                <RotateCcw size={24} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            <SubToolHeader title={t.tools.unitConverter} />
            <div className={cn(
              "flex-1 rounded-[2.5rem] p-8 flex flex-col gap-8",
              isDark ? "bg-slate-900/50 border border-white/5" : "bg-white border border-slate-200 shadow-sm"
            )}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">{t.tools.unitValue}</label>
                  <input 
                    type="number"
                    value={unitValue}
                    onChange={(e) => setUnitValue(e.target.value)}
                    className={cn(
                      "w-full px-6 py-4 rounded-2xl font-black text-xl outline-none transition-all",
                      isDark ? "bg-slate-950 text-white border border-white/5 focus:border-blue-500/50" : "bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-500"
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">{t.tools.unitCategory}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.keys(units).concat(['numberSystem']).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          vibrate();
                          setUnitCategory(cat);
                          const firstUnit = cat === 'numberSystem' ? 'dec' : Object.keys(units[cat])[0];
                          const secondUnit = cat === 'numberSystem' ? 'bin' : (Object.keys(units[cat])[1] || firstUnit);
                          setFromUnit(firstUnit);
                          setToUnit(secondUnit);
                        }}
                        className={cn(
                          "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                          unitCategory === cat
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                            : isDark ? "bg-white/5 text-slate-400 hover:bg-white/10" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">{t.tools.unitFrom}</label>
                    <select 
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className={cn(
                        "w-full px-4 py-4 rounded-2xl font-bold text-sm outline-none",
                        isDark ? "bg-slate-950 text-white border border-white/5" : "bg-slate-50 text-slate-900 border border-slate-200"
                      )}
                    >
                      {unitCategory === 'numberSystem' ? (
                        ['bin', 'Oct', 'dec', 'Hex'].map(u => <option key={u} value={u}>{u}</option>)
                      ) : (
                        Object.keys(units[unitCategory] || {}).map(u => <option key={u} value={u}>{u}</option>)
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">{t.tools.unitTo}</label>
                    <select 
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className={cn(
                        "w-full px-4 py-4 rounded-2xl font-bold text-sm outline-none",
                        isDark ? "bg-slate-950 text-white border border-white/5" : "bg-slate-50 text-slate-900 border border-slate-200"
                      )}
                    >
                      {unitCategory === 'numberSystem' ? (
                        ['bin', 'Oct', 'dec', 'Hex'].map(u => <option key={u} value={u}>{u}</option>)
                      ) : (
                        Object.keys(units[unitCategory] || {}).map(u => <option key={u} value={u}>{u}</option>)
                      )}
                    </select>
                  </div>
                </div>

                <div className={cn(
                  "w-full rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-2",
                  isDark ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-100"
                )}>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t.tools.unitResult}</p>
                  <h3 className={cn("text-4xl font-black", isDark ? "text-white" : "text-blue-600")}>
                    {convertUnit()} <span className="text-lg opacity-50">{toUnit}</span>
                  </h3>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <div className={cn(
                  "w-full p-4 rounded-2xl border flex items-center gap-3",
                  isDark ? "bg-slate-950 border-white/5" : "bg-slate-50 border-slate-200"
                )}>
                  <RefreshCw size={16} className="text-blue-500" />
                  <p className="text-[10px] text-slate-500 font-medium">{t.tools.unitRealtime}</p>
                </div>
                <button 
                  onClick={() => { vibrate(); setUnitValue('1'); setUnitCategory('length'); setFromUnit('m'); setToUnit('km'); }}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2",
                    isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                  )}
                >
                  <RotateCcw size={14} strokeWidth={3} /> Reset Converter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsScreen = ({ theme, onToggleTheme, language, onToggleLanguage, t, user, onUpdateUser }: { theme: 'dark' | 'light', onToggleTheme: () => void, language: Language, onToggleLanguage: () => void, t: any, user: UserProfile, onUpdateUser: (user: UserProfile) => void }) => {
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col h-full gap-8 relative">
      <div className="flex flex-col gap-1">
        <h2 className={cn("font-black text-2xl tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t.settings.title}</h2>
        <p className="text-slate-500 text-xs font-medium">{t.settings.professionalMode}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Appearance Section */}
        <div className="flex flex-col gap-4">
          <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] px-4">{t.settings.appearance}</h4>
          <div className={cn(
            "border overflow-hidden rounded-[2rem]",
            isDark ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200 shadow-sm"
          )}>
            <button
              onClick={() => { vibrate(); onToggleTheme(); }}
              className={cn(
                "w-full flex items-center justify-between p-5 transition-colors text-left",
                isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center",
                  isDark ? "bg-indigo-500/10 text-indigo-400" : "bg-blue-50 text-blue-600"
                )}>
                  {isDark ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div className="flex flex-col">
                  <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {isDark ? t.settings.darkMode : t.settings.lightMode}
                  </span>
                  <span className="text-slate-500 text-[10px] font-medium">{isDark ? t.settings.on : t.settings.off}</span>
                </div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full p-1 transition-colors relative",
                isDark ? "bg-indigo-600" : "bg-slate-200"
              )}>
                <motion.div 
                  animate={{ x: isDark ? 24 : 0 }}
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Language Section */}
        <div className="flex flex-col gap-4">
          <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] px-4">{t.settings.language}</h4>
          <div className={cn(
            "border overflow-hidden rounded-[2rem] p-2 flex gap-2",
            isDark ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200 shadow-sm"
          )}>
            <button
              onClick={() => { if (language !== 'en') { vibrate(); onToggleLanguage(); } }}
              className={cn(
                "flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                language === 'en' 
                  ? (isDark ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-blue-600 text-white shadow-lg shadow-blue-600/20")
                  : (isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-900")
              )}
            >
              {t.settings.english}
            </button>
            <button
              onClick={() => { if (language !== 'bn') { vibrate(); onToggleLanguage(); } }}
              className={cn(
                "flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                language === 'bn' 
                  ? (isDark ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-blue-600 text-white shadow-lg shadow-blue-600/20")
                  : (isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-900")
              )}
            >
              {t.settings.bangla}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col gap-4">
          <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] px-4">{t.settings.about}</h4>
          <div className={cn(
            "border overflow-hidden rounded-[2rem]",
            isDark ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200 shadow-sm"
          )}>
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center",
                  isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                )}>
                  <HelpCircle size={20} />
                </div>
                <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>{t.settings.version}</span>
              </div>
              <span className="text-slate-500 text-[10px] font-black">v2.5.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "mt-auto py-3 px-5 rounded-3xl border text-center relative overflow-hidden group",
        isDark ? "bg-indigo-500/5 border-indigo-500/10" : "bg-blue-50 border-blue-100"
      )}>
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 transition-all group-hover:opacity-40",
          isDark ? "bg-indigo-500" : "bg-blue-500"
        )} />
        <div className="py-1">
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] opacity-50">
            Developed by Wasin
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubTool, setActiveSubTool] = useState<'main' | 'qr' | 'pass' | 'timer' | 'dhikr' | 'unit'>('main');
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('pro_language');
    return (saved as Language) || 'en';
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('pro_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pro_user');
    return saved ? JSON.parse(saved) : {
      name: 'Wasin Ahmed',
      email: 'wasinahmed807@gmail.com',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Wasin`,
      joinedDate: Date.now()
    };
  });

  const { width } = useWindowSize();
  const isDesktop = width >= 1024;

  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('pro_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pro_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('pro_language', language);
  }, [language]);

  const toggleTheme = () => {
    vibrate();
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    vibrate();
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  const navigate = (tab: string, subTool?: any) => {
    vibrate();
    setActiveTab(tab);
    if (subTool) setActiveSubTool(subTool);
    else if (tab !== activeTab) setActiveSubTool('main');
  };

  const renderScreen = () => {
    const props = { theme, language, t };

    switch (activeTab) {
      case 'home': return <HomeScreen user={user} onNavigate={navigate} {...props} />;
      case 'calc': return <CalculatorScreen onNavigate={navigate} {...props} />;
      case 'notes': return <NotesScreen {...props} />;
      case 'tools': return <ToolsScreen activeSubTool={activeSubTool} setActiveSubTool={setActiveSubTool} {...props} />;
      case 'settings': return (
        <SettingsScreen 
          user={user} 
          onUpdateUser={setUser} 
          onToggleTheme={toggleTheme} 
          onToggleLanguage={toggleLanguage}
          {...props} 
        />
      );
      default: return <HomeScreen user={user} onNavigate={navigate} {...props} />;
    }
  };

  const Sidebar = () => {
    const tabs = [
      { id: 'home', icon: Home, label: t.nav.home },
      { id: 'calc', icon: Calculator, label: t.nav.calc },
      { id: 'notes', icon: FileText, label: t.nav.notes },
      { id: 'tools', icon: Zap, label: t.nav.tools },
      { id: 'settings', icon: Settings, label: t.nav.settings },
    ];

    const isDark = theme === 'dark';

    return (
      <div className={cn(
        "w-72 border-r flex flex-col p-8 gap-12 transition-colors",
        isDark ? "bg-slate-900 border-white/5" : "bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full shrink-0 shadow-md border border-slate-200 dark:border-white/10 flex items-center justify-center bg-white p-0.5">
            <img 
              src="https://i.ibb.co/Gf0wg80p/log1.png" 
              alt="Logo" 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className={cn("text-xl font-black tracking-tighter", isDark ? "text-white" : "text-slate-900")}>
            All In <span className="text-blue-600">One</span>
          </h1>
        </div>

        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { vibrate(); navigate(tab.id); }}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm",
                  isActive 
                    ? (isDark ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20" : "bg-blue-600 text-white shadow-xl shadow-blue-600/20") 
                    : (isDark ? "text-slate-500 hover:text-slate-300 hover:bg-white/5" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100")
                )}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className={cn(
          "mt-auto rounded-3xl p-6 flex flex-col gap-4",
          isDark ? "bg-slate-800/50" : "bg-slate-100"
        )}>
          <div className={cn(
            "w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center",
            isDark ? "bg-slate-900 text-slate-500" : "bg-white text-slate-400"
          )}>
            {t.home.overview}
          </div>
        </div>
      </div>
    );
  };

  const isDark = theme === 'dark';

  return (
    <AnimatePresence mode="wait">
      {!isLoaded ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999]"
        >
          <SplashScreen onComplete={() => setIsLoaded(true)} theme={theme} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={cn(
            "min-h-screen flex font-sans selection:bg-indigo-500/30 transition-colors w-full",
            isDark ? "bg-slate-950" : "bg-slate-50"
          )}
        >
          {isDesktop && <Sidebar />}
          
          <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
            {isDesktop && (
              <header className={cn(
                "h-20 border-b flex items-center justify-between px-12 backdrop-blur-xl z-40 transition-colors",
                isDark ? "bg-slate-950/50 border-white/5" : "bg-white/80 border-slate-200"
              )}>
                <div className="flex items-center gap-4">
                  <h2 className={cn("text-lg font-black uppercase tracking-widest", isDark ? "text-white" : "text-slate-900")}>
                    {activeTab === 'home' ? t.home.overview : t.nav[activeTab as keyof typeof t.nav]}
                  </h2>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <Clock size={14} />
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className={cn("w-px h-6", isDark ? "bg-white/5" : "bg-slate-200")} />
                  <button 
                    onClick={toggleTheme}
                    className={cn("p-2 rounded-xl transition-colors", isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-blue-600 hover:bg-blue-50")}
                  >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <button 
                    onClick={toggleLanguage}
                    className={cn("px-3 py-1.5 rounded-xl text-xs font-bold transition-colors", isDark ? "bg-white/5 text-white hover:bg-white/10" : "bg-slate-100 text-slate-900 hover:bg-slate-200")}
                  >
                    {language === 'en' ? 'BN' : 'EN'}
                  </button>
                </div>
              </header>
            )}

            {!isDesktop && (
              <div className={cn(
                "h-16 flex items-center justify-between px-6 border-b transition-colors",
                isDark ? "bg-slate-950 border-white/5" : "bg-white border-slate-200"
              )}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full shrink-0 shadow-sm border border-slate-200 dark:border-white/10 flex items-center justify-center bg-white p-0.5">
                    <img 
                      src="https://i.ibb.co/Gf0wg80p/log1.png" 
                      alt="Logo" 
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h1 className={cn("text-lg font-black tracking-tighter", isDark ? "text-white" : "text-slate-900")}>
                    All In <span className="text-blue-600">One</span>
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={toggleTheme} className={isDark ? "text-slate-400" : "text-slate-500"}>
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                  <button onClick={toggleLanguage} className={cn("text-xs font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {language === 'en' ? 'BN' : 'EN'}
                  </button>
                </div>
              </div>
            )}

            <div className={cn(
              "flex-1 overflow-y-auto scrollbar-hide",
              isDesktop ? "p-12" : "p-6 pb-24"
            )}>
              <div className={cn("mx-auto h-full", isDesktop ? "max-w-5xl" : "max-w-full")}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    {renderScreen()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {!isDesktop && <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} theme={theme} t={t} />}
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
