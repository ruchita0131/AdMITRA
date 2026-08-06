export interface Campaign {
  id: number;
  name: string;
  budget: number;
  status: 'DRAFT' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
  platform: 'GOOGLE_ADS' | 'META_ADS' | 'TABOOLA' | 'LINKEDIN' | 'TIKTOK';
  targetAudience: string;
  category: string;
  startDate: string;
  endDate: string;
}

export interface AnalyticsEntry {
  id: number;
  campaignId: number;
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  conversion: number;
}

export interface TopCampaign {
  campaignId: number;
  campaignName: string;
  ctr: number;
  spend: number;
}

export interface DashboardSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  averageCtr: number;
}

// ── Demo seed data ────────────────────────────────────────────────────────────

export const DEMO_CAMPAIGNS: Campaign[] = [
  { id: 1, name: 'Taboola Native Summer Blast', budget: 12000, status: 'RUNNING', platform: 'TABOOLA', targetAudience: 'Mobile Gamers 18-35', category: 'Gaming', startDate: '2026-07-01', endDate: '2026-08-31' },
  { id: 2, name: 'Google Search Max Q3', budget: 8500, status: 'RUNNING', platform: 'GOOGLE_ADS', targetAudience: 'E-Commerce Shoppers', category: 'Retail', startDate: '2026-07-15', endDate: '2026-09-15' },
  { id: 3, name: 'Meta Lead Gen Q3', budget: 5000, status: 'PAUSED', platform: 'META_ADS', targetAudience: 'Working Professionals 25-45', category: 'Finance', startDate: '2026-06-01', endDate: '2026-08-01' },
  { id: 4, name: 'LinkedIn B2B Push', budget: 15000, status: 'RUNNING', platform: 'LINKEDIN', targetAudience: 'C-Suite Executives', category: 'SaaS', startDate: '2026-07-01', endDate: '2026-10-01' },
  { id: 5, name: 'TikTok Brand Awareness', budget: 3000, status: 'COMPLETED', platform: 'TIKTOK', targetAudience: 'Gen Z 18-24', category: 'Fashion', startDate: '2026-05-01', endDate: '2026-06-30' },
  { id: 6, name: 'Taboola App Install Drive', budget: 9000, status: 'RUNNING', platform: 'TABOOLA', targetAudience: 'Android Users India', category: 'Apps', startDate: '2026-08-01', endDate: '2026-09-30' },
  { id: 7, name: 'Google Display Network', budget: 4200, status: 'DRAFT', platform: 'GOOGLE_ADS', targetAudience: 'Tech Enthusiasts', category: 'Technology', startDate: '2026-08-15', endDate: '2026-10-15' },
  { id: 8, name: 'Meta Retargeting Wave', budget: 2800, status: 'RUNNING', platform: 'META_ADS', targetAudience: 'Cart Abandoners', category: 'Retail', startDate: '2026-07-20', endDate: '2026-08-20' },
];

function generateAnalytics(campaignId: number, days: number, baseCtr: number, baseSpend: number): AnalyticsEntry[] {
  const entries: AnalyticsEntry[] = [];
  const today = new Date('2026-08-06');
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const impressions = Math.floor(Math.random() * 8000 + 4000);
    const ctr = parseFloat((baseCtr + (Math.random() - 0.5) * 0.8).toFixed(2));
    const clicks = Math.floor(impressions * (ctr / 100));
    const spend = parseFloat((baseSpend * (0.85 + Math.random() * 0.3)).toFixed(2));
    const conversion = parseFloat((Math.random() * 3 + 0.5).toFixed(2));
    entries.push({ id: campaignId * 1000 + i, campaignId, date: date.toISOString().split('T')[0], impressions, clicks, spend, ctr, conversion });
  }
  return entries;
}

export const DEMO_ANALYTICS: AnalyticsEntry[] = [
  ...generateAnalytics(1, 30, 4.2, 320),
  ...generateAnalytics(2, 30, 3.1, 215),
  ...generateAnalytics(3, 30, 2.4, 140),
  ...generateAnalytics(4, 30, 1.8, 480),
  ...generateAnalytics(5, 30, 3.7, 85),
  ...generateAnalytics(6, 30, 4.8, 290),
  ...generateAnalytics(7, 5,  2.1, 90),
  ...generateAnalytics(8, 30, 3.3, 75),
];

export function getDemoDashboard(): DashboardSummary {
  const totalImpressions = DEMO_ANALYTICS.reduce((a, e) => a + e.impressions, 0);
  const totalClicks = DEMO_ANALYTICS.reduce((a, e) => a + e.clicks, 0);
  const totalSpend = parseFloat(DEMO_ANALYTICS.reduce((a, e) => a + e.spend, 0).toFixed(2));
  const averageCtr = parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2));
  return {
    totalCampaigns: DEMO_CAMPAIGNS.length,
    activeCampaigns: DEMO_CAMPAIGNS.filter(c => c.status === 'RUNNING').length,
    totalSpend,
    totalImpressions,
    totalClicks,
    averageCtr,
  };
}

export function getDemoTopCampaigns(): TopCampaign[] {
  return DEMO_CAMPAIGNS.map(c => {
    const analytics = DEMO_ANALYTICS.filter(a => a.campaignId === c.id);
    const impressions = analytics.reduce((a, e) => a + e.impressions, 0);
    const clicks = analytics.reduce((a, e) => a + e.clicks, 0);
    const spend = parseFloat(analytics.reduce((a, e) => a + e.spend, 0).toFixed(2));
    const ctr = impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0;
    return { campaignId: c.id, campaignName: c.name, ctr, spend };
  }).sort((a, b) => b.ctr - a.ctr).slice(0, 5);
}
