# HeatRetrofit AI — Heat-Aware Building Retrofit & Energy Optimization Platform

> **«Measure the heat. Find the weakness. Retrofit with confidence.»**

HeatRetrofit AI combines FortyGuard hyperlocal microclimate heat intelligence with building structural characteristics to identify thermal weaknesses, recommend high-impact climate retrofits, simulate multi-intervention scenarios, and estimate financial ROI before capital is invested.

---

## 🏗️ Architecture

```
FortyGuard Microclimate Telemetry
              ↓
  Hyperlocal Heat Analysis
              ↓
Building Structural Intelligence
              ↓
  Retrofit Recommendation Engine
              ↓
 Financial ROI & What-If Simulator
              ↓
  HeatRetrofit AI Copilot (Tool-Grounded)
```

---

## ⚡ Key Features

- **Hyperlocal Heat Intelligence**: Integrates FortyGuard high-resolution Land Surface Temperature (LST) grids and Urban Heat Island (UHI) anomaly deltas.
- **Building Thermal Stress Engine**: Evaluates envelope vulnerability scores, peak roof heat loads, south facade solar gain, and wasted cooling utility costs.
- **Rank-Ordered Retrofits**: Recommends high-impact interventions (Cool Roof Coatings, Solar-Control Window Film, Roof Insulation, HVAC Upgrades, External Shading, Vegetation Infrastructure).
- **Multi-Retrofit Scenario Simulator**: Compound diminishing-returns physics model for evaluating combined energy demand reductions and cumulative 20-year cash flow.
- **Tool-Grounded AI Copilot**: Conversational AI grounded directly in application calculation engines with server-side rate limiting and fail-safe fallbacks.
- **Cinematic WebGL & Interaction**: Interactive 3D building digital twin with cursor-reactive rotation, GSAP ScrollTrigger section reveals, and Lenis smooth scrolling.

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/HarshGaurav010/FortyGaurd01.git
cd FortyGaurd01

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# FortyGuard API Configuration (Server-Side Only)
# DO NOT prefix with NEXT_PUBLIC_
FORTYGUARD_API_KEY=your_fortyguard_api_key_here

# Enable Mock Mode for local offline demo (Default: true if no API key is provided)
FORTYGUARD_MOCK_MODE=true
```

> **Note**: Secrets must **never** be prefix-named `NEXT_PUBLIC_` or committed to version control. Production secrets should be configured in your hosting provider's server-side environment variables.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Internal API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/fortyguard/heatmap` | Submits FortyGuard Land Surface Temperature (LST) heatmap tasks for a given US coordinate. |
| `POST` | `/api/fortyguard/environmental` | Retrieves microclimate environmental heat index and irradiance telemetry. |
| `GET` | `/api/fortyguard/status/[activityId]` | Polls asynchronous FortyGuard task processing status. |
| `POST` | `/api/analysis/building` | Computes full thermal stress report, cooling load waste, and envelope vulnerabilities. |
| `POST` | `/api/retrofits/recommend` | Generates rank-ordered climate retrofits and a 3-phase implementation roadmap. |
| `POST` | `/api/retrofits/simulate` | Simulates multi-retrofit What-If scenarios with compound diminishing returns. |
| `POST` | `/api/roi/calculate` | Computes CapEx investment, annual savings, payback period, and 20-year Net Present Value (NPV). |
| `POST` | `/api/chatbot` | Handles tool-grounded AI Copilot queries with server-side rate limiting and fail-safe fallback. |

---

## 🔒 Security & Safety

- **Server-Side Credentials**: FortyGuard and AI provider API keys remain 100% server-side.
- **Input Validation**: API payloads are strictly parsed using Zod schemas (`ChatQuerySchema`, `BuildingProfileSchema`, `SimulateScenarioSchema`).
- **Rate Limiting**: Server-side token bucket rate limiter protects endpoints against brute-force abuse.
- **Fail-Safe Fallbacks**: If external API services are degraded, the application maintains core UI availability in offline mock mode.

---

## 📜 License & Acknowledgments

Powered by **FortyGuard Microclimate Heat Intelligence**.
