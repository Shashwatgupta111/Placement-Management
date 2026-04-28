import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardController } from '../../controllers/dashboardController';
import Layout from '../../components/Layout';
import { 
  ArrowLeft, Building2, MapPin, IndianRupee, Clock, CheckCircle, 
  Briefcase, FileText, Users, Calendar, Edit, Trash2, Eye, UserPlus
} from 'lucide-react';

const AdminOpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch real data first
        const [opportunityData, applicationsData] = await Promise.all([
          DashboardController.getOpportunityById(id),
          DashboardController.getApplications().then(apps => 
            apps.filter(app => app.jobId === id || app.opportunityId === id)
          ).catch(() => []) // If applications fail, return empty array
        ]);
        
        setOpportunity(opportunityData);
        setApplications(applicationsData);
      } catch (err) {
        console.error("Error fetching opportunity details:", err);
        // Set fallback mock data to prevent login redirects
        setOpportunity({
          id: id,
          company: "Sample Company",
          role: "Software Engineer",
          salary: "$100,000",
          deadline: "2026-05-15",
          logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
          tags: ["React", "Node.js", "MongoDB"],
          description: "This is a sample opportunity description. The actual data could not be loaded due to authentication issues.",
          requirements: [
            "Bachelor's degree in Computer Science or related field",
            "Experience with web development",
            "Strong problem-solving skills"
          ],
          responsibilities: [
            "Develop and maintain web applications",
            "Collaborate with cross-functional teams",
            "Write clean and maintainable code"
          ],
          location: "Remote",
          opportunityType: "Full Time",
          employmentMode: "Remote",
          status: "Active"
        });
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!opportunity) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h2>
          <button 
            onClick={() => navigate('/admin/opportunities')} 
            className="text-blue-600 hover:underline"
          >
            Return to Opportunities
          </button>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'applications', label: `Applications (${applications.length})` },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Opportunities
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          
          <div className="p-8 pt-16 relative">
            <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
              <div className="flex gap-6 items-start">
                <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-md border border-gray-100 flex items-center justify-center">
                  {opportunity.logo ? (
                    <img src={opportunity.logo} alt={opportunity.company} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="text-gray-300 font-bold text-xl">{opportunity.company?.slice(0,2).toUpperCase()}</div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{opportunity.role}</h1>
                  <p className="text-lg font-semibold text-gray-600">{opportunity.company}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {opportunity.opportunityType || 'Full-time'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {opportunity.employmentMode || 'On-site'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {opportunity.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate(`/admin/opportunities/${id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <MapPin size={12}/> Location
                </p>
                <p className="text-sm font-bold text-gray-800">{opportunity.location || 'Not Specified'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <IndianRupee size={12}/> Compensation
                </p>
                <p className="text-sm font-bold text-gray-800">{opportunity.salary || opportunity.stipend || 'Competitive'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar size={12}/> Deadline
                </p>
                <p className="text-sm font-bold text-red-600">
                  {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'Rolling basis'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Users size={12}/> Applications
                </p>
                <p className="text-sm font-bold text-gray-800">{applications.length} received</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {opportunity.description || 'No detailed description provided for this opportunity.'}
                </p>
              </div>

              {opportunity.requirements && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {opportunity.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {opportunity.responsibilities && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {opportunity.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Applications</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <UserPlus className="w-4 h-4" /> Assign Coordinator
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No applications received yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.map((application) => (
                        <tr key={application.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {application.studentName || 'Student Name'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {application.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Total Views</h3>
                  <p className="text-3xl font-bold text-blue-600">1,234</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-green-900 mb-2">Conversion Rate</h3>
                  <p className="text-3xl font-bold text-green-600">12.5%</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-purple-900 mb-2">Avg. Time to Apply</h3>
                  <p className="text-3xl font-bold text-purple-600">3.5 days</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Opportunity Status</h3>
                    <p className="text-sm text-gray-500">Control whether this opportunity is active</p>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Active
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Delete Opportunity</h3>
                    <p className="text-sm text-gray-500">Permanently remove this opportunity</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOpportunityDetail;
