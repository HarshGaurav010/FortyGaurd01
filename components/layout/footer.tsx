import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Cpu, Database, Activity, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-white/60 dark:bg-[#0c1220] border-t border-gray-100 dark:border-white/06 pt-16 pb-12 overflow-hidden transition-colors duration-300">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent blur-sm" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-100 dark:border-white/06">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand-500 shadow-sm">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                HEATRETROFIT <span className="text-brand-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              Hyperlocal heat-aware building retrofit optimization powered by FortyGuard heat intelligence. Pinpointing thermal stress, predicting cooling energy ROI, and guiding Net Zero upgrades.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Badge variant="brand"><Activity className="w-3 h-3" /> FortyGuard Engine</Badge>
              <Badge variant="green"><ShieldCheck className="w-3 h-3" /> AI Thermal Copilot</Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/analysis" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Building Thermal Analysis</Link></li>
              <li><Link href="/retrofits" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Retrofit Interventions</Link></li>
              <li><Link href="/simulator" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">What-If Energy Simulator</Link></li>
              <li><Link href="/reports" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Audit & ROI Reports</Link></li>
            </ul>
          </div>

          {/* Core Technologies */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest mb-4">Tech Architecture</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2"><Database className="w-3.5 h-3.5 text-cyan-500" /> FortyGuard LST Grid</li>
              <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-indigo-500" /> Three.js 3D Shader</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Zod Validation API</li>
              <li className="flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-amber-500" /> 20-Yr NPV ROI Engine</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li><a href="https://fortyguard.com" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400">FortyGuard Heat Platform <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="#framework" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Project Architecture Flow</a></li>
              <li><Link href="/ai-copilot" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">AI Thermal Copilot</Link></li>
              <li><Link href="/retrofits" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Intervention Guidelines</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} HeatRetrofit AI. Built with FortyGuard Hyperlocal Heat Intelligence.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-500 select-none">Privacy Policy</span>
            <span className="text-slate-500 select-none">Terms of Service</span>
            <span className="text-slate-500 select-none">API Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
