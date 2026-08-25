import { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  CreditCard,
  PieChart,
  BarChart as BarChartIcon,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';

type Tier = 'starter' | 'professional' | 'enterprise';
type SupportTier = 'standard' | 'priority' | 'dedicated';

interface PricingModel {
  subscription: Record<Tier, number>;
  transactionFee: Record<Tier, number>;
  fixedFee: Record<Tier, number>;
  supportTier: Record<SupportTier, number>;
  features: {
    advancedFraud: number;
    multiCurrency: number;
    customReporting: number;
    whiteLabel: number;
  };
}

const PRICING: PricingModel = {
  subscription: {
    starter: 49,
    professional: 199,
    enterprise: 999
  },
  transactionFee: {
    starter: 0.029, // 2.9%
    professional: 0.025, // 2.5%
    enterprise: 0.019 // 1.9%
  },
  fixedFee: {
    starter: 0.30,
    professional: 0.25,
    enterprise: 0.20
  },
  supportTier: {
    standard: 0,
    priority: 250,
    dedicated: 1500
  },
  features: {
    advancedFraud: 150,
    multiCurrency: 100,
    customReporting: 50,
    whiteLabel: 500
  }
};

const COGS = {
  interchangeRate: 0.015, // 1.5%
  networkFee: 0.10, // $0.10 per tx
  serverCostPerTx: 0.01,
  supportCostPerMerchant: {
    standard: 15,
    priority: 150,
    dedicated: 1000
  }
};

function App() {
  // Inputs
  const [monthlyVolume, setMonthlyVolume] = useState<number>(100000);
  const [txCount, setTxCount] = useState<number>(1000);
  const [merchantCount, setMerchantCount] = useState<number>(1);
  const [tier, setTier] = useState<Tier>('professional');
  const [support, setSupport] = useState<SupportTier>('standard');
  const [features, setFeatures] = useState({
    advancedFraud: false,
    multiCurrency: false,
    customReporting: false,
    whiteLabel: false
  });

  // Derived Values
  const avgTicket = monthlyVolume / (txCount || 1);

  // Calculations
  const calcMetrics = useMemo(() => {
    // 1. Revenue Components
    const subRev = PRICING.subscription[tier] * merchantCount;
    const txRev = (monthlyVolume * PRICING.transactionFee[tier]) + (txCount * PRICING.fixedFee[tier]);
    const supportRev = PRICING.supportTier[support] * merchantCount;
    
    let featuresRev = 0;
    if (features.advancedFraud) featuresRev += PRICING.features.advancedFraud * merchantCount;
    if (features.multiCurrency) featuresRev += PRICING.features.multiCurrency * merchantCount;
    if (features.customReporting) featuresRev += PRICING.features.customReporting * merchantCount;
    if (features.whiteLabel) featuresRev += PRICING.features.whiteLabel * merchantCount;

    const totalRev = subRev + txRev + supportRev + featuresRev;

    // 2. Cost Components (COGS)
    const interchangeCost = monthlyVolume * COGS.interchangeRate;
    const networkCost = txCount * COGS.networkFee;
    const serverCost = txCount * COGS.serverCostPerTx;
    const supportCost = COGS.supportCostPerMerchant[support] * merchantCount;
    
    const totalCogs = interchangeCost + networkCost + serverCost + supportCost;

    // 3. Margins
    const grossProfit = totalRev - totalCogs;
    const grossMarginPct = totalRev > 0 ? (grossProfit / totalRev) * 100 : 0;

    // 4. Effective Rate
    const effectiveRate = monthlyVolume > 0 ? (totalRev / monthlyVolume) * 100 : 0;

    return {
      subRev, txRev, supportRev, featuresRev, totalRev,
      interchangeCost, networkCost, serverCost, supportCost, totalCogs,
      grossProfit, grossMarginPct, effectiveRate
    };
  }, [monthlyVolume, txCount, merchantCount, tier, support, features]);

  // Comparison Data
  const comparisonData = useMemo(() => {
    const tiers: Tier[] = ['starter', 'professional', 'enterprise'];
    return tiers.map(t => {
      const sub = PRICING.subscription[t] * merchantCount;
      const tx = (monthlyVolume * PRICING.transactionFee[t]) + (txCount * PRICING.fixedFee[t]);
      return {
        name: t.charAt(0).toUpperCase() + t.slice(1),
        Subscription: sub,
        Transactions: tx,
        Total: sub + tx
      };
    });
  }, [monthlyVolume, txCount, merchantCount]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-indigo-900 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold">PayNetix B2B Pricing Simulator</h1>
          </div>
          <div className="text-sm font-medium text-indigo-200">
            Internal PM Tool v1.0
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-indigo-600" />
              Volume Assumptions
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Monthly Payment Volume ($)
                </label>
                <input 
                  type="number" 
                  value={monthlyVolume}
                  onChange={e => setMonthlyVolume(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Number of Transactions
                </label>
                <input 
                  type="number" 
                  value={txCount}
                  onChange={e => setTxCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="text-xs text-slate-500 mt-1">Avg Ticket Size: {formatCurrency(avgTicket)}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Number of Merchants / Sub-accounts
                </label>
                <input 
                  type="number" 
                  value={merchantCount}
                  onChange={e => setMerchantCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
              Packaging & Tiering
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Platform Tier</label>
                <select 
                  value={tier}
                  onChange={e => setTier(e.target.value as Tier)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="starter">Starter (2.9% + 30¢ / $49/mo)</option>
                  <option value="professional">Professional (2.5% + 25¢ / $199/mo)</option>
                  <option value="enterprise">Enterprise (1.9% + 20¢ / $999/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Support Level</label>
                <select 
                  value={support}
                  onChange={e => setSupport(e.target.value as SupportTier)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="standard">Standard (Included)</option>
                  <option value="priority">Priority (+$250/mo)</option>
                  <option value="dedicated">Dedicated (+$1,500/mo)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-indigo-600" />
              Add-on Features
            </h2>
            
            <div className="space-y-3">
              {Object.entries({
                advancedFraud: 'Advanced Fraud Protection (+$150/mo)',
                multiCurrency: 'Multi-currency settlement (+$100/mo)',
                customReporting: 'Custom BI Reporting (+$50/mo)',
                whiteLabel: 'White-label checkout (+$500/mo)'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={features[key as keyof typeof features]}
                    onChange={e => setFeatures({...features, [key]: e.target.checked})}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Outputs & Charts */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
              <div className="text-sm font-medium text-slate-500 mb-1">Customer Monthly Cost</div>
              <div className="text-3xl font-bold text-slate-900">{formatCurrency(calcMetrics.totalRev)}</div>
              <div className="text-sm text-slate-500 mt-2">Effective Rate: <span className="font-semibold text-blue-600">{calcMetrics.effectiveRate.toFixed(2)}%</span></div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
              <div className="text-sm font-medium text-slate-500 mb-1">Platform Gross Profit</div>
              <div className="text-3xl font-bold text-slate-900">{formatCurrency(calcMetrics.grossProfit)}</div>
              <div className="text-sm text-slate-500 mt-2">Gross Margin: <span className="font-semibold text-emerald-600">{calcMetrics.grossMarginPct.toFixed(1)}%</span></div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-rose-500">
              <div className="text-sm font-medium text-slate-500 mb-1">Total COGS (Est.)</div>
              <div className="text-3xl font-bold text-slate-900">{formatCurrency(calcMetrics.totalCogs)}</div>
              <div className="text-sm text-slate-500 mt-2">Network + Server + Support</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
                Revenue Breakdown
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Subscription', value: calcMetrics.subRev },
                      { name: 'Tx Fees', value: calcMetrics.txRev },
                      { name: 'Support', value: calcMetrics.supportRev },
                      { name: 'Add-ons', value: calcMetrics.featuresRev }
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickFormatter={(val) => `$${val}`} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                    <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Margin Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                Unit Economics (Monthly)
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Total Revenue</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(calcMetrics.totalRev)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                  <span className="text-rose-700">Interchange & Network Costs</span>
                  <span className="font-semibold text-rose-700">-{formatCurrency(calcMetrics.interchangeCost + calcMetrics.networkCost)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                  <span className="text-rose-700">Platform Hosting & Support</span>
                  <span className="font-semibold text-rose-700">-{formatCurrency(calcMetrics.serverCost + calcMetrics.supportCost)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-800">Gross Profit</span>
                  <span className="font-bold text-emerald-800">{formatCurrency(calcMetrics.grossProfit)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tier Comparison Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <BarChartIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Tier Comparison (Base + Tx Only)
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(val) => `$${val}`} />
                  <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                  <Legend />
                  <Bar dataKey="Subscription" stackId="a" fill="#818cf8" />
                  <Bar dataKey="Transactions" stackId="a" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-slate-500 mt-4 text-center">
              Compares base platform fees and transaction costs across tiers for the specified volume ({formatCurrency(monthlyVolume)}).
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
