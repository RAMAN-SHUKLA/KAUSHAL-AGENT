import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Users,
  Calendar
} from 'lucide-react';

const JobsList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // Real-time subscription
    const channel = supabase
      .channel('admin-jobs-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, loadJobs)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const toggleJobStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) throw error;
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
    } catch (err) {
      console.error('Error updating job status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Jobs Management</h1>
        <Link
          to="/admin/jobs/new"
          className="flex items-center gap-2 bg-accent-yellow hover:bg-accent-yellow/90 text-black px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {jobs.map(job => (
          <div
            key={job.id}
            className="bg-gray-800 rounded-lg p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <div className="text-gray-400 space-y-1">
                  <p>{job.company}</p>
                  <p>{job.location}</p>
                  <p className="capitalize">{job.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleJobStatus(job.id, job.status)}
                  className={`p-2 rounded-lg transition-colors ${
                    job.status === 'active'
                      ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                      : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                  }`}
                  title={job.status === 'active' ? 'Deactivate Job' : 'Activate Job'}
                >
                  {job.status === 'active' ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
                  className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors"
                  title="Edit Job"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Delete Job"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {job.applications_count} applications
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {job.views_count} views
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Posted {new Date(job.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="text-center p-6 text-gray-400">
            No jobs found. Click the button above to post your first job.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList; 