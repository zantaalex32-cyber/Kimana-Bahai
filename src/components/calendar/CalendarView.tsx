import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, MapPin, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CalendarView: React.FC = () => {
  const { activities, devotionals, followUps, localities } = useApp();
  const [selectedLocality, setSelectedLocality] = useState('all');

  // Unified items
  const calendarItems = [
    ...activities.map(a => ({
      id: a.id,
      title: a.title,
      type: a.type,
      date: a.date,
      time: a.startTime || '10:00',
      locality: a.localityName,
      venue: a.venue,
      category: 'Activity'
    })),
    ...devotionals.map(d => ({
      id: d.id,
      title: `Devotional: ${d.title}`,
      type: 'Devotional Meeting',
      date: d.date,
      time: d.time || '18:00',
      locality: d.localityName,
      venue: `Host: ${d.hostName}`,
      category: 'Devotional'
    })),
    ...followUps.filter(f => f.status === 'Pending').map(f => ({
      id: f.id,
      title: `[Follow-up] ${f.taskDescription}`,
      type: 'Follow-Up Task',
      date: f.dueDate,
      time: '09:00',
      locality: f.localityName,
      venue: `Assigned: ${f.assignedTo}`,
      category: 'FollowUp'
    }))
  ].sort((a, b) => a.date.localeCompare(b.date));

  const filteredItems = calendarItems.filter(item => {
    if (selectedLocality !== 'all' && !item.locality.includes(selectedLocality)) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-emerald-600" />
            Kimana Cluster Schedule & Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Unified schedule of upcoming activities, devotional gatherings, feasts, and follow-up deadlines.
          </p>
        </div>

        <div>
          <select
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value)}
            className="py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">Filter by Locality: All</option>
            {localities.map(l => (
              <option key={l.id} value={l.name}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar List Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Upcoming Scheduled Events & Deadlines ({filteredItems.length})
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredItems.map(item => (
            <div key={`${item.category}-${item.id}`} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-center min-w-[70px]">
                  <span className="block text-[10px] font-bold uppercase text-emerald-600">{item.date.split('-')[1]} / {item.date.split('-')[0]}</span>
                  <span className="block text-base font-extrabold text-slate-900 dark:text-white">{item.date.split('-')[2]}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.category === 'FollowUp' ? 'bg-amber-100 text-amber-800' :
                      item.category === 'Devotional' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.type}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {item.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" /> {item.locality} ({item.venue})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
