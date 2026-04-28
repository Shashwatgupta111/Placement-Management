import React, { useMemo, useState } from 'react';
import { Bell, Briefcase, Info, Clock, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

const typeMeta = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('assignment')) return { icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' };
  if (t.includes('interview')) return { icon: Calendar,  color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' };
  if (t.includes('alert'))     return { icon: Bell,      color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-100' };
  if (t.includes('result'))    return { icon: CheckCircle,color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-100' };
  return { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
};

const timeAgo = (iso) => {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return '';
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [activeFilter, setActiveFilter] = useState('All');

  const view = useMemo(() => {
    const list = Array.isArray(notifications) ? notifications : [];
    return activeFilter === 'Unread' ? list.filter(n => !n.isRead) : list;
  }, [notifications, activeFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" /> Notifications Feed
          </h1>
          <p className="text-sm text-gray-500 mt-1">Stay updated with assignments, schedules, and alerts.</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
          >
            <CheckCircle className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row justify-between gap-4">
         <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200 inline-flex w-fit">
            <button 
              onClick={() => setActiveFilter('All')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeFilter === 'All' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
               All
            </button>
            <button 
              onClick={() => setActiveFilter('Unread')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeFilter === 'Unread' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
               Unread
               {unreadCount > 0 && <span className="bg-indigo-100 text-indigo-700 px-1.5 rounded text-[10px]">{unreadCount}</span>}
            </button>
         </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {view.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
               <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">You're all caught up!</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">There are no notifications matching your current filter. You have zero pending alerts.</p>
          </div>
        ) : (
          view.map((notif) => {
            const meta = typeMeta(notif.type || notif.notificationType);
            const NotifIcon = meta.icon;
            const notifId = notif._id || notif.id;
            const isRead = !!notif.isRead;
            return (
            <div 
              key={notifId} 
              onClick={() => notifId && markAsRead(notifId)}
              className={`bg-white rounded-2xl border ${isRead ? 'border-gray-100' : 'border-indigo-200 shadow-md ring-1 ring-indigo-50/50'} shadow-sm p-5 hover:shadow-md transition-all flex gap-4 cursor-pointer relative overflow-hidden group`}
            >
              {!isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
              )}
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${meta.bg} ${meta.color} ${meta.border}`}>
                <NotifIcon className="w-6 h-6" strokeWidth={2} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-[15px] font-bold ${isRead ? 'text-gray-800' : 'text-gray-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs font-semibold text-gray-400 whitespace-nowrap ml-4 block">{timeAgo(notif.createdAt)}</span>
                </div>
                <p className={`text-sm ${isRead ? 'text-gray-500' : 'text-gray-600 font-medium'} leading-relaxed`}>{notif.message}</p>
                
                {String(notif.type || '').toLowerCase().includes('assignment') && !isRead && (
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/coordinator/opportunities'); }}
                    className="mt-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 border border-transparent px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  >
                    View Drive Assignment
                  </button>
                )}
                {String(notif.type || '').toLowerCase().includes('alert') && !isRead && (
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/coordinator/applicants'); }}
                    className="mt-3 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-200 border border-transparent px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  >
                    Resolve Now
                  </button>
                )}
              </div>
            </div>
          )})
        )}
      </div>
    </div>
  );
}
