import React, { useEffect, useMemo, useState } from 'react';
import { FileText, TrendingUp, Users, Presentation, UserCheck, XCircle, BarChart3, Download, Activity, FileSpreadsheet } from 'lucide-react';
import { fetchCoordinatorApplicationsApi, fetchCoordinatorOpportunities } from '../../services/api';

export default function Reports() {
  const coordinatorId = localStorage.getItem('userId');
  const [drives, setDrives] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!coordinatorId) { setLoading(false); return; }
      try {
        const [drivesRes, appsRes] = await Promise.all([
          fetchCoordinatorOpportunities(coordinatorId),
          fetchCoordinatorApplicationsApi(coordinatorId),
        ]);
        setDrives(Array.isArray(drivesRes.data) ? drivesRes.data : []);
        setApps(Array.isArray(appsRes.data) ? appsRes.data : []);
      } catch (e) {
        console.error('Failed to load coordinator reports', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [coordinatorId]);

  const stats = useMemo(() => {
    const total = apps.length;
    const shortlisted = apps.filter(a => a.status === 'Shortlisted').length;
    const rejected = apps.filter(a => a.status === 'Rejected').length;
    return [
      { id: 1, title: 'Assigned Drives', value: String(drives.length), icon: Presentation, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
      { id: 2, title: 'Managed Applicants', value: String(total), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
      { id: 3, title: 'Shortlisted', value: String(shortlisted), icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
      { id: 4, title: 'Rejected', value: String(rejected), icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    ];
  }, [drives.length, apps]);

  const attendanceData = useMemo(() => {
    const present = apps.filter(a => a.attendance === 'Present').length;
    const absent = apps.filter(a => a.attendance === 'Absent').length;
    return { present, absent, total: apps.length };
  }, [apps]);

  const presentPct = attendanceData.total > 0 ? Math.round((attendanceData.present / attendanceData.total) * 100) : 0;

  const roundProgression = useMemo(() => {
    const total = apps.length || 1;
    const stages = [
      { name: "Applied", status: "Applied" },
      { name: "Shortlisted", status: "Shortlisted" },
      { name: "Interview Scheduled", status: "Interview Scheduled" },
      { name: "In Progress", status: "In Progress" },
      { name: "Selected", status: "Selected" },
    ];
    return stages.map(s => {
      const count = apps.filter(a => a.status === s.status).length;
      return { name: s.name, value: String(count), percentage: Math.round((count / total) * 100) };
    });
  }, [apps]);

  const exportAllData = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      coordinatorId,
      drives,
      applications: apps,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coordinator_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" /> Analytics & Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review operational performance and down-stream student statistics.</p>
        </div>
        <button
          onClick={exportAllData}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:bg-indigo-700 transition-all"
          title="Download drives + applications JSON"
        >
           <Download className="w-4 h-4" /> Export All Data
        </button>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${stat.bg} ${stat.color} ${stat.border}`}>
              <stat.icon className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
            <p className="text-sm font-bold text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Round Progression */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-500" /> Pipeline Progression</h3>
               <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-md">Across all drives</span>
             </div>
             
             <div className="space-y-5 flex-1 flex flex-col justify-center">
               {roundProgression.map((round, idx) => (
                 <div key={idx} className="relative">
                   <div className="flex justify-between items-end mb-1.5 z-10 relative">
                     <span className="text-sm font-bold text-gray-700">{round.name}</span>
                     <div className="text-right">
                       <span className="text-sm font-black text-gray-900">{round.value}</span>
                       <span className="text-xs font-semibold text-gray-400 ml-2">{round.percentage}%</span>
                     </div>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1 overflow-hidden">
                     <div 
                        className={`h-2.5 rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-indigo-400' : idx === roundProgression.length - 1 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                        style={{ width: `${round.percentage}%` }}
                     ></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right Column: Attendance & Downloads */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Attendance Ratio */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-500" /> Attendance Ratio</h3>
            
            <div className="flex flex-col items-center justify-center mb-6 relative">
              {/* Dummy Donut Representation */}
              <div className="w-32 h-32 rounded-full border-[12px] border-emerald-500 flex items-center justify-center relative shadow-sm" style={{ borderRightColor: "#f43f5e", transform: "rotate(45deg)" }}>
                 <div className="absolute inset-0 rounded-full bg-white flex flex-col items-center justify-center" style={{ transform: "rotate(-45deg)" }}>
                   <span className="text-2xl font-black text-gray-900">{presentPct}%</span>
                   <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Present</span>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center">
                 <span className="block text-xl font-black text-emerald-700">{attendanceData.present}</span>
                 <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wide mt-0.5">Present</span>
               </div>
               <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-center">
                 <span className="block text-xl font-black text-rose-700">{attendanceData.absent}</span>
                 <span className="block text-xs font-bold text-rose-600 uppercase tracking-wide mt-0.5">Absent</span>
               </div>
            </div>
          </div>

          {/* Report Downloads */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-0 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <h3 className="text-[15px] font-bold text-gray-900">Generated Reports</h3>
            </div>
            <div className="divide-y divide-gray-50 max-h-[250px] overflow-y-auto">
              <div className="p-6 text-center text-sm text-gray-500">
                Report files export is not implemented yet. Use “Export All Data” for now.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
