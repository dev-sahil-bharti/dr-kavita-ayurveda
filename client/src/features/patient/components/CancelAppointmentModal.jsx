import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const CANCELLATION_REASONS = [
  'Personal / Family Emergency',
  'Schedule Conflict',
  'Health Issue',
  'Travel / Location Issue',
  'Appointment No Longer Required',
  'Booked by Mistake',
  'Other',
];

export const CancelAppointmentModal = ({ isOpen, onClose, appointment, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!reason || !reason.trim()) {
      setError('Please select a cancellation reason.');
      return;
    }

    if (!confirmed) {
      setError('Please confirm that you want to cancel this appointment.');
      return;
    }

    try {
      setLoading(true);
      await onConfirm({
        reason: reason.trim(),
        note: note.trim(),
        confirmation: true,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason('');
      setNote('');
      setConfirmed(false);
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-rose-50/80 px-6 py-5 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Cancel Appointment</h3>
              <p className="text-xs text-slate-500">Provide reason to proceed</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cancellation Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Cancellation Reason * */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Cancellation Reason <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all text-sm font-medium text-slate-800 cursor-pointer"
            >
              <option value="">-- Select Reason --</option>
              {CANCELLATION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Additional Note <span className="text-slate-400 text-[10px] lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                reason === 'Other'
                  ? 'Please explain your reason for cancellation...'
                  : 'Add any note for the doctor or clinic (optional)...'
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all text-sm font-medium text-slate-800 resize-none placeholder-slate-400"
            />
          </div>

          {/* Confirmation Checkbox * */}
          <div className="pt-1">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => {
                  setConfirmed(e.target.checked);
                  if (error) setError('');
                }}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-800 select-none">
                Confirm that I want to cancel this appointment <span className="text-rose-500">*</span>
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 animate-shake">
              {error}
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors"
            >
              Keep Appointment
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Cancel Appointment</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;
