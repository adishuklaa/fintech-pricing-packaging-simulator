# B2B FinTech Pricing & Packaging Simulator (PayNetix)

An interactive, scenario-based pricing and packaging simulator for "PayNetix", a fictional B2B payments and financial operations platform. This tool is designed for Product Managers, RevOps, and Sales to model out unit economics, customer lifetime value, and profitability across different volume tiers, packaging options, and support models.

---

## 🚀 Product Overview & Vision
**Product Vision:** To empower B2B SaaS platforms and marketplaces with transparent, scalable, and highly configurable payment infrastructure, turning payments from a cost center into a revenue driver.

**What is PayNetix?** A unified platform offering payment processing, multi-currency settlement, advanced fraud protection, and white-label checkout experiences tailored for mid-market and enterprise B2B businesses.

## 🎯 Target Users & ICP
**Ideal Customer Profile (ICP):**
- **Company Size:** Mid-market to Enterprise ($10M - $500M+ ARR)
- **Verticals:** B2B SaaS, B2B Marketplaces, Franchise operations
- **Pain Points:** High transaction fees, poor unit economics on micro-transactions, lack of reporting visibility, manual reconciliation, and high fraud rates.

**User Personas (Simulator Target Audience):**
1. **Sarah, Product Manager:** Needs to understand how introducing a new "Enterprise" tier impacts gross margins.
2. **David, RevOps Director:** Wants to model the profitability of a custom deal with a high-volume marketplace before approving the contract.
3. **Alex, VP of Sales:** Needs a quick way to show prospects the effective rate they will pay compared to legacy providers.

## 💰 Pricing Strategy & Packaging
Our pricing model employs a **hybrid SaaS + Usage-based** approach to capture value from both platform utilization and transaction volume.

**Packaging Tiers:**
- **Starter:** For early-stage B2B startups. $49/mo + 2.9% + 30¢. High variable cost, low fixed cost.
- **Professional:** For scaling businesses. $199/mo + 2.5% + 25¢. Balanced model.
- **Enterprise:** For mature operations. $999/mo + 1.9% + 20¢. High fixed cost, low variable cost to incentivize volume.

**Add-ons & Upsells (Expansion Revenue):**
- Dedicated Support SLAs ($250 - $1500/mo)
- Advanced Fraud Protection ($150/mo)
- Multi-currency Settlement ($100/mo)
- White-label Checkout ($500/mo)

**Positioning:** Premium, reliable, and developer-friendly. We do not compete on price at the bottom of the market; we compete on conversion rates, global reach, and operational efficiency.

## 📊 Unit Economics & Margins
The simulator calculates Gross Profit based on hard assumptions:
- **Interchange Rate:** Estimated at 1.5% blended.
- **Network Fee:** $0.10 per transaction.
- **Server/Compute Cost:** $0.01 per transaction.
- **Support COGS:** Varies by tier ($15 - $1000 per merchant).

*Gross Margin = Total Revenue - (Interchange + Network Fees + Server Costs + Support Costs)*

## 🧪 Pricing Hypotheses & Experiment Roadmap
1. **Hypothesis 1:** By lowering the Enterprise transaction fee to 1.9% but increasing the base to $999, we will increase net retention for merchants processing >$500k/mo.
2. **Hypothesis 2:** Unbundling Advanced Fraud Protection will increase ACV by 15% without negatively impacting win rates.

**Experiment Roadmap:**
- **Q3:** A/B test "Custom Reporting" as a free inclusion in the Professional tier vs. a $50/mo add-on.
- **Q4:** Introduce a volume-based discount threshold (step-pricing) to prevent Enterprise churn to direct acquirers.

## 📈 KPIs & Success Metrics
- **Effective Rate:** Total Revenue / Processing Volume. Must remain competitive (<2.8% blended).
- **Gross Margin %:** Target >40% blended margin.
- **Expansion Revenue:** % of MRR from add-ons and premium support.
- **LTV:CAC Ratio:** Modeled at 4:1 for Professional and Enterprise tiers.

