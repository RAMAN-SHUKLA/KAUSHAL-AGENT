import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { CheckCircle, XCircle, Clock, FileText, Loader2, AlertCircle } from "lucide-react";
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const Applications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching applications for user:', user.id);
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          id,
          status,
          created_at,
          resume_url,
          cover_letter,
          job:jobs (
            id,
            title,
            company_name,
            location,
            work_mode
          )
        `)
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }

      console.log('Fetched applications:', data);
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.message);
      toast.error('Error loading applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'shortlisted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'hired':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'shortlisted':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'hired':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Applications</h1>
      
      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No applications yet</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Start your journey by applying to jobs that match your skills.</p>
          <Link
            to="/candidate/jobs"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {app.job?.title || 'Untitled Position'}
                </h3>
                <div className="flex items-center gap-2">
                  {getStatusIcon(app.status)}
                  <span className={`text-sm font-medium capitalize ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-600 dark:text-gray-300">{app.job?.company_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {app.job?.location} • {app.job?.work_mode}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Applied on: {new Date(app.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {app.resume_url && (
                  <a
                    href={app.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-yellow-500 hover:text-yellow-600 flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    View Resume
                  </a>
                )}
                {app.status === 'pending' && (
                  <Link
                    to={`/candidate/assessment/${app.job.id}`}
                    className="text-sm text-yellow-500 hover:text-yellow-600"
                  >
                    Take Assessment
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
