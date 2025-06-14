import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { toast } from 'react-toastify';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  Loader2,
  Search,
  Star,
  Mail,
  AlertCircle
} from 'lucide-react';
import ApplicationScoring from './ApplicationScoring';

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedApplication, setSelectedApplication] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            title,
            department
          ),
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setApplications(data.map(app => ({
        ...app,
        job_title: app.jobs?.title,
        candidate_name: app.profiles?.full_name,
        candidate_email: app.profiles?.email
      })));
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // Real-time subscription
    const channel = supabase
      .channel('admin-applications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications' }, fetchApplications)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      // No need to manually update state, real-time subscription will handle it
    } catch (err) {
      console.error('Error updating application status:', err);
      setError(err.message);
    }
  };

  const downloadResume = async (applicationId, resumeUrl) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('resumes')
        .download(resumeUrl);

      if (error) throw error;

      // Create a download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${applicationId}.pdf`; // or get original filename from metadata
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Error downloading resume:', err);
      setError(err.message);
    }
  };

  const handleScoreUpdate = (updatedApplication) => {
    setApplications(apps =>
      apps.map(app =>
        app.id === updatedApplication.id ? { ...app, score: updatedApplication.score } : app
      )
    );
  };

  const downloadFile = async (fileUrl, fileName) => {
    try {
      const { data, error } = await supabase.storage
        .from('job_applications')
        .download(fileUrl);

      if (error) throw error;

      // Create a download link
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const filteredApplications = applications.filter(app => {
    const searchLower = searchTerm.toLowerCase();
    return (
      app.job_title?.toLowerCase().includes(searchLower) ||
      app.jobs?.department?.toLowerCase().includes(searchLower) ||
      app.candidate_name?.toLowerCase().includes(searchLower) ||
      app.candidate_email?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Applications Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredApplications.map((application) => (
                    <tr
                      key={application.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {application.candidate_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {application.candidate_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {application.job_title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {application.jobs?.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= (application.score || 0)
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {application.cv_url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(application.cv_url, 'CV.pdf');
                              }}
                              className="text-yellow-600 hover:text-yellow-700"
                              title="Download CV"
                            >
                              <FileText className="h-5 w-5" />
                            </button>
                          )}
                          {application.cover_letter_url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(application.cover_letter_url, 'CoverLetter.pdf');
                              }}
                              className="text-yellow-600 hover:text-yellow-700"
                              title="Download Cover Letter"
                            >
                              <Download className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApplication(application);
                          }}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <Mail className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Scoring Panel */}
        <div className="lg:col-span-1">
          {selectedApplication ? (
            <ApplicationScoring
              application={selectedApplication}
              onScoreUpdate={handleScoreUpdate}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Select an application to score and send feedback
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsManagement;
