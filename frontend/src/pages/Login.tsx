import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Activity, ArrowRight, BarChart2, Lock, Zap } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/dashboard');
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await api.post('/auth/register', { name, email, password, role: 'ADVERTISER' });
        setIsRegister(false);
      } else {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        navigate('/dashboard');
      }
    } catch {
      setError(isRegister ? 'Registration failed. Try again.' : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    localStorage.setItem('demo', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-[#0c0c10]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #13131f 100%)' }}>
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Glow blobs */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute bottom-20 right-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AdMitra</span>
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Campaign Intelligence<br />
              <span style={{ background: 'linear-gradient(90deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Built for Scale
              </span>
            </h1>
            <p className="text-[#6a6c80] text-base leading-relaxed">
              A production-grade platform for managing digital ad campaigns, monitoring real-time performance, and caching analytics with Redis.
            </p>
          </div>

          {/* Feature chips */}
          {[
            { icon: Zap, label: 'Live CTR polling every 5 seconds' },
            { icon: BarChart2, label: 'Redis-cached analytics dashboard' },
            { icon: Lock, label: 'JWT auth with refresh token rotation' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-indigo-500/10">
                <Icon className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-sm text-[#7a7c8a]">{label}</span>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div className="relative">
          <p className="text-xs text-[#4a4c5c] uppercase tracking-widest mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Redis', 'Docker', 'React + TS'].map(t => (
              <span key={t} className="px-2.5 py-1 text-xs rounded-lg text-[#7a7c8a]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">AdMitra</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">
              {isRegister ? 'Create account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-[#5a5c70]">
              {isRegister ? 'Start managing your campaigns' : 'Sign in to your account'}
            </p>
          </div>

          {/* Demo CTA — prominent */}
          <button onClick={handleDemo}
            className="w-full mb-6 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 group"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
            <Zap className="w-4 h-4" />
            Explore Live Demo — No Signup Required
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-[#4a4c5c]">or sign in</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400 bg-red-500/10 border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="label">Full Name</label>
                <input type="text" className="input-field" placeholder="Ruchita Saraf"
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input type="email" className="input-field" placeholder="you@company.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input-field" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#5a5c70]">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => setIsRegister(!isRegister)} className="text-indigo-400 hover:text-indigo-300 font-medium">
              {isRegister ? 'Sign in' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
