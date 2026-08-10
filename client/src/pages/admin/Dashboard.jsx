import React, { useState, useEffect } from 'react';
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import AppointmentCard from '../../components/admin/AppointmentCard';
import api from '../../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    appointmentsToday: 0,
    recentAppointments: []
  });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard-stats');
        setStatsData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      if (newStatus === 'confirmed') {
        await api.patch(`/admin/appointments/${id}/accept`);
      } else {
        await api.put(`/appointments/${id}/status`, { status: newStatus });
      }
      
      const res = await api.get('/admin/dashboard-stats');
      setStatsData(res.data.data);
      toast.success(`Appointment marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    window.location.href = `/admin/appointments`;
  };

  const stats = [
    { title: 'Total Patients', value: loading ? '...' : statsData.totalPatients, icon: Users, color: 'text-surface-strong', bg: 'bg-surface-strong/10' },
    { title: 'Appointments Today', value: loading ? '...' : statsData.appointmentsToday, icon: Calendar, color: 'text-surface-muted', bg: 'bg-surface-muted/10' },
    { title: 'Pending Approvals', value: loading ? '...' : statsData.pendingAppointments, icon: Activity, color: 'text-text-primary', bg: 'bg-text-inverse/10' },
    { title: 'Total Appointments', value: loading ? '...' : statsData.totalAppointments, icon: TrendingUp, color: 'text-surface-strong', bg: 'bg-surface-strong/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Dashboard Overview</h1>
          <p className="text-lg text-text-inverse mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xs p-6 shadow-3 border border-text-inverse/20 flex items-center hover:shadow-lg transition-shadow">
            <div className={`p-4 rounded-sm ${stat.bg} mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-inverse uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-bold text-text-primary mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Section */}
        <div className="lg:col-span-2 bg-white rounded-xs shadow-3 border border-text-inverse/20 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Recent Appointments</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <p className="text-text-inverse col-span-2 flex items-center gap-2">
                 <span className="w-5 h-5 border-2 border-surface-muted border-t-transparent rounded-full animate-spin"></span>
                 Loading appointments...
              </p>
            ) : statsData.recentAppointments.length > 0 ? (
              statsData.recentAppointments.map(apt => (
                <AppointmentCard 
                  key={apt._id} 
                  appointment={apt} 
                  onUpdateStatus={handleUpdateStatus} 
                  onViewDetails={() => handleViewDetails(apt._id)} 
                />
              ))
            ) : (
              <p className="text-text-inverse col-span-2">No recent appointments found.</p>
            )}
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="bg-white rounded-xs shadow-3 border border-text-inverse/20 p-6">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {!loading && statsData.recentAppointments.map((app, index) => (
              <div key={index} className="flex items-start bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="h-2 w-2 mt-2 rounded-sm bg-surface-muted mr-3 shrink-0 shadow-sm"></div>
                <div>
                  <p className="text-sm text-text-primary font-bold">New {app.therapy || app.preferredService} booked</p>
                  <p className="text-xs text-text-inverse mt-0.5 capitalize">Status: {app.status}</p>
                </div>
              </div>
            ))}
            {statsData.recentAppointments.length === 0 && !loading && (
              <p className="text-text-inverse text-sm italic">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
