import React, { useState, useEffect } from 'react';
import { Mail, Search, Filter, Eye, Trash2, CheckCircle, Download } from 'lucide-react';
import api from '../../services/api';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch inquiries on mount
  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data } = await api.get('/inquiries');
      setInquiries(data.data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    if (!window.confirm('Do you really want to approve this inquiry?')) return;
    try {
      await api.patch(`/inquiries/${id}/status`, { status: 'resolved' });
      setInquiries(inquiries.map(inq => 
        inq._id === id ? { ...inq, status: 'resolved' } : inq
      ));
    } catch (error) {
      console.error('Error resolving inquiry:', error);
      alert('Failed to resolve inquiry');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Do you really want to delete this inquiry?')) return;
    
    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries(inquiries.filter(inq => inq._id !== id));
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id)); // Remove from selection if deleted
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry');
    }
  };

  const filteredInquiries = inquiries.filter(inq => filterStatus === 'all' || inq.status === filterStatus);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredInquiries.map(inq => inq._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExport = () => {
    const dataToExport = selectedIds.length > 0 
      ? inquiries.filter(inq => selectedIds.includes(inq._id))
      : filteredInquiries;

    if (!dataToExport.length) return alert('No inquiries to export');
    
    const headers = ['Date', 'Name', 'Email', 'Contact No', 'Subject', 'Message', 'Status'];
    const rows = dataToExport.map(inq => [
      new Date(inq.createdAt).toLocaleDateString(),
      `"${(inq.name || '').replace(/"/g, '""')}"`,
      `"${(inq.email || '').replace(/"/g, '""')}"`,
      `"${(inq.mobile || inq.phone || '').replace(/"/g, '""')}"`,
      `"${(inq.subject || '').replace(/"/g, '""')}"`,
      `"${(inq.message || '').replace(/"/g, '""')}"`,
      inq.status
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Patient Inquiries</h1>
          <p className="text-lg text-slate-500 mt-1">Manage and respond to website inquiries and messages.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or subject..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full text-sm focus-visible:outline-none focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400 transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            {selectedIds.length > 0 && (
              <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-full border border-emerald-200">
                {selectedIds.length} Selected
              </span>
            )}
            <div className="flex items-center border border-slate-200 rounded-full bg-white overflow-hidden transition-colors hover:border-slate-300">
              <select 
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setSelectedIds([]); 
                }}
                className="px-4 py-2 bg-transparent text-slate-600 text-sm font-medium focus-visible:outline-none cursor-pointer w-36"
              >
                <option value="all">All Inquiries</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <button onClick={handleExport} className="flex items-center bg-[#00a651] text-white font-medium text-sm px-5 py-2 rounded-full hover:bg-[#008f45] transition-colors shadow-sm">
              <Download className="h-4 w-4 mr-2" />
              {selectedIds.length > 0 ? `Export (${selectedIds.length})` : 'Export All'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-500 tracking-wider uppercase">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    checked={filteredInquiries.length > 0 && selectedIds.length === filteredInquiries.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-4">Date</th>
                <th className="p-4">Name</th>
                <th className="p-4">Contact No</th>
                <th className="p-4">Email</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500 text-sm">Loading inquiries...</td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500 text-sm">No inquiries found.</td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr 
                    key={inq._id} 
                    className={`transition-colors text-sm ${selectedIds.includes(inq._id) ? 'bg-emerald-50/30' : 'hover:bg-slate-50/50'}`}
                  >
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        checked={selectedIds.includes(inq._id)}
                        onChange={() => handleSelectOne(inq._id)}
                      />
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-500">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {inq.name}
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {inq.mobile || inq.phone}
                    </td>
                    <td className="p-4 text-slate-500">
                      {inq.email}
                    </td>
                    <td className="p-4 max-w-[200px] text-slate-600 truncate">
                      {inq.subject}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className={`w-4 h-0.5 rounded-full ${inq.status === 'resolved' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button 
                          onClick={() => setSelectedInquiry(inq)}
                          className="text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 p-1.5 rounded-full" 
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(inq._id)}
                          className="text-red-500 hover:text-red-700 transition-colors bg-red-50 p-1.5 rounded-full" 
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-text-inverse/20 text-sm text-text-inverse flex justify-between items-center">
          <span>Showing {filteredInquiries.length} inquiries</span>
        </div>
      </div>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-tertiary/50 p-4">
          <div className="bg-white rounded-xs shadow-3 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-text-inverse/20 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-text-primary">Inquiry Details</h2>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="text-text-inverse hover:text-text-primary focus-visible:outline-none"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-text-inverse uppercase tracking-wider mb-1">Patient Name</label>
                  <p className="text-lg font-bold text-text-primary">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-inverse uppercase tracking-wider mb-1">Date Submitted</label>
                  <p className="text-lg text-text-primary">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-inverse uppercase tracking-wider mb-1">Email Address</label>
                  <p className="text-lg text-text-primary">{selectedInquiry.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-inverse uppercase tracking-wider mb-1">Mobile Number</label>
                  <p className="text-lg text-text-primary">{selectedInquiry.mobile || selectedInquiry.phone}</p>
                </div>
              </div>
              <div className="border-t border-text-inverse/10 pt-6">
                <label className="block text-xs font-bold text-text-inverse uppercase tracking-wider mb-1">Subject</label>
                <p className="text-lg font-bold text-text-primary">{selectedInquiry.subject}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-inverse uppercase tracking-wider mb-1">Message</label>
                <div className="p-4 bg-slate-50 rounded-sm border border-text-inverse/10 text-text-primary whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-text-inverse/20 flex justify-end space-x-4 bg-slate-50">
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="px-6 py-2 border border-text-inverse/30 rounded-sm text-text-secondary font-bold hover:bg-text-inverse/5"
              >
                Close
              </button>
              {selectedInquiry.status !== 'resolved' && (
                <button 
                  onClick={() => {
                    handleResolve(selectedInquiry._id);
                    setSelectedInquiry(null);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-sm font-bold hover:bg-green-700"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;
