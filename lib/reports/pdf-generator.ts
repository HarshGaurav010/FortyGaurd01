import { jsPDF } from 'jspdf';
import { DemoBuildingScenario } from '@/lib/demo/building-scenarios';
import { BuildingProfile, BuildingThermalStressReport } from '@/types/building';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';

export interface AuditPDFInput {
  selectedScenario: DemoBuildingScenario;
  buildingProfile: BuildingProfile;
  thermalReport: BuildingThermalStressReport;
  roiData: {
    combinedPackage: {
      packageName: string;
      totalCostUSD: number;
      annualSavingsUSD: number;
      combinedEnergyReductionPct: number;
      overallPaybackYears: number;
      overall20YrROIPct: number;
      totalCarbonOffsetTons20Yr: number;
    };
    interventions: Array<{
      id: string;
      name: string;
      category: string;
      expectedCoolingEnergyReductionPct: number;
      estTotalCostUSD: number;
      expectedAnnualSavingsUSD: number;
      paybackPeriodYears: number;
      carbonOffsetTonsPerYear: number;
    }>;
  };
}

/**
 * Constructs the structured executive PDF audit report jsPDF document
 * for the selected building scenario without external cloud dependencies.
 */
export function createAuditPDFDoc({
  selectedScenario,
  buildingProfile,
  thermalReport,
  roiData,
}: AuditPDFInput): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // ── HEADER BANNER ──────────────────────────────────────────────
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, 12, contentWidth, 24, 2, 2, 'F');

  // Title in header
  doc.setTextColor(6, 182, 212); // cyan-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('HEATRETROFIT AI', margin + 6, 20);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text('Executive Heat Retrofit & Building Energy Audit', margin + 6, 28);

  // Right side badges in header
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text('MODELED ENERGY AUDIT', margin + contentWidth - 6, 19, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`Asset ID: ${selectedScenario.id}`, margin + contentWidth - 6, 25, { align: 'right' });

  const auditDateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Audit Date: ${auditDateStr}`, margin + contentWidth - 6, 31, { align: 'right' });

  // ── FACILITY IDENTITY ──────────────────────────────────────────
  let y = 43;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(selectedScenario.name, margin, y);

  y += 5.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(
    `Location: ${selectedScenario.location.city}, ${selectedScenario.location.state}, USA   •   Condition: ${selectedScenario.conditionDescription}   •   Methodology: Deterministic Scenario Simulation`,
    margin,
    y
  );

  // ── SECTION 1: 4 FINANCIAL KPI CARDS ───────────────────────────
  y += 8;
  const cardWidth = (contentWidth - 9) / 4; // ~43.25mm
  const cardHeight = 22;

  const kpis = [
    {
      title: 'TOTAL CAPEX PACKAGE',
      value: formatCurrency(roiData.combinedPackage.totalCostUSD),
      subtext: 'Turnkey Installation',
      color: [14, 116, 144], // cyan-700
      bg: [240, 249, 255],
      border: [186, 230, 253],
    },
    {
      title: 'ANNUAL UTILITY SAVINGS',
      value: `${formatCurrency(roiData.combinedPackage.annualSavingsUSD)}/yr`,
      subtext: 'Electricity Avoidance',
      color: [180, 83, 9], // amber-700
      bg: [254, 243, 199],
      border: [253, 230, 138],
    },
    {
      title: 'PAYBACK HORIZON',
      value: `${roiData.combinedPackage.overallPaybackYears} Yrs`,
      subtext: 'Capital Recovery',
      color: [4, 120, 87], // emerald-700
      bg: [236, 253, 245],
      border: [167, 243, 208],
    },
    {
      title: '20-YR CARBON OFFSET',
      value: `${roiData.combinedPackage.totalCarbonOffsetTons20Yr} t`,
      subtext: 'Avoided CO2e',
      color: [67, 56, 202], // indigo-700
      bg: [238, 242, 255],
      border: [199, 210, 254],
    },
  ];

  kpis.forEach((kpi, index) => {
    const cardX = margin + index * (cardWidth + 3);
    doc.setFillColor(kpi.bg[0], kpi.bg[1], kpi.bg[2]);
    doc.setDrawColor(kpi.border[0], kpi.border[1], kpi.border[2]);
    doc.roundedRect(cardX, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.title, cardX + 3.5, y + 5.5);

    doc.setFontSize(11);
    doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.text(kpi.value, cardX + 3.5, y + 13.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.subtext, cardX + 3.5, y + 18.5);
  });

  // ── SECTION 2: ARCHITECTURE & BASELINE THERMAL (2-COL) ─────────
  y += cardHeight + 7;
  const colWidth = (contentWidth - 6) / 2; // 88mm
  const colHeight = 63;

  // Box 1: Architecture
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, colWidth, colHeight, 2, 2, 'FD');

  // Header Box 1
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, colWidth, 7.5, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('FACILITY ARCHITECTURE & SPECIFICATIONS', margin + 4, y + 5);

  const archSpecs = [
    { label: 'Asset Name / ID:', val: `${selectedScenario.name} (${selectedScenario.id})` },
    { label: 'Facility Location:', val: `${selectedScenario.location.city}, ${selectedScenario.location.state}, USA` },
    { label: 'Gross Floor Area:', val: `${formatNumber(buildingProfile.grossAreaSqFt)} sq ft (${buildingProfile.floorsCount} floors)` },
    { label: 'Roof Envelope:', val: `${formatNumber(buildingProfile.roofAreaSqFt)} sq ft (${buildingProfile.roofType.replace(/_/g, ' ')})` },
    { label: 'Thermal Resistance:', val: `Roof R-${buildingProfile.roofRValue ?? 8.5} • Wall R-${buildingProfile.wallInsulationRValue}` },
    { label: 'Glazing Ratio (WWR):', val: `${Math.round(buildingProfile.windowToWallRatio * 100)}% (${buildingProfile.windowType.replace(/_/g, ' ')})` },
    { label: 'HVAC Infrastructure:', val: `Age ${buildingProfile.hvacAgeYears} yrs • Efficiency COP ${buildingProfile.hvacEfficiencyCOP}` },
    { label: 'Baseline Energy / Peak:', val: `${formatNumber(buildingProfile.baselineAnnualEnergykWh)} kWh/yr • ${buildingProfile.baselinePeakDemandKW} kW` },
  ];

  let specY = y + 13;
  archSpecs.forEach((spec) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(spec.label, margin + 4, specY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(spec.val, margin + colWidth - 4, specY, { align: 'right' });
    specY += 6;
  });

  // Box 2: Thermal Stress Baseline
  const col2X = margin + colWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col2X, y, colWidth, colHeight, 2, 2, 'FD');

  // Header Box 2
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(col2X, y, colWidth, 7.5, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('BASELINE THERMAL EVALUATION & LOAD', col2X + 4, y + 5);

  const totalBaselineCoolingKW = thermalReport.facadeHeatGainKW + thermalReport.roofHeatGainKW;
  const thermalSpecs = [
    { label: 'Thermal Stress Score:', val: `${thermalReport.thermalStressScore}/100 (${thermalReport.stressCategory})`, highlight: true },
    { label: 'Cooling Heat Stress Load:', val: `${formatNumber(totalBaselineCoolingKW)} kW`, bold: true },
    { label: 'Facade Heat Ingress:', val: `${formatNumber(thermalReport.facadeHeatGainKW)} kW` },
    { label: 'Roof Heat Ingress:', val: `${formatNumber(thermalReport.roofHeatGainKW)} kW` },
    { label: 'Solar Exposure Rating:', val: `${thermalReport.solarExposureRating} / 10` },
    { label: 'Urban Heat Island Delta:', val: `+${thermalReport.urbanHeatIslandImpactDeltaC}°C Microclimate` },
    { label: 'Annual Cooling Penalty:', val: `${formatCurrency(thermalReport.annualCoolingWasteCostUSD)}/yr` },
    { label: 'Baseline Carbon Footprint:', val: `${thermalReport.carbonFootprintTonsCO2} t CO2/year` },
  ];

  specY = y + 13;
  thermalSpecs.forEach((spec) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(spec.label, col2X + 4, specY);

    if (spec.highlight) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(225, 29, 72); // rose-600
    } else {
      doc.setFont('helvetica', spec.bold ? 'bold' : 'normal');
      doc.setTextColor(15, 23, 42);
    }
    doc.text(spec.val, col2X + colWidth - 4, specY, { align: 'right' });
    specY += 6;
  });

  // ── SECTION 3: RECOMMENDED INTERVENTION SCHEDULE (TABLE) ───────
  y += colHeight + 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('RECOMMENDED INTERVENTION PACKAGE SCHEDULE', margin, y);

  y += 3.5;
  const tableY = y;
  const tableHeaderHeight = 6.5;
  const rowHeight = 7.5;

  // Table header background
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, tableY, contentWidth, tableHeaderHeight, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, tableY + tableHeaderHeight, margin + contentWidth, tableY + tableHeaderHeight);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);

  const colX = {
    strategy: margin + 3,
    reduction: margin + 85,
    capex: margin + 115,
    savings: margin + 145,
    payback: margin + 179,
  };

  doc.text('INTERVENTION STRATEGY', colX.strategy, tableY + 4.5);
  doc.text('COOLING CUT', colX.reduction, tableY + 4.5);
  doc.text('EST. CAPEX', colX.capex, tableY + 4.5);
  doc.text('ANNUAL SAVINGS', colX.savings, tableY + 4.5);
  doc.text('PAYBACK', colX.payback, tableY + 4.5, { align: 'right' });

  // Table rows
  const topInterventions = roiData.interventions.slice(0, 4);
  let currentRowY = tableY + tableHeaderHeight;

  topInterventions.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentRowY, contentWidth, rowHeight, 'F');
    }

    // Row divider
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentRowY + rowHeight, margin + contentWidth, currentRowY + rowHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    // Truncate name if too long
    const cleanName = item.name.length > 46 ? `${item.name.slice(0, 45)}...` : item.name;
    doc.text(cleanName, colX.strategy, currentRowY + 5);

    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text(`-${item.expectedCoolingEnergyReductionPct}%`, colX.reduction, currentRowY + 5);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(formatCurrency(item.estTotalCostUSD), colX.capex, currentRowY + 5);

    doc.setTextColor(217, 119, 6); // amber-600
    doc.text(`${formatCurrency(item.expectedAnnualSavingsUSD)}/yr`, colX.savings, currentRowY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 116, 144); // cyan-700
    doc.text(`${item.paybackPeriodYears} Yrs`, colX.payback, currentRowY + 5, { align: 'right' });

    currentRowY += rowHeight;
  });

  // ── SECTION 4: AUDIT METHODOLOGY & COMPLIANCE BOX ──────────────
  y = currentRowY + 6;
  const methodBoxHeight = 27;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, methodBoxHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('AUDIT METHODOLOGY & MODELING ASSUMPTIONS', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text(
    '1. Thermal Physics: Building thermal stress evaluation synthesizes FortyGuard hyperlocal microclimate land surface temperature (LST)',
    margin + 4,
    y + 9.5
  );
  doc.text(
    '   telemetry with building envelope footprint, orientation solar factors, window-to-wall ratios (WWR), and roof surface thermal heat gains.',
    margin + 4,
    y + 13.5
  );
  doc.text(
    '2. Financial Modeling: CapEx figures represent turnkey installation cost ranges scaled to building roof and facade areas.',
    margin + 4,
    y + 17.5
  );
  doc.text(
    '   Annual savings assume application-configured baseline energy consumption and a $0.14/kWh blended commercial electricity rate.',
    margin + 4,
    y + 21.5
  );
  doc.text(
    '3. Audit Context: Modeled deterministic baseline generated for portfolio evaluation and pre-feasibility capital planning.',
    margin + 4,
    y + 25.5
  );

  // ── FOOTER ─────────────────────────────────────────────────────
  const footerY = pageHeight - 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `HeatRetrofit AI Executive Audit • Scenario ID: ${selectedScenario.id} • ${selectedScenario.name}`,
    margin,
    footerY
  );
  doc.text('Page 1 of 1 • Local Confidential Document', margin + contentWidth, footerY, { align: 'right' });

  return doc;
}

/**
 * Generates and triggers browser download of the audit PDF document.
 */
export function generateAuditPDF(input: AuditPDFInput): void {
  const doc = createAuditPDFDoc(input);
  const safeFilename = `HeatRetrofit_Audit_${input.selectedScenario.name.replace(/[^a-zA-Z0-9]/g, '_')}_${input.selectedScenario.id}.pdf`;
  doc.save(safeFilename);
}
