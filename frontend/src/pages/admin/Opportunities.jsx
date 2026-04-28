import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import OpportunityCard from '../../components/OpportunityCard';
import { Search, Filter, Plus, UserPlus, RefreshCw } from 'lucide-react';
import { useAdminCoordinatorContext } from '../../context/AdminCoordinatorContext';
import ConfirmDialog from '../../components/UI/ConfirmDialog';

const Opportunities = () => {
  const { sharedOpportunities, coordinators, assignDrive, unassignDrive, refreshOpportunities } = useAdminCoordinatorContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  
  // Bulk actions state
  const [selectedOpportunities, setSelectedOpportunities] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'delete',
    title: '',
    message: '',
    onConfirm: null
  });

  // Re-fetch from DB every time this page mounts
  useEffect(() => {
    if (refreshOpportunities) refreshOpportunities();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (refreshOpportunities) await refreshOpportunities();
    setRefreshing(false);
  };

  // Derive filter options dynamically from live data
  const opportunityTypes = useMemo(() => {
    const types = [...new Set(sharedOpportunities.map(j => j.opportunityType || j.type).filter(Boolean))];
    return ['All', ...types];
  }, [sharedOpportunities]);

  const statuses = useMemo(() => {
    const s = [...new Set(sharedOpportunities.map(j => j.status).filter(Boolean))];
    return ['All', ...s];
  }, [sharedOpportunities]);

  const filteredJobs = useMemo(() => sharedOpportunities.filter(job => {
    const matchesSearch =
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const jobType = job.opportunityType || job.type;
    const matchesType = typeFilter === 'All' || jobType === typeFilter;
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  }), [sharedOpportunities, searchTerm, typeFilter, statusFilter]);

  // Bulk action handlers
  const handleSelectAll = () => {
    if (selectedOpportunities.length === filteredJobs.length) {
      setSelectedOpportunities([]);
    } else {
      setSelectedOpportunities(filteredJobs.map(job => job.id));
    }
  };

  const handleSelectOpportunity = (opportunityId) => {
    setSelectedOpportunities(prev => 
      prev.includes(opportunityId) 
        ? prev.filter(id => id !== opportunityId)
        : [...prev, opportunityId]
    );
  };

  const handleBulkAction = (action) => {
    const count = selectedOpportunities.length;
    let dialogConfig = {};

    switch (action) {
      case 'delete':
        dialogConfig = {
          type: 'delete',
          title: 'Delete Opportunities',
          message: `Are you sure you want to delete ${count} ${count === 1 ? 'opportunity' : 'opportunities'}? This action cannot be undone.`,
          onConfirm: () => executeBulkAction('delete')
        };
        break;
      case 'archive':
        dialogConfig = {
          type: 'archive',
          title: 'Archive Opportunities',
          message: `Are you sure you want to archive ${count} ${count === 1 ? 'opportunity' : 'opportunities'}? They will be hidden from the main view.`,
          onConfirm: () => executeBulkAction('archive')
        };
        break;
      case 'export':
        dialogConfig = {
          type: 'export',
          title: 'Export Opportunities',
          message: `Export ${count} ${count === 1 ? 'opportunity' : 'opportunities'} to CSV file?`,
          onConfirm: () => executeBulkAction('export')
        };
        break;
      default:
        return;
    }

    setConfirmDialog({
      isOpen: true,
      ...dialogConfig
    });
  };

  const executeBulkAction = async (action) => {
    try {
      // Here you would implement the actual API calls
      console.log(`Executing bulk action: ${action} on opportunities:`, selectedOpportunities);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear selection and close dialog
      setSelectedOpportunities([]);
      setShowBulkActions(false);
      setConfirmDialog({ isOpen: false, type: 'delete', title: '', message: '', onConfirm: null });
      
      // Refresh data
      if (refreshOpportunities) await refreshOpportunities();
    } catch (error) {
      console.error('Bulk action failed:', error);
      // Handle error gracefully
    }
  };

  useEffect(() => {
    setShowBulkActions(selectedOpportunities.length > 0);
  }, [selectedOpportunities]);

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Opportunities</h1>
          <p className="text-gray-500 font-medium text-[15px]">
            Manage all placement and internship drives. {sharedOpportunities.length > 0 && <span className="text-blue-600 font-semibold">{sharedOpportunities.length} total</span>}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/admin/opportunities/new')}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer font-medium"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Opportunity
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-blue-900">
              {selectedOpportunities.length} {selectedOpportunities.length === 1 ? 'opportunity' : 'opportunities'} selected
            </span>
            <button
              onClick={() => setSelectedOpportunities([])}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Selected
            </button>
            <button
              onClick={() => handleBulkAction('archive')}
              className="px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Archive Selected
            </button>
            <button
              onClick={() => handleBulkAction('export')}
              className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4">
        {/* Search and Selection */}
        <div className="flex gap-3 items-center">
          <div className="flex w-full bg-gray-50 items-center px-4 py-2.5 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by company, role or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 text-xs ml-2">✕</button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedOpportunities.length === filteredJobs.length && filteredJobs.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Select All</span>
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Type
          </span>
          {opportunityTypes.map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                typeFilter === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Status
          </span>
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Active filter summary */}
        {(typeFilter !== 'All' || statusFilter !== 'All' || searchTerm) && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-gray-500">
              Showing <span className="font-bold text-gray-900">{filteredJobs.length}</span> of {sharedOpportunities.length} opportunities
            </span>
            <button
              onClick={() => { setTypeFilter('All'); setStatusFilter('All'); setSearchTerm(''); }}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          {sharedOpportunities.length === 0 ? 'No opportunities found. Create your first one!' : 'No opportunities match your filters.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="relative group">
              <OpportunityCard 
                {...job} 
                onSelect={handleSelectOpportunity}
                isSelected={selectedOpportunities.includes(job.id)}
                showSelection={true}
              />
              <div className="absolute top-2 right-12 z-10 bg-white/90 shadow-sm border border-gray-200 rounded-lg backdrop-blur-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-gray-500" />
                  <select
                    className="text-xs font-semibold bg-transparent border-none outline-none text-gray-700 w-24 cursor-pointer"
                    value={job.assignedCoordinatorId || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') unassignDrive(job.id);
                      else assignDrive(job.id, val);
                    }}
                  >
                    <option value="">Unassigned</option>
                    {coordinators.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {job.assignedCoordinatorId && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap border border-indigo-200">
                  Assigned to {coordinators.find(c => c.id === job.assignedCoordinatorId)?.name || 'Coordinator'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: 'delete', title: '', message: '', onConfirm: null })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />
    </Layout>
  );
};

export default Opportunities;
