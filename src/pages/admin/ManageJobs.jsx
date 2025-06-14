import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };
    fetchJobs();

    // Real-time subscription
    const channel = supabase
      .channel('jobs-changes-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
        fetchJobs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
        // First, delete related records if any (e.g., applications, match_scores)
        await supabase.from('job_applications').delete().eq('job_id', jobId);
        await supabase.from('match_scores').delete().eq('job_id', jobId);

        const { error } = await supabase.from('jobs').delete().eq('id', jobId);
        if (error) {
            setError(error.message);
        } else {
            setJobs(jobs.filter(job => job.id !== jobId));
        }
    }
  };

  if (loading) return <div className="p-8 text-white">Loading jobs...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Job Postings</h1>
          <Link
            to="/admin/jobs/new"
            className="flex items-center bg-accent-yellow text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-accent-yellow-dark transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New Job
          </Link>
        </header>

        <div className="bg-gray-800 rounded-xl shadow-lg">
          <ul className="divide-y divide-gray-700">
            {jobs.length > 0 ? jobs.map(job => (
              <li key={job.id} className="p-6 flex justify-between items-center hover:bg-gray-700 transition-colors">
                <div>
                  <h3 className="text-xl font-bold text-white">{job.title}</h3>
                  <p className="text-gray-400">{job.company_name} - <span className={`capitalize text-sm font-semibold ${job.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>{job.status}</span></p>
                </div>
                <div className="flex items-center space-x-4">
                  <Link to={`/admin/jobs/edit/${job.id}`} className="p-2 text-gray-400 hover:text-white">
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button onClick={() => deleteJob(job.id)} className="p-2 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            )) : (
              <li className="p-6 text-center text-gray-400">No jobs found. Create one to get started!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ManageJobs; 