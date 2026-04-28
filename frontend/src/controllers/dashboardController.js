import { fetchOpportunities, fetchOpportunityById, createOpportunityApi, fetchStudents, fetchApplications, fetchInterviews, createApplicationApi, fetchStudentApplications } from '../services/api';

export const DashboardController = {
  getStats: () => [],

  getOpportunities: async () => {
    try {
      const { data } = await fetchOpportunities();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  createOpportunity: async (jobData) => {
    try {
      const { data } = await createOpportunityApi(jobData);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  getOpportunityById: async (id) => {
    try {
      const { data } = await fetchOpportunityById(id);
      return data;
    } catch (err) {
      console.error("Failed to fetch opportunity by ID:", err);
      // Return mock data instead of null to prevent page crashes
      return {
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
      };
    }
  },
  
  applyToJob: async (id, studentId) => {
    try {
      const activeStudentId = studentId || localStorage.getItem('studentId');
      if (!activeStudentId || activeStudentId === 'null') {
         console.warn("No active student ID to submit application");
         return false;
      }
      const appData = { studentId: activeStudentId, jobId: id };
      await createApplicationApi(appData);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  getTasks: (filter = 'All') => [],
  
  getTaskById: async (id) => {
    try {
      // For now, return mock data since we don't have a specific task endpoint
      // In a real implementation, this would fetch from the database
      const mockTasks = [
        {
          id: '1',
          title: 'Review Applications for Google Drive',
          assignee: 'John Doe',
          dueDate: '2024-01-15',
          status: 'Pending',
          description: 'Review and shortlist applications for the Google placement drive. Focus on candidates with strong programming skills and good academic records.'
        },
        {
          id: '2',
          title: 'Schedule Interviews for Microsoft',
          assignee: 'Jane Smith',
          dueDate: '2024-01-18',
          status: 'In Progress',
          description: 'Coordinate with shortlisted candidates and schedule technical interviews for the Microsoft placement drive.'
        },
        {
          id: '3',
          title: 'Prepare Placement Report',
          assignee: 'Mike Johnson',
          dueDate: '2024-01-20',
          status: 'Pending',
          description: 'Compile and analyze placement statistics for the current semester, including company-wise placement numbers and salary packages.'
        }
      ];
      return mockTasks.find(task => task.id === id) || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  getCoordinators: () => [],
  
  getStudents: async () => {
    try {
      const { data } = await fetchStudents();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },
  
  getApplications: async () => {
    try {
      const { data } = await fetchApplications();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      // Return empty array to prevent page crashes
      return [];
    }
  },

  getStudentApplications: async (studentId) => {
    if (!studentId || studentId === 'null') return [];
    try {
      const { data } = await fetchStudentApplications(studentId);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },
  
  getInterviews: async () => {
    try {
      const { data } = await fetchInterviews();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getTaskDistribution: () => [],
  getApplicationOverview: () => [],
  getAnalyticsSummary: () => null,
  getNotifications: () => [
    {
      id: '1',
      type: 'job',
      text: 'New opportunity posted: Google Summer Internship 2024',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'application',
      text: '5 new applications received for Microsoft Drive',
      time: '4 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'interview',
      text: 'Interview scheduled for John Doe - Amazon SDE',
      time: '1 day ago',
      read: true
    },
    {
      id: '4',
      type: 'job',
      text: 'Facebook Drive deadline approaching in 2 days',
      time: '2 days ago',
      read: true
    }
  ],
  
  markAsRead: (id) => {
    try {
      const notifications = DashboardController.getNotifications();
      const notification = notifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  
  searchAll: async (query) => {
    try {
      const [opportunities, tasks] = await Promise.all([
        DashboardController.getOpportunities(),
        DashboardController.getTasks()
      ]);
      
      const filteredJobs = opportunities.filter(job => 
        job.company?.toLowerCase().includes(query.toLowerCase()) ||
        job.role?.toLowerCase().includes(query.toLowerCase()) ||
        job.title?.toLowerCase().includes(query.toLowerCase())
      );
      
      const mockTasks = [
        {
          id: '1',
          title: 'Review Applications for Google Drive',
          assignee: 'John Doe',
          dueDate: '2024-01-15',
          status: 'Pending'
        },
        {
          id: '2',
          title: 'Schedule Interviews for Microsoft',
          assignee: 'Jane Smith',
          dueDate: '2024-01-18',
          status: 'In Progress'
        }
      ];
      
      const filteredTasks = mockTasks.filter(task =>
        task.title?.toLowerCase().includes(query.toLowerCase()) ||
        task.assignee?.toLowerCase().includes(query.toLowerCase())
      );
      
      return { jobs: filteredJobs, tasks: filteredTasks };
    } catch (err) {
      console.error(err);
      return { jobs: [], tasks: [] };
    }
  },
  
  filterDataByTime: (range) => [],
  
  getMessages: () => [],
  getMessageById: (id) => null,
  
  markMessageAsRead: (id) => false
};
