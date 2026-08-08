import React, { useState, useEffect } from 'react';
import { Users, Calendar, Activity, TrendingUp, UserPlus } from 'lucide-react';
import AppointmentCard from '../../components/admin/AppointmentCard';
import api from '../../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [patientsCount, setPatientsCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch data simultaneously
        const [patientsRes, appointmentsRes] = await Promise.all([
          api.get('/patient'),
          api.get('/appointments/all')
        ]);
        
        setPatientsCount(patientsRes.data?.length || 0);
        setAppointments(appointmentsRes.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const todayStr = new Date().toLocaleDateString();
  
  const appointmentsToday = appointments.filter(app => 
    new Date(app.date).toLocaleDateString() === todayStr
  );
  
  const pendingAppointments = appointments.filter(app => app.status === 'pending');
  const recentAppointments = appointments.slice(0, 3); // top 3 most recent

  const stats = [
    { title: 'Total Patients', value: loading ? '...' : patientsCount, icon: Users, color: 'text-surface-strong', bg: 'bg-surface-strong/10' },
    { title: 'Appointments Today', value: loading ? '...' : appointmentsToday.length, icon: Calendar, color: 'text-surface-muted', bg: 'bg-surface-muted/10' },
    { title: 'Pending Approvals', value: loading ? '...' : pendingAppointments.length, icon: Activity, color: 'text-text-primary', bg: 'bg-text-inverse/10' },
    { title: 'Total Appointments', value: loading ? '...' : appointments.length, icon: TrendingUp, color: 'text-surface-strong', bg: 'bg-surface-strong/10' },
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
          <div key={index} className="bg-white rounded-xs p-6 shadow-3 border border-text-inverse/20 flex items-center">
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
              <p className="text-text-inverse col-span-2">Loading appointments...</p>
            ) : recentAppointments.length > 0 ? (
              recentAppointments.map(apt => (
                <AppointmentCard key={apt._id} appointment={apt} onUpdateStatus={() => {}} onViewDetails={() => {}} />
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
            {!loading && appointments.slice(0, 3).map((app, index) => (
              <div key={index} className="flex items-start">
                <div className="h-2 w-2 mt-2 rounded-sm bg-surface-muted mr-3 shrink-0"></div>
                <div>
                  <p className="text-sm text-text-primary font-bold">New {app.therapy} booked</p>
                  <p className="text-xs text-text-inverse">Status: {app.status}</p>
                </div>
              </div>
            ))}
            {appointments.length === 0 && !loading && (
              <p className="text-text-inverse text-sm">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
