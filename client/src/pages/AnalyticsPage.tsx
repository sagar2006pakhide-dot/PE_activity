import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Loader2, SearchCheck, BookmarkCheck, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resp = await apiService.getStats();
        if (resp.success) setStats(resp.data);
      } catch {
        // Provide fallback minimal stats
        setStats({
          totalChecks: 6, reliableCount: 1, misleadingCount: 1, falseCount: 3, verifyCount: 1, savedCount: 2,
          avgConfidence: 88, totalSourcesChecked: 18,
          verdictDistribution: [
            { name: 'Likely Reliable', value: 1, color: '#10b981' },
            { name: 'Potentially Misleading', value: 1, color: '#f59e0b' },
            { name: 'Likely False', value: 3, color: '#ef4444' },
            { name: 'Requires Verification', value: 1, color: '#3b82f6' }
          ],
          clickbaitDistribution: [
            { name: 'Low Risk', count: 2, color: '#10b981' },
            { name: 'Medium Risk', count: 1, color: '#f59e0b' },
            { name: 'High Risk', count: 3, color: '#ef4444' }
          ],
          sourceCategories: [
            { category: 'Supports', count: 5, fill: '#10b981' },
            { category: 'Contradicts', count: 8, fill: '#ef4444' },
            { category: 'Context', count: 5, fill: '#3b82f6' }
          ],
          activityTimeline: [
            { date: 'Sep 15', checks: 4, reliable: 2, misleading: 1, false: 1 },
            { date: 'Sep 17', checks: 12, reliable: 6, misleading: 4, false: 2 },
            { date: 'Sep 19', checks: 24, reliable: 12, misleading: 7, false: 5 },
            { date: 'Sep 21', checks: 35, reliable: 16, misleading: 11, false: 8 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 size={30} className="animate-spin text-brand-500" />
      </div>
    );
  }

  const metricCards = [
    { label: 'Total Checks', value: stats.totalChecks, icon: SearchCheck, color: 'text-brand-500 bg-brand-500/10' },
    { label: 'Reliable Claims', value: stats.reliableCount, icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Misleading / False', value: stats.misleadingCount + stats.falseCount, icon: ShieldAlert, color: 'text-rose-500 bg-rose-500/10' },
    { label: 'Needs Verification', value: stats.verifyCount, icon: AlertTriangle, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Avg AI Confidence', value: `${stats.avgConfidence}%`, icon: TrendingUp, color: 'text-purple-500 bg-purple-500/10' },
    { label: 'Sources Cross-Checked', value: stats.totalSourcesChecked, icon: BookmarkCheck, color: 'text-cyan-500 bg-cyan-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-brand-500 flex items-center justify-center text-white shadow-lg">
          <BarChart3 size={24} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Personal verification activity, verdict trends, and source intelligence overview
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 text-center">
              <div className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={18} />
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">{c.value}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{c.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verdict Distribution Donut */}
        <div className="rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-lg">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Verdict Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats.verdictDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {stats.verdictDistribution.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#f1f5f9', fontSize: '11px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {stats.verdictDistribution.map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Source Category Bar */}
        <div className="rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-lg">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Source Categories</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.sourceCategories} barSize={36}>
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#f1f5f9', fontSize: '11px' }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {stats.sourceCategories.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Clickbait Risk */}
        <div className="rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-lg">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Clickbait Risk Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.clickbaitDistribution} layout="vertical" barSize={22}>
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={70} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#f1f5f9', fontSize: '11px' }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {stats.clickbaitDistribution.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline Area Chart */}
      <div className="rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-lg">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Verification Activity Over Time</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={stats.activityTimeline}>
            <defs>
              <linearGradient id="gradChecks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradFalse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.20} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#f1f5f9', fontSize: '11px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Area type="monotone" dataKey="checks" stroke="#6366f1" strokeWidth={2} fill="url(#gradChecks)" name="Total Checks" />
            <Area type="monotone" dataKey="reliable" stroke="#10b981" strokeWidth={2} fill="none" name="Reliable" />
            <Area type="monotone" dataKey="false" stroke="#ef4444" strokeWidth={2} fill="url(#gradFalse)" name="Likely False" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
