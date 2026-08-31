import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Activity, TrendingUp, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import AppointmentCard from '../components/AppointmentCard';
import { adminService } from '../services/adminService';
import Skeleton from '../../../components/feedback/Skeleton';
import EmptyState from '../../../components/feedback/EmptyState';

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    appointmentsToday: 0,
    recentAppointments: [],
  });

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      if (data) {
        setStatsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'confirmed') {
        await adminService.acceptAppointment(id);
      } else {
        await adminService.updateAppointmentStatus(id, newStatus);
      }

      toast.success(`Appointment marked as ${newStatus}`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleViewDetails = (_id) => {
    navigate('/admin/appointments');
  };

  const stats = [
    {
      title: 'Total Patients',
      value: statsData.totalPatients,
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Appointments Today',
      value: statsData.appointmentsToday,
      icon: Calendar,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Pending Approvals',
      value: statsData.pendingAppointments,
      icon: Activity,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      title: 'Total Appointments',
      value: statsData.totalAppointments,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, Administrator. Here is what is happening at the clinic today.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/appointments')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
        >
          <span>View All Schedule</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-all duration-200"
          >
            <div className={`p-4 rounded-2xl ${stat.bg} mr-4 shrink-0`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.title}
              </p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  {stat.value}
                </h3>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent Appointments
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Latest booking activities requiring attention
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/appointments')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              See all
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton variant="card" />
              <Skeleton variant="card" />
            </div>
          ) : statsData.recentAppointments && statsData.recentAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statsData.recentAppointments.map((apt) => (
                <AppointmentCard
                  key={apt._id}
                  appointment={apt}
                  onUpdateStatus={handleUpdateStatus}
                  onViewDetails={() => handleViewDetails(apt._id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Recent Appointments"
              description="No incoming bookings recorded for today yet."
            />
          )}
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Recent Activity</h2>
          <p className="text-xs text-slate-400 mb-6">Real-time clinic events</p>

          <div className="space-y-4">
            {loading ? (
              <Skeleton count={4} className="h-14" />
            ) : statsData.recentAppointments && statsData.recentAppointments.length > 0 ? (
              statsData.recentAppointments.map((app, index) => (
                <div
                  key={index}
                  className="flex items-start bg-slate-50 p-3.5 rounded-2xl border border-slate-100 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="h-2.5 w-2.5 mt-1.5 rounded-full bg-emerald-500 mr-3 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 font-bold truncate">
                      {app.therapy || app.preferredService || 'Consultation'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex justify-between">
                      <span className="capitalize">{app.patientName || app.patient?.name || 'Patient'}</span>
                      <span className="font-semibold capitalize text-emerald-700">{app.status}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic py-4 text-center">
                No activity recorded yet today.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
