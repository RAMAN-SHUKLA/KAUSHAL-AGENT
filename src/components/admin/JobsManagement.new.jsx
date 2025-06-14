import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  Trash2 as Delete, 
  Edit2 as Edit, 
  Plus as Add,
  X as Close
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import JobPostForm from './JobPostForm';
import { toast } from 'react-toastify';

const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select(`
          *,
          applications:applications(count)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to include applications count
      const jobsWithCount = data.map(job => ({
        ...job,
        applications_count: job.applications?.[0]?.count || 0
      }));

      setJobs(jobsWithCount);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message);
      toast.error('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchJobs();

    // Set up real-time subscription
    const subscription = supabase
      .channel('jobs-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'jobs' 
        }, 
        () => {
          console.log('Jobs table changed, refreshing data...');
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleJobPosted = () => {
    setShowPostForm(false);
    fetchJobs();
    toast.success('Job posted successfully!');
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      setError('');
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (deleteError) throw deleteError;

      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
      setError(err.message);
      toast.error('Failed to delete job. Please try again.');
    }
  };

  const handleEditJob = (jobId) => {
    // Implement edit functionality
    console.log('Edit job:', jobId);
  };

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-yellow"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="w-6 h-6" />
          Job Management
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPostForm(true)}
            className="flex items-center gap-2 bg-accent-yellow text-black rounded-lg py-2 px-4 hover:bg-accent-yellow-dark"
          >
            <Add className="w-5 h-5" />
            Post New Job
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-accent-yellow focus:border-accent-yellow w-64"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {showPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPostForm(false)}
              className="absolute top-4 right-4 text-accent-yellow hover:text-accent-yellow-dark"
            >
              <Close className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4">Post New Job</h3>
            <JobPostForm onJobPosted={handleJobPosted} />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {jobs.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-400">
          No jobs found. Click "Post New Job" to create one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      job.status === 'active' ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.applications_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-accent-yellow hover:text-accent-yellow-dark p-1 rounded hover:bg-gray-700"
                        onClick={() => handleEditJob(job.id)}
                        title="Edit job"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-gray-700"
                        onClick={() => deleteJob(job.id)}
                        title="Delete job"
                      >
                        <Delete className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobsManagement; 