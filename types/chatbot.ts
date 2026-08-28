export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  dataRef?: {
    type: 'THERMAL_SCORE' | 'RETROFIT_RECOMMENDATION' | 'ROI_SUMMARY' | 'RETROFIT_COMPARISON' | 'SIMULATION_RESULT' | 'ROADMAP' | 'ASSUMPTIONS';
    title: string;
    metrics: Record<string, string | number>;
    linkUrl?: string;
  };
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  buildingContext?: {
    buildingName: string;
    thermalStressScore: number;
    topIntervention: string;
  };
}
