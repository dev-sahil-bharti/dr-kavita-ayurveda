import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar as CalendarIcon, Clock, Activity, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments(); // Initial fetch
    
    // Set up polling for real-time status updates
    const interval = setInterval(() => {
      fetchAppointments(true); // Silent fetch
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data } = await api.get('/appointments/my-appointments');
      setAppointments(data.data || []);
    } catch (err) {
      if (!silent) setError(err.response?.data?.message || 'Failed to load appointments.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return (
        <span className="group inline-flex items-center px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-yellow-100">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
          Pending
        </span>
      );
      case 'confirmed': return (
        <span className="group inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-emerald-100">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Confirmed
        </span>
      );
      case 'completed': return (
        <span className="group inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
          <CheckCircle className="w-3 h-3 mr-1.5 text-blue-600 transition-transform duration-300 group-hover:rotate-12" />
          Completed
        </span>
      );
      case 'cancelled': return (
        <span className="group inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
          <XCircle className="w-3 h-3 mr-1.5 text-red-600 transition-transform duration-300 group-hover:rotate-90" />
          Cancelled
        </span>
      );
      case 'rescheduled': return (
        <span className="group inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-indigo-100">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Rescheduled
        </span>
      );
      default: return null;
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'unpaid': return (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
          Unpaid
        </span>
      );
      case 'paid': return (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">
          Paid
        </span>
      );
      case 'refunded': return (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800 border border-gray-200">
          Refunded
        </span>
      );
      default: return null;
    }
  };

  const handleOnlinePayment = async (appointmentId, amount = 500) => {
    try {
      setLoading(true);
      const { data } = await api.post('/payment/create-order', { appointmentId, amount });
      
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Dr. Kavita Ayurveda",
        description: "Consultation Payment",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await api.post('/payment/verify', {
              appointmentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            fetchAppointments();
            alert('Payment Successful!');
          } catch (err) {
            alert('Payment verification failed.');
          }
        },
        theme: {
          color: "#059669"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Could not initiate payment. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">View and track your booking history.</p>
        </div>
        <Link to="/patient/book" className="hidden sm:flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Book New
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">{error}</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No Appointments Yet</h3>
          <p className="text-slate-500 mb-6">You haven't booked any therapies with us yet.</p>
          <Link to="/patient/book" className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-sm">
            Book Your First Appointment
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((app) => (
            <div key={app._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <CalendarIcon className="h-6 w-6" />
                  </div>
                  <div>
                    {getStatusBadge(app.status)}
                    {getPaymentBadge(app.paymentStatus)}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-1">{app.therapy}</h3>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-slate-400" />
                    <span className="font-medium text-slate-700">
                      {new Date(app.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    {app.timeSlot || 'Standard Timing'}
                  </div>
                </div>
                
                {app.message && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100 italic">
                    "{app.message}"
                  </div>
                )}

                {/* Consultation Details (If Completed) */}
                {app.status === 'completed' && (app.doctorNote || app.sessionNumber) && (
                  <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    {app.sessionNumber && app.totalSessions && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs font-bold text-blue-800 mb-1">
                          <span>Therapy Progress</span>
                          <span>Session {app.sessionNumber} / {app.totalSessions}</span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(app.sessionNumber / app.totalSessions) * 100}%` }}></div>
                        </div>
                      </div>
                    )}
                    {app.doctorNote && (
                      <div>
                        <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">Doctor's Note</p>
                        <p className="text-sm text-slate-700">{app.doctorNote}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center w-full sm:w-auto">
                  {app.status === 'pending' ? (
                    <button className="text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center">
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Cancel
                    </button>
                  ) : (
                    <span className="text-sm font-bold text-slate-600 flex items-center capitalize">
                      <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-500" />
                      Status: {app.status}
                    </span>
                  )}
                </div>

                {/* Payment Actions */}
                {app.status !== 'cancelled' && app.paymentStatus === 'unpaid' && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => alert('Payment will be collected at the clinic.')}
                      className="flex-1 sm:flex-none text-xs font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors"
                    >
                      Pay at Clinic
                    </button>
                    <button 
                      onClick={() => handleOnlinePayment(app._id, 500)} // Using 500 as default amount, ideally comes from backend based on service
                      className="flex-1 sm:flex-none text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                      Pay Online
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
