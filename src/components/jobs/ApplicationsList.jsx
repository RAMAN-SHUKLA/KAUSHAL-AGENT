import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Loader2, 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Star
} from 'lucide-react';

const statusIcons = {
  pending: Clock,
  reviewed: FileText,
  shortlisted: Star,
  rejected: XCircle,
  hired: CheckCircle
};

const statusColors = {
  pending: 'text-yellow-500',
  reviewed: 'text-blue-500',
  shortlisted: 'text-purple-500',
  rejected: 'text-red-500',
  hired: 'text-green-500'
};

const ApplicationsList = ({ jobId, isEmployer = false }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
  }, [jobId, isEmployer]);

  const loadApplications = async () => {
    try {
      let query = supabase
        .from('job_applications')
        .select(`
          *,
          jobs:jobs (title, company),
          applicant:auth.users!applicant_id (
            email,
            raw_user_meta_data->'full_name' as full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (jobId) {
        query = query.eq('job_id', jobId);
      } else if (!isEmployer) {
        query = query.eq('applicant_id', user.id);
      }

      const { data, error } = await query;
      if (error) throw error;

      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  const downloadResume = async (resumeUrl) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resumeUrl);

      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = resumeUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading resume:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center p-6 text-gray-400">
        No applications found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => {
        const StatusIcon = statusIcons[application.status] || Clock;
        return (
          <div
            key={application.id}
            className="bg-gray-800 p-4 rounded-lg space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">
                  {application.jobs.title} at {application.jobs.company}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  {application.applicant.full_name || application.applicant.email}
                </div>
              </div>
              <div className={`flex items-center gap-2 ${statusColors[application.status]}`}>
                <StatusIcon className="w-5 h-5" />
                <span className="capitalize">{application.status}</span>
              </div>
            </div>

            {application.cover_letter && (
              <div className="text-sm text-gray-300 border-l-2 border-gray-700 pl-3">
                {application.cover_letter}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-gray-400">
                Applied {new Date(application.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex items-center gap-2">
                {application.resume_url && (
                  <button
                    onClick={() => downloadResume(application.resume_url)}
                    className="flex items-center gap-1 text-sm text-accent-yellow hover:text-accent-yellow/80"
                  >
                    <Download className="w-4 h-4" />
                    Resume
                  </button>
                )}

                {isEmployer && (
                  <select
                    value={application.status}
                    onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                    className="bg-gray-700 border-gray-600 rounded-lg p-1 text-sm focus:ring-accent-yellow focus:border-accent-yellow"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationsList; 