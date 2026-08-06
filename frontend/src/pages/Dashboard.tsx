import { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, DollarSign, Eye, MousePointerClick, TrendingUp, RefreshCw, Trophy } from 'lucide-react';
import api from '../api/axios';
import { getDemoDashboard, getDemoTopCampaigns, DEMO_ANALYTICS, type DashboardSummary, type TopCampaign } from '../data/demoData';

const isDemo = () => localStorage.getItem('demo') === 'true';

const PLATFORM_COLORS: Record<string, string> = {
  INMOBI: '#6366f1', GOOGLE_ADS: '#34d399', META_ADS: '#f59e0b', LINKEDIN: '#3b82f6', TIKTOK: '#ec4899',
};

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [topCampaigns, setTopCampaigns] = useState<TopCampaign[]>([]);
  const [chartData, setChartData] = useState<{ date: string; ctr: number; spend: number; clicks: number }[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isLive] = useState(true);

  const loadDemoData = useCallback(() => {
    setSummary(getDemoDashboard());
    setTopCampaigns(getDemoTopCampaigns());
    // Aggregate last 14 days chart data
    const last14 = [...new Set(DEMO_ANALYTICS.map(a => a.date))].sort().slice(-14);
    const grouped = last14.map(date => {
      const entries = DEMO_ANALYTICS.filter(a => a.date === date);
      const impressions = entries.reduce((s, e) => s + e.impressions, 0);
      const clicks = entries.reduce((s, e) => s + e.clicks, 0);
      const spend = entries.reduce((s, e) => s + e.spend, 0);
      const ctr = impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0;
      return { date: date.slice(5), ctr, spend: parseFloat(spend.toFixed(0)), clicks };
    });
    setChartData(grouped);
    setLastRefreshed(new Date());
  }, []);

  const loadLiveData = useCallback(async () => {
    try {
      const [sumRes, topRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/top'),
      ]);
      setSummary(sumRes.data);
      setTopCampaigns(topRes.data);
      setLastRefreshed(new Date());
    } catch { /* backend may not be up */ }
  }, []);

  useEffect(() => {
    if (isDemo()) { loadDemoData(); return; }
    loadLiveData();
    const iv = setInterval(loadLiveData, 5000);
    return () => clearInterval(iv);
  }, [loadDemoData, loadLiveData]);

  const metrics = summary ? [
    { label: 'Total Campaigns', value: summary.totalCampaigns.toString(), icon: Activity, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', delta: '+2 this month' },
    { label: 'Active Campaigns', value: summary.activeCampaigns.toString(), icon: TrendingUp, color: '#34d399', bg: 'rgba(52,211,153,0.1)', delta: 'Running now' },
    { label: 'Total Spend', value: `$${summary.totalSpend.toLocaleString()}`, icon: DollarSign, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', delta: 'Budget utilised' },
    { label: 'Avg. CTR', value: `${summary.averageCtr}%`, icon: MousePointerClick, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', delta: 'Across all campaigns' },
    { label: 'Total Impressions', value: summary.totalImpressions.toLocaleString(), icon: Eye, color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', delta: 'Total reach' },
  ] : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="card px-3 py-2 text-xs" style={{ background: '#13131f' }}>
        <p className="text-[#5a5c70] mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
            {p.dataKey === 'ctr' ? `${p.value}% CTR` : p.dataKey === 'spend' ? `$${p.value} spend` : `${p.value} clicks`}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-[#5a5c70] mt-0.5">
            {isDemo() ? 'Viewing pre-loaded sample data for all 8 campaigns' : 'Real-time metrics across all campaigns'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
          style={{ background: isLive ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isLive ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}` }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-emerald-400 font-medium">{isDemo() ? 'Demo Mode' : 'Live'}</span>
          <span className="text-[#5a5c70]">· {lastRefreshed.toLocaleTimeString()}</span>
          {!isDemo() && <RefreshCw className="w-3 h-3 text-[#5a5c70]" />}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg" style={{ background: m.bg }}>
                <m.icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{m.value}</p>
            <p className="text-xs font-medium text-[#5a5c70]">{m.label}</p>
            <p className="text-[10px] text-[#3a3c50] mt-1">{m.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Performance Trends</h3>
              <p className="text-xs text-[#5a5c70] mt-0.5">Last 14 days — CTR & Spend</p>
            </div>
          </div>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCtr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" stroke="#3a3c50" tick={{ fontSize: 11, fill: '#5a5c70' }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#3a3c50" tick={{ fontSize: 11, fill: '#5a5c70' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="ctr" stroke="#6366f1" strokeWidth={2} fill="url(#gradCtr)" dot={false} />
                  <Area type="monotone" dataKey="spend" stroke="#34d399" strokeWidth={2} fill="url(#gradSpend)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-[#3a3c50]">Loading chart data...</div>
          )}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 text-xs text-[#5a5c70]"><span className="w-3 h-0.5 rounded bg-indigo-500 inline-block" /> CTR (%)</div>
            <div className="flex items-center gap-2 text-xs text-[#5a5c70]"><span className="w-3 h-0.5 rounded bg-emerald-400 inline-block" /> Spend ($)</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-white">Top Campaigns</h3>
          </div>
          <div className="space-y-3">
            {topCampaigns.map((c, i) => (
              <div key={c.campaignId} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/[0.02]"
                style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-[#3a3c50] font-bold text-sm w-4 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.campaignName}</p>
                  <p className="text-xs text-[#5a5c70]">${c.spend.toLocaleString()} spend</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-400">{c.ctr}%</p>
                  <p className="text-[10px] text-[#4a4c5c]">CTR</p>
                </div>
              </div>
            ))}
            {topCampaigns.length === 0 && (
              <p className="text-sm text-[#3a3c50] text-center py-8">No campaigns yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
