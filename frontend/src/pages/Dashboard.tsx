import { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, DollarSign, MousePointerClick, Eye, TrendingUp } from 'lucide-react';

interface Summary {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  averageCtr: number;
}

interface TopCampaign {
  campaignId: number;
  campaignName: string;
  ctr: number;
  spend: number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [topCampaigns, setTopCampaigns] = useState<TopCampaign[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    try {
      const summaryRes = await api.get('/analytics/dashboard');
      setSummary(summaryRes.data);
      
      const topRes = await api.get('/analytics/top');
      setTopCampaigns(topRes.data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // 5-second real-time polling
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const statCards = summary ? [
    { label: 'Active Campaigns', value: summary.activeCampaigns, icon: Activity, color: 'text-primary' },
    { label: 'Total Spend', value: `$${summary.totalSpend.toFixed(2)}`, icon: DollarSign, color: 'text-success' },
    { label: 'Impressions', value: summary.totalImpressions.toLocaleString(), icon: Eye, color: 'text-purple-500' },
    { label: 'Avg. CTR', value: `${summary.averageCtr.toFixed(2)}%`, icon: MousePointerClick, color: 'text-blue-400' },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-textMuted mt-1">Real-time metrics updated every 5 seconds</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-textMuted bg-surface px-3 py-1.5 rounded-full border border-border">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          Live (Last updated: {lastRefreshed.toLocaleTimeString()})
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="glass-panel p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-surface border border-border ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-textMuted text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 text-textMain">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="glass-panel p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-6">Top Campaigns CTR Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCampaigns} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="campaignName" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#f3f4f6', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Bar dataKey="ctr" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold mb-6">Highest Spend</h3>
          <div className="space-y-4">
            {topCampaigns.sort((a,b) => b.spend - a.spend).slice(0, 5).map((camp, idx) => (
              <div key={camp.campaignId} className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border hover:bg-surface transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-textMuted font-bold text-lg w-4">{idx + 1}</span>
                  <div>
                    <p className="font-medium text-sm">{camp.campaignName}</p>
                    <p className="text-xs text-textMuted mt-0.5">CTR: {camp.ctr.toFixed(2)}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success">${camp.spend.toFixed(2)}</p>
                </div>
              </div>
            ))}
            {topCampaigns.length === 0 && <p className="text-textMuted text-sm text-center">No data available</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
