import React, { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Layout from '../components/Layout';
import { AlertTriangle, TrendingUp, Users, MapPin, Download, FileText } from 'lucide-react';

const DistributorDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ avgScore: 0, criticalCount: 0, total: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "users")); 
      const querySnapshot = await getDocs(q);
      
      let totalScore = 0;
      let critical = 0;
      const userList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userList.push(data);
        totalScore += data.currentSTI;
        if (data.currentSTI < 50) critical++;
      });

      setUsers(userList);
      setStats({
        total: userList.length,
        avgScore: userList.length ? Math.round(totalScore / userList.length) : 0,
        criticalCount: critical
      });
    };

    fetchData();
  }, []);

  const handleExportCSV = () => {
    // 1. Convert Data to CSV
    const headers = ["User ID", "Score", "Streak", "Distributor ID", "Risk Level"];
    const rows = users.map(u => [
        u.uid, 
        u.currentSTI, 
        u.streak, 
        u.distributorId, 
        u.currentSTI < 50 ? "High" : "Low"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    // 2. Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "safehp_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-dark pb-6">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit mb-3">
                    <MapPin className="text-primary text-xs" size={14} />
                    <span className="text-primary text-xs font-bold uppercase tracking-wider">Sector 18 - Noida</span>
                </div>
                <h1 className="text-3xl font-black text-white">Distributor Portal</h1>
                <p className="text-text-muted mt-1">Real-time safety analytics for Indane Agency #492</p>
            </div>
            <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white text-background-dark hover:bg-slate-200 rounded-lg transition-colors text-sm font-bold shadow-lg"
            >
                <Download size={16} /> Export CSV
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl border border-border-dark bg-card-dark">
                <div className="flex items-center gap-2 text-text-muted mb-2 font-medium">
                    <Users size={18} /> Active Households
                </div>
                <div className="text-4xl font-bold text-white">{stats.total}</div>
            </div>

            <div className="p-6 rounded-xl border border-border-dark bg-card-dark relative overflow-hidden group">
                <div className="flex items-center gap-2 text-primary mb-2 font-medium">
                    <TrendingUp size={18} /> Avg Safety Index
                </div>
                <div className="text-4xl font-bold text-white">{stats.avgScore}/100</div>
                <div className="text-green-500 text-xs mt-2 font-bold bg-green-500/10 inline-block px-2 py-1 rounded">
                    ↑ 2.4% vs last week
                </div>
            </div>

            <div className={`p-6 rounded-xl border ${stats.criticalCount > 0 ? 'border-red-500/50 bg-red-500/10' : 'border-border-dark bg-card-dark'}`}>
                <div className="flex items-center gap-2 text-red-500 mb-2 font-medium">
                    <AlertTriangle size={18} /> Critical Risks
                </div>
                <div className="text-4xl font-bold text-white">{stats.criticalCount}</div>
                {stats.criticalCount > 0 && (
                    <div className="text-red-400 text-xs mt-2 animate-pulse">Action required immediately</div>
                )}
            </div>
        </div>

        {/* Data Table */}
        <div className="w-full rounded-xl border border-border-dark bg-card-dark overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-border-dark flex justify-between items-center bg-[#141b24]">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <FileText size={18} className="text-text-muted"/> Household Report
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#101922] text-text-muted text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User ID</th>
                            <th className="px-6 py-4">Safety Score</th>
                            <th className="px-6 py-4">Streak</th>
                            <th className="px-6 py-4">Risk Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-dark">
                        {users.length > 0 ? users.map((u, i) => (
                            <tr key={i} className="hover:bg-background-dark/50 transition-colors group">
                                <td className="px-6 py-4 font-mono text-xs text-text-muted group-hover:text-white">
                                    {u.uid.substring(0,8)}...
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 bg-background-dark rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${u.currentSTI < 50 ? 'bg-red-500' : 'bg-primary'}`} 
                                                style={{width: `${u.currentSTI}%`}}
                                            ></div>
                                        </div>
                                        <span className="font-bold text-white text-sm">{u.currentSTI}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-text-muted text-sm">{u.streak} days</td>
                                <td className="px-6 py-4">
                                    {u.currentSTI < 50 ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                                            High Risk
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                                            Secure
                                        </span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-text-muted">No data available yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default DistributorDashboard;