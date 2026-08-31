import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, CheckCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { patientService } from '../services/patientService';
import { formatDate } from '../../../utils/formatters';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import LoadingState from '../../../components/feedback/LoadingState';
import EmptyState from '../../../components/feedback/EmptyState';

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await patientService.getMyAppointments();
      setAppointments(data || []);
    } catch (err) {
      if (!silent) setError(err.message || 'Failed to load appointments.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // Polling for real-time status updates every 15s
    const interval = setInterval(() => {
      fetchAppointments(true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleOnlinePayment = async (appointmentId, amount = 500) => {
    try {
      setLoading(true);
      const data = await patientService.createPaymentOrder(appointmentId, amount);

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Dr. Kavita Ayurveda',
        description: 'Consultation Payment',
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await patientService.verifyPayment({
              appointmentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            fetchAppointments();
            toast.success('Payment completed successfully!');
          } catch (err) {
            toast.error(err.message || 'Payment verification failed.');
          }
        },
        theme: {
          color: '#0f3c35',
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Razorpay SDK not loaded. Please try again later.');
      }
    } catch (err) {
      toast.error(err.message || 'Could not initiate payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            My Appointments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View and track your clinic bookings and consultation progress.
          </p>
        </div>
        <Link to="/patient/book">
          <Button variant="primary" icon={Plus}>
            Book New
          </Button>
        </Link>
      </div>

      {loading && appointments.length === 0 ? (
        <LoadingState message="Loading your appointments..." />
      ) : error ? (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-200">
          {error}
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title="No Appointments Yet"
          description="You haven't booked any therapies with us yet. Begin your wellness journey today."
          actionLabel="Book Your First Appointment"
          onAction={() => window.location.assign('/patient/book')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <CalendarIcon className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge status={app.status} size="sm" />
                    {app.paymentStatus && (
                      <Badge status={app.paymentStatus} size="sm" />
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  {app.therapy || app.preferredService || 'Ayurvedic Consultation'}
                </h3>

                <div className="space-y-2 mt-4 text-sm">
                  <div className="flex items-center text-slate-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-slate-400" />
                    <span className="font-semibold text-slate-700">
                      {formatDate(app.date)}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    <span>{app.timeSlot || 'Standard Timing'}</span>
                  </div>
                </div>

                {app.message && (
                  <div className="mt-4 p-3.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100 italic">
                    "{app.message}"
                  </div>
                )}

                {/* Consultation Details */}
                {app.status === 'completed' && (app.doctorNote || app.sessionNumber) && (
                  <div className="mt-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-xs">
                    {app.sessionNumber && app.totalSessions && (
                      <div className="mb-3">
                        <div className="flex justify-between font-bold text-emerald-900 mb-1">
                          <span>Therapy Progress</span>
                          <span>
                            Session {app.sessionNumber} / {app.totalSessions}
                          </span>
                        </div>
                        <div className="w-full bg-emerald-100 rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${(app.sessionNumber / app.totalSessions) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {app.doctorNote && (
                      <div>
                        <p className="font-bold text-emerald-900 uppercase tracking-wider mb-1">
                          Doctor's Note
                        </p>
                        <p className="text-slate-700 leading-relaxed">{app.doctorNote}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-600 flex items-center capitalize">
                    <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-500" />
                    Status: {app.status}
                  </span>
                </div>

                {/* Payment Actions */}
                {app.status !== 'cancelled' && app.paymentStatus === 'unpaid' && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() =>
                        toast.success('Payment will be collected at the clinic.')
                      }
                      className="flex-1 sm:flex-none text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 px-3.5 py-2 rounded-xl transition-colors"
                    >
                      Pay at Clinic
                    </button>
                    <button
                      onClick={() => handleOnlinePayment(app._id, 500)}
                      className="flex-1 sm:flex-none text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-colors shadow-sm shadow-emerald-600/20"
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
