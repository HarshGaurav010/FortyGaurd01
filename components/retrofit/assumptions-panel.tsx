'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Info, HelpCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { CENTRAL_RETROFIT_ASSUMPTIONS, RETROFIT_UNIT_ASSUMPTIONS } from '@/lib/retrofit/assumptions';

interface AssumptionsPanelProps {
  customElectricityRate?: number;
}

export const AssumptionsPanel: React.FC<AssumptionsPanelProps> = ({ customElectricityRate }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const rate = customElectricityRate || CENTRAL_RETROFIT_ASSUMPTIONS.defaultElectricityRateUSDPerKWh;

  return (
    <>
      <div className="flex items-center justify-between p-3 rounded-xl bg-dark-950/80 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-400">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Calculations based on configurable commercial energy rates & unit cost assumptions.</span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="text-cyan-400 hover:text-cyan-300 underline font-bold transition-colors flex items-center gap-1 shrink-0"
        >
          View Assumptions →
        </button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Model Assumptions & Calculation Basis">
        <div className="space-y-6 text-xs text-slate-300 font-mono">
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
            <span className="text-cyan-300 font-bold block text-sm">Transparency Disclaimer</span>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              All financial costs, payback periods, and energy reductions are **modeled estimates** derived from commercial building benchmarks and microclimate heat stress telemetry. No universal fixed installation price is claimed.
            </p>
          </div>

          {/* Key Parameters */}
          <div className="space-y-2">
            <span className="text-white font-bold block text-sm font-sans">1. Utility & Operational Parameters</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Commercial Electricity Rate</span>
                <span className="text-sm font-bold text-emerald-400">${rate} / kWh</span>
              </div>
              <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">HVAC Share of Building Load</span>
                <span className="text-sm font-bold text-amber-400">{CENTRAL_RETROFIT_ASSUMPTIONS.coolingEnergyShareOfTotalBuildingPct * 100}% of total kWh</span>
              </div>
              <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">NPV Financial Discount Rate</span>
                <span className="text-sm font-bold text-cyan-400">{CENTRAL_RETROFIT_ASSUMPTIONS.discountRatePct * 100}% per annum</span>
              </div>
              <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Annual Tariff Escalation</span>
                <span className="text-sm font-bold text-indigo-400">+{CENTRAL_RETROFIT_ASSUMPTIONS.annualElectricityPriceEscalationPct * 100}% / year</span>
              </div>
            </div>
          </div>

          {/* Unit Cost Ranges */}
          <div className="space-y-2">
            <span className="text-white font-bold block text-sm font-sans">2. Illustrative Retrofit Cost Ranges</span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">External Solar Shading</span>
                <span className="text-cyan-300 font-bold">{RETROFIT_UNIT_ASSUMPTIONS.EXTERNAL_SHADING.unitLabel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Roof Insulation (R-20+)</span>
                <span className="text-cyan-300 font-bold">{RETROFIT_UNIT_ASSUMPTIONS.ROOF_INSULATION.unitLabel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Cool Roof Coating (SRI 108)</span>
                <span className="text-cyan-300 font-bold">{RETROFIT_UNIT_ASSUMPTIONS.COOL_ROOF.unitLabel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Solar-Control Window Glazing</span>
                <span className="text-cyan-300 font-bold">{RETROFIT_UNIT_ASSUMPTIONS.SOLAR_GLAZING.unitLabel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Smart HVAC & Chiller Optimization</span>
                <span className="text-cyan-300 font-bold">{RETROFIT_UNIT_ASSUMPTIONS.HVAC_UPGRADE.unitLabel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Biosolar Green Roof Vegetation</span>
                <span className="text-cyan-300 font-bold">{RETROFIT_UNIT_ASSUMPTIONS.VEGETATION.unitLabel}</span>
              </div>
            </div>
          </div>

          {/* Model Caveats */}
          <div className="space-y-2">
            <span className="text-white font-bold block text-sm font-sans">3. Model Limitations</span>
            <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
              {CENTRAL_RETROFIT_ASSUMPTIONS.disclaimers.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};
