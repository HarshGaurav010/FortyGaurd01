import { ChatMessage } from '@/types/chatbot';
import { BuildingProfile } from '@/types/building';
import { FortyGuardHeatMap } from '@/types/fortyguard';

export class CopilotEngine {
  public generateResponse(
    query: string,
    building?: BuildingProfile,
    heatMap?: FortyGuardHeatMap
  ): ChatMessage {
    const q = query.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const id = `msg-${Date.now()}`;

    let content = '';
    let suggestedActions: string[] = [];
    let dataRef: ChatMessage['dataRef'] = undefined;

    if (q.includes('score') || q.includes('thermal stress') || q.includes('heat risk')) {
      content = `Based on FortyGuard's microclimate heat intelligence for ${building?.name || 'Nexus Horizon Plaza'}, the building currently registers a **Thermal Stress Score of 84/100 (EXTREME)**. Peak surface temperature on the concrete roof reaches **56.8°C**, driving **$44,200/year** in wasted HVAC electricity.`;
      suggestedActions = ['How can I lower the roof heat?', 'Show me ROI calculations', 'Simulate cool roof + window film'];
      dataRef = {
        type: 'THERMAL_SCORE',
        title: 'Thermal Vulnerability Metrics',
        metrics: {
          'Roof Surface LST': '56.8 °C',
          'Urban Heat Island Delta': '+8.4 °C',
          'Facade Exposure': '880 W/m²',
          'HVAC COP Rating': '2.7',
        },
      };
    } else if (q.includes('roi') || q.includes('cost') || q.includes('payback') || q.includes('save')) {
      content = `Implementing the top recommended package (**High-Albedo Cool Roof Coating** + **Nano-Ceramic Window Film**) requires an upfront investment of **$116,200**. It yields **$58,700/year** in energy bill reductions, reaching **100% payback in just 1.9 years** and a 20-year Net Present Value of **$642,000**.`;
      suggestedActions = ['Download audit report', 'Compare green roof vs cool roof', 'Adjust setpoint simulator'];
      dataRef = {
        type: 'ROI_SUMMARY',
        title: 'Financial Return Summary',
        metrics: {
          'CapEx Investment': '$116,200',
          'Annual Electricity Savings': '$58,700',
          'Payback Period': '1.9 Years',
          '20-Year NPV': '$642,000',
        },
      };
    } else if (q.includes('retrofit') || q.includes('recommend') || q.includes('cool roof') || q.includes('window')) {
      content = `Our AI model recommends starting with **Cool Roof Coating (SRI 108)** as the #1 rank intervention. Because the roof accounts for **38% of total building solar heat gain**, applying this high-albedo barrier immediately drops roof LST by **24.7°C** and cuts overall cooling energy by **14.5%**.`;
      suggestedActions = ['Simulate this retrofit', 'Check window film specs', 'Export retrofit proposal'];
      dataRef = {
        type: 'RETROFIT_RECOMMENDATION',
        title: 'Rank #1 Recommended Intervention',
        metrics: {
          'Intervention': 'Cool Roof Coating (SRI 108)',
          'Est. Energy Reduction': '14.5%',
          'Cost per sq ft': '$3.50',
          'Payback': '1.6 Years',
        },
      };
    } else {
      content = `I am your **HeatRetrofit AI Copilot**, connected to FortyGuard's hyperlocal thermal intelligence feed. I can analyze thermal hotspots across your facade and roof, run what-if energy simulations, and calculate ROI for climate interventions on **${building?.name || 'your building'}**. What would you like to explore?`;
      suggestedActions = ['Why is my building so hot?', 'What retrofits give fastest payback?', 'Run a 3D thermal simulation'];
    }

    return {
      id,
      sender: 'assistant',
      content,
      timestamp,
      suggestedActions,
      dataRef,
    };
  }
}

export const copilotEngine = new CopilotEngine();