## 🏗️ Architecture & Tech Stack
- **Framework:** React 18 with TypeScript via Vite.
- **Styling:** Tailwind CSS for utility-first, rapid, responsive UI development.
- **Icons:** `lucide-react` for modern, scalable vector icons.
- **Data Visualization:** `recharts` for responsive, composable charting (Bar Charts, Pie Charts).
- **State Management:** React `useState` and `useMemo` for real-time calculation and derived state without performance bottlenecks.

## ⚖️ Tradeoffs & UX Decisions
- **Real-time vs. Submit:** Opted for real-time calculation (via `useMemo`) as inputs change, providing immediate feedback rather than requiring a "Calculate" button. This improves the UX for rapid scenario modeling.
- **Client-side vs. Server-side:** All calculations are done client-side. For a production PM tool with complex machine learning models, this would be moved to a backend (Python/Node.js), but for a prototype, client-side is faster and cheaper.
- **Simplified COGS:** Actual interchange is highly complex (varying by card type, region, etc.). We used a blended flat rate (1.5%) to simplify the prototype while still demonstrating the core concept of margin calculation.

## 📸 Screenshots
*(Assuming actual screenshots are placed in the `screenshots` folder)*
- `screenshots/dashboard.png` - Full view of the pricing simulator.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/adishuklaa/fintech-pricing-packaging-simulator.git
   ```
2. Navigate to the directory:
   ```bash
   cd fintech-pricing-packaging-simulator
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables
No specific environment variables are required for this frontend prototype. Create a `.env.example` if future API integration is planned.

---

## 🎤 Interview Talking Points

### 60-Second Explanation
"I built a B2B FinTech Pricing & Packaging Simulator using React, TypeScript, and Tailwind. It allows Product Managers and RevOps to model real-time unit economics, gross margins, and customer costs by tweaking transaction volumes, subscription tiers, and add-ons. It translates complex interchange and COGS assumptions into visual revenue breakdowns using Recharts."

### The Problem
Pricing in FinTech is notoriously opaque. PMs often struggle to predict how a change in a fixed SaaS fee vs. a variable transaction fee will impact overall gross margins, especially when factoring in underlying network and interchange costs.

### The Decision
I chose to build this as a client-side React application with aggressive use of `useMemo`. This provides an instantaneous, tactile experience where the user can slide numbers and immediately see the margin impact, which is vastly superior to a static spreadsheet.

### Tradeoffs
I traded the extreme accuracy of a real interchange pricing engine (which requires massive lookup tables for card bins) for a blended proxy rate (1.5%). This keeps the prototype lightweight and focused on the *product mechanics* of pricing strategy rather than pure financial engineering.

### Tech Stack Choices
React + Vite for speed. Tailwind for a clean, professional B2B dashboard look. Recharts because it's composable and integrates perfectly with React's component model, allowing for easy updates on state change.

### AI/Automation Approach
AI was utilized to quickly scaffold the boilerplate, generate realistic FinTech placeholder data (like realistic basis points for different tiers), and format the Recharts configurations, allowing me to focus on the business logic and unit economic formulas.

### Key Metrics
The tool specifically tracks **Gross Margin %** and **Effective Rate**, which are the two most critical KPIs for any payment processor balancing profitability with market competitiveness.

### Next Steps / Future Opportunities
- **Save Scenarios:** Allow users to save and compare "Scenario A" vs "Scenario B" side-by-side.
- **API Integration:** Connect to a backend pricing engine (e.g., Stripe Pricing API) to pull live tier data.
- **Monte Carlo Simulations:** Add statistical modeling to predict revenue outcomes based on a distribution of merchant sizes rather than a single input.

### Questions for the Interviewer
- How does your team currently model out the margin impact of pricing changes? 
- What toolset do RevOps and Product share when designing new pricing tiers?

---

## ⚠️ Disclaimer
This is a fictional prototype created for demonstration and portfolio purposes. The pricing, COGS, and metrics do not reflect any real-world financial institution or payment processor. All data is synthetic.
