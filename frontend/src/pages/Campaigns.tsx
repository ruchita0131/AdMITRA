import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Play, Pause, Trash2, X } from 'lucide-react';

interface Campaign {
  id: number;
  name: string;
  budget: number;
  status: string;
  platform: string;
  targetAudience: string;
  category: string;
  startDate: string;
  endDate: string;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', budget: '', platform: 'GOOGLE_ADS', targetAudience: '', category: '', startDate: '', endDate: ''
  });

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/campaigns');
      setCampaigns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleStatusChange = async (id: number, currentStatus: string) => {
    try {
      if (currentStatus === 'RUNNING') {
        await api.patch(`/campaign/${id}/pause`);
      } else {
        await api.patch(`/campaign/${id}/resume`);
      }
      fetchCampaigns();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm('Are you sure you want to delete this campaign?')) {
      try {
        await api.delete(`/campaign/${id}`);
        fetchCampaigns();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/campaign', {
        ...formData,
        budget: parseFloat(formData.budget)
      });
      setIsModalOpen(false);
      setFormData({ name: '', budget: '', platform: 'GOOGLE_ADS', targetAudience: '', category: '', startDate: '', endDate: '' });
      fetchCampaigns();
    } catch (err) {
      console.error(err);
      alert('Failed to create campaign');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'RUNNING': return 'bg-success/20 text-success border-success/30';
      case 'PAUSED': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'COMPLETED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-surface text-textMuted border-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-textMuted mt-1">Manage your digital advertising campaigns</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/50 border-b border-border text-textMuted">
              <tr>
                <th className="px-6 py-4 font-medium">Campaign Name</th>
                <th className="px-6 py-4 font-medium">Platform</th>
                <th className="px-6 py-4 font-medium">Budget</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-surface/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-textMain">{camp.name}</td>
                  <td className="px-6 py-4 text-textMuted">{camp.platform.replace('_', ' ')}</td>
                  <td className="px-6 py-4 font-medium text-success">${camp.budget}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(camp.status)}`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-textMuted text-xs">
                    {camp.startDate} <br/> {camp.endDate}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleStatusChange(camp.id, camp.status)}
                      className="p-2 bg-surface hover:bg-border rounded-lg text-textMuted transition-colors"
                      title={camp.status === 'RUNNING' ? 'Pause' : 'Resume'}
                    >
                      {camp.status === 'RUNNING' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(camp.id)} className="p-2 bg-surface hover:bg-danger/20 hover:text-danger rounded-lg text-textMuted transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-textMuted">
                    No campaigns found. Create your first campaign!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Create New Campaign</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-textMuted hover:text-textMain"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label-text">Campaign Name</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Budget ($)</label>
                  <input required type="number" min="0" step="0.01" className="input-field" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                </div>
                <div>
                  <label className="label-text">Platform</label>
                  <select className="input-field" value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})}>
                    <option value="GOOGLE_ADS">Google Ads</option>
                    <option value="META_ADS">Meta Ads</option>
                    <option value="INMOBI">InMobi</option>
                    <option value="LINKEDIN">LinkedIn</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Start Date</label>
                  <input required type="date" className="input-field" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="label-text">End Date</label>
                  <input required type="date" className="input-field" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
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
