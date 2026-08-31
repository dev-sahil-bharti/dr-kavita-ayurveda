import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Download } from 'lucide-react';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';

export const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionConfirm, setActionConfirm] = useState({ type: null, id: null });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await adminService.getInquiries();
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await adminService.resolveInquiry(id);
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id ? { ...inq, status: 'resolved' } : inq))
      );
      toast.success('Inquiry marked as resolved');
    } catch (error) {
      console.error('Error resolving inquiry:', error);
      toast.error('Failed to resolve inquiry');
    }
    setActionConfirm({ type: null, id: null });
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteInquiry(id);
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      toast.success('Inquiry deleted');
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast.error('Failed to delete inquiry');
    }
    setActionConfirm({ type: null, id: null });
  };

  const executeAction = () => {
    if (actionConfirm.type === 'delete') {
      handleDelete(actionConfirm.id);
    } else if (actionConfirm.type === 'resolve') {
      handleResolve(actionConfirm.id);
    }
  };

  const filteredInquiries = inquiries.filter(
    (inq) => filterStatus === 'all' || inq.status === filterStatus
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredInquiries.map((inq) => inq._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExport = () => {
    const dataToExport =
      selectedIds.length > 0
        ? inquiries.filter((inq) => selectedIds.includes(inq._id))
        : filteredInquiries;

    if (!dataToExport.length) {
      toast.error('No inquiries to export');
      return;
    }

    const headers = ['Date', 'Name', 'Email', 'Contact No', 'Subject', 'Message', 'Status'];
    const rows = dataToExport.map((inq) => [
      new Date(inq.createdAt).toLocaleDateString(),
      `"${(inq.name || '').replace(/"/g, '""')}"`,
      `"${(inq.email || '').replace(/"/g, '""')}"`,
      `"${(inq.mobile || inq.phone || '').replace(/"/g, '""')}"`,
      `"${(inq.subject || '').replace(/"/g, '""')}"`,
      `"${(inq.message || '').replace(/"/g, '""')}"`,
      inq.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `inquiries_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export completed');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Patient Inquiries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and respond to website inquiries and messages.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            {selectedIds.length > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                {selectedIds.length} Selected
              </span>
            )}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setSelectedIds([]);
              }}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold focus:outline-none bg-white cursor-pointer"
            >
              <option value="all">All Inquiries</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
            <Button
              variant="primary"
              size="md"
              icon={Download}
              onClick={handleExport}
            >
              {selectedIds.length > 0 ? `Export (${selectedIds.length})` : 'Export All'}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold text-slate-500 tracking-wider uppercase">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    checked={
                      filteredInquiries.length > 0 &&
                      selectedIds.length === filteredInquiries.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-4">Date</th>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Email</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 text-sm">
                    Loading inquiries...
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 text-sm">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr
                    key={inq._id}
                    className={`transition-colors text-sm ${
                      selectedIds.includes(inq._id)
                        ? 'bg-emerald-50/40'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        checked={selectedIds.includes(inq._id)}
                        onChange={() => handleSelectOne(inq._id)}
                      />
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-500">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-slate-800">{inq.name}</td>
                    <td className="p-4 text-slate-600 whitespace-nowrap">
                      {inq.mobile || inq.phone || '-'}
                    </td>
                    <td className="p-4 text-slate-600">{inq.email}</td>
                    <td className="p-4 max-w-[200px] text-slate-600 truncate">
                      {inq.subject}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <Badge status={inq.status} />
                    </td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            setActionConfirm({ type: 'delete', id: inq._id })
                          }
                          className="text-rose-600 hover:text-rose-800 bg-rose-50 p-2 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 flex justify-between items-center">
          <span>Showing {filteredInquiries.length} inquiries</span>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={!!actionConfirm.type}
        onClose={() => setActionConfirm({ type: null, id: null })}
        title={`Confirm ${actionConfirm.type === 'delete' ? 'Deletion' : 'Resolution'}`}
        maxWidth="max-w-sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setActionConfirm({ type: null, id: null })}
            >
              Cancel
            </Button>
            <Button
              variant={actionConfirm.type === 'delete' ? 'danger' : 'primary'}
              onClick={executeAction}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-slate-500 text-sm">
          Are you sure you want to {actionConfirm.type} this inquiry?
          {actionConfirm.type === 'delete' && ' This action cannot be undone.'}
        </p>
      </Modal>

      {/* Inquiry Details Modal */}
      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Inquiry Details"
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedInquiry(null)}>
              Close
            </Button>
            {selectedInquiry?.status !== 'resolved' && (
              <Button
                variant="primary"
                onClick={() => {
                  setActionConfirm({ type: 'resolve', id: selectedInquiry._id });
                  setSelectedInquiry(null);
                }}
              >
                Mark as Resolved
              </Button>
            )}
          </>
        }
      >
        {selectedInquiry && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Patient Name
                </label>
                <p className="text-base font-bold text-slate-800">
                  {selectedInquiry.name}
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Date Submitted
                </label>
                <p className="text-base text-slate-700">
                  {new Date(selectedInquiry.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <p className="text-base text-slate-700">{selectedInquiry.email}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <p className="text-base text-slate-700">
                  {selectedInquiry.mobile || selectedInquiry.phone || '-'}
                </p>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Subject
              </label>
              <p className="text-base font-bold text-slate-800">
                {selectedInquiry.subject}
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Message
              </label>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                {selectedInquiry.message}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inquiries;
