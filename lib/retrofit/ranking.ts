import { RetrofitOption, ImplementationComplexity, ImpactLevel } from './types';

export interface ScoringWeights {
  weaknessMatchWeight: number; // default: 35
  thermalImpactWeight: number; // default: 25
  energyBenefitWeight: number; // default: 25
  paybackWeight: number;       // default: 20
  costPenaltyWeight: number;   // default: 10
  complexityPenaltyWeight: number; // default: 10
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  weaknessMatchWeight: 35,
  thermalImpactWeight: 25,
  energyBenefitWeight: 25,
  paybackWeight: 20,
  costPenaltyWeight: 10,
  complexityPenaltyWeight: 10,
};

export function computeRetrofitScore(
  option: RetrofitOption,
  matchedWeaknessCount: number,
  estimatedPaybackYearsAvg: number,
  estimatedCostUSDAvg: number,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): number {
  // 1. Weakness Match Sub-score (0 to 35)
  const matchScore = Math.min(weights.weaknessMatchWeight, matchedWeaknessCount * 12);

  // 2. Thermal Impact Sub-score (0 to 25)
  const impactScore =
    option.thermalImpact === 'HIGH'
      ? weights.thermalImpactWeight
      : option.thermalImpact === 'MEDIUM'
      ? weights.thermalImpactWeight * 0.65
      : weights.thermalImpactWeight * 0.35;

  // 3. Energy Benefit Sub-score (0 to 25)
  const avgEnergyCut = (option.energyImpactRange.minReductionPct + option.energyImpactRange.maxReductionPct) / 2;
  const energyScore = Math.min(weights.energyBenefitWeight, (avgEnergyCut / 20) * weights.energyBenefitWeight);

  // 4. Payback ROI Sub-score (0 to 20)
  // Faster payback = higher score (e.g. 1.5 yrs -> 20 pts, 10 yrs -> 4 pts)
  const paybackScore = Math.max(2, Math.min(weights.paybackWeight, (8 / Math.max(1, estimatedPaybackYearsAvg)) * 10));

  // 5. Cost Penalty (0 to -10)
  // Higher cost incurs a small penalty relative to $200k benchmark
  const costPenalty = Math.min(weights.costPenaltyWeight, (estimatedCostUSDAvg / 150000) * weights.costPenaltyWeight);

  // 6. Complexity Penalty (0 to -10)
  const complexityPenalty =
    option.implementationComplexity === 'COMPLEX'
      ? weights.complexityPenaltyWeight
      : option.implementationComplexity === 'MODERATE'
      ? weights.complexityPenaltyWeight * 0.5
      : 0;

  const totalScore = matchScore + impactScore + energyScore + paybackScore - costPenalty - complexityPenalty;

  return Math.round(Math.max(10, Math.min(100, totalScore)));
}
