import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { Plus, Play, Pause, Trash2, Search, Filter, X, Megaphone, Calendar, DollarSign, Users } from 'lucide-react';
import { DEMO_CAMPAIGNS, type Campaign } from '../data/demoData';

const isDemo = () => localStorage.getItem('demo') === 'true';

const PLATFORM_LABELS: Record<string, { name: string; color: string }> = {
  TABOOLA: { name: 'Taboola', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  GOOGLE_ADS: { name: 'Google Ads', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  META_ADS: { name: 'Meta Ads', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  LINKEDIN: { name: 'LinkedIn', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  TIKTOK: { name: 'TikTok', color: 'bg-pink-500/15 text-pink-400 border-pink-500/30' },
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', budget: '', platform: 'TABOOLA', targetAudience: '', category: 'General', startDate: '', endDate: ''
  });

  const fetchCampaigns = useCallback(async () => {
    if (isDemo()) {
      setCampaigns(DEMO_CAMPAIGNS);
      return;
    }
    try {
      const res = await api.get('/campaigns');
      setCampaigns(res.data);
    } catch {
      console.error("Failed to fetch campaigns");
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    if (isDemo()) {
      setCampaigns(prev => prev.map(c => {
        if (c.id === id) {
          const nextStatus = currentStatus === 'RUNNING' ? 'PAUSED' : 'RUNNING';
          return { ...c, status: nextStatus as any };
        }
        return c;
      }));
      return;
    }
    try {
      if (currentStatus === 'RUNNING') {
        await api.patch(`/campaign/${id}/pause`);
      } else {
        await api.patch(`/campaign/${id}/resume`);
      }
      fetchCampaigns();
    } catch {
      console.error("Failed to change status");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      if (isDemo()) {
        setCampaigns(prev => prev.filter(c => c.id !== id));
        return;
      }
      try {
        await api.delete(`/campaign/${id}`);
        fetchCampaigns();
      } catch {
        console.error("Failed to delete campaign");
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: Campaign = {
      id: Date.now(),
      name: formData.name,
      budget: parseFloat(formData.budget),
      platform: formData.platform as any,
      status: 'DRAFT',
      targetAudience: formData.targetAudience || 'General Audience',
      category: formData.category || 'General',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || new Date(Date.now() + 30*86400000).toISOString().split('T')[0],
    };

    if (isDemo()) {
      setCampaigns(prev => [newCamp, ...prev]);
      setIsModalOpen(false);
      setFormData({ name: '', budget: '', platform: 'INMOBI', targetAudience: '', category: 'General', startDate: '', endDate: '' });
      return;
    }

    try {
      await api.post('/campaign', {
        name: formData.name,
        budget: parseFloat(formData.budget),
        platform: formData.platform,
        targetAudience: formData.targetAudience,
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      setIsModalOpen(false);
      setFormData({ name: '', budget: '', platform: 'INMOBI', targetAudience: '', category: 'General', startDate: '', endDate: '' });
      fetchCampaigns();
    } catch {
      alert('Failed to create campaign');
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-sm text-[#5a5c70] mt-0.5">Manage, track, and optimize your ad spend across platforms</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#5a5c70]" />
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search campaigns or categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-[#5a5c70] shrink-0" />
          {['ALL', 'RUNNING', 'PAUSED', 'COMPLETED', 'DRAFT'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                statusFilter === status 
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-[#5a5c70] hover:text-[#e2e4ea] hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#12121c] border-b border-white/[0.06] text-[#5a5c70] text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Audience</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredCampaigns.map(camp => {
                const plat = PLATFORM_LABELS[camp.platform] || { name: camp.platform, color: 'bg-white/10 text-white' };
                return (
                  <tr key={camp.id} className="table-row">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{camp.name}</div>
                      <div className="text-xs text-[#5a5c70] flex items-center gap-2 mt-1">
                        <span>{camp.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {camp.startDate} to {camp.endDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${plat.color}`}>
                        {plat.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge badge-${camp.status.toLowerCase()}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                        {camp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      ${camp.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#7a7c8a]">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#5a5c70]"/> {camp.targetAudience}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStatusToggle(camp.id, camp.status)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#9a9cb0] hover:text-white transition-colors"
                          title={camp.status === 'RUNNING' ? 'Pause Campaign' : 'Resume Campaign'}
                        >
                          {camp.status === 'RUNNING' ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                        </button>
                        <button
                          onClick={() => handleDelete(camp.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/15 text-[#9a9cb0] hover:text-red-400 transition-colors"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#5a5c70]">
                    <Megaphone className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    No campaigns found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
              <h2 className="text-lg font-bold text-white">Create New Campaign</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#5a5c70] hover:text-white"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Campaign Name</label>
                <input required type="text" className="input-field" placeholder="e.g. InMobi Retargeting Q4" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Budget ($)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-3 text-[#5a5c70]" />
                    <input required type="number" min="0" step="100" className="input-field pl-9" placeholder="5000" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="label">Platform</label>
                  <select className="input-field bg-[#141420]" value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})}>
                    <option value="TABOOLA">Taboola</option>
                    <option value="GOOGLE_ADS">Google Ads</option>
                    <option value="META_ADS">Meta Ads</option>
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="TIKTOK">TikTok</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Target Audience</label>
                  <input type="text" className="input-field" placeholder="e.g. Gamers 18-35" value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})} />
                </div>
                <div>
                  <label className="label">Category</label>
                  <input type="text" className="input-field" placeholder="e.g. Gaming" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date</label>
                  <input required type="date" className="input-field" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input required type="date" className="input-field" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/[0.06] mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
