import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, MapPin, Clock, DollarSign, Loader2, AlertCircle } from 'lucide-react';

const JobBrowse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState({});
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    workMode: '',
    salaryMin: '',
    salaryMax: '',
    experience: ''
  });

  useEffect(() => {
    fetchJobs();

    // Subscribe to real-time job updates
    const channel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'jobs' },
        () => {
          console.log('Jobs table changed, refreshing...');
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active');

      if (filters.keyword) {
        query.ilike('title', `%${filters.keyword}%`);
      }
      if (filters.location) {
        query.ilike('location', `%${filters.location}%`);
      }
      if (filters.workMode) {
        query.eq('work_mode', filters.workMode);
      }
      if (filters.salaryMin) {
        query.gte('salary_min', filters.salaryMin);
      }
      if (filters.salaryMax) {
        query.lte('salary_max', filters.salaryMax);
      }
      if (filters.experience) {
        query.ilike('experience_required', `%${filters.experience}%`);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.message);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const applyForJob = async (jobId) => {
    if (!user) {
      toast.error('Please sign in to apply for jobs');
      navigate('/login');
      return;
    }

    setApplying(prev => ({ ...prev, [jobId]: true }));
    try {
      // Check if already applied
      const { data: existingApplication } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('applicant_id', user.id)
        .single();

      if (existingApplication) {
        toast.info('You have already applied for this job');
        return;
      }

      // Create new application
      const { error: applyError } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          applicant_id: user.id,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (applyError) throw applyError;

      toast.success('Successfully applied for the job!');
      navigate('/candidate/applications');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to apply for job');
    } finally {
      setApplying(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  if (loading && jobs.length === 0) {
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
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Browse Jobs</h1>

      <form onSubmit={handleFilterSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Keyword</label>
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Job title or keywords"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="City or remote"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Work Mode</label>
            <select
              name="workMode"
              value={filters.workMode}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Min Salary</label>
            <input
              type="number"
              name="salaryMin"
              value={filters.salaryMin}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Minimum salary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Max Salary</label>
            <input
              type="number"
              name="salaryMax"
              value={filters.salaryMax}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Maximum salary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Experience</label>
            <input
              type="text"
              name="experience"
              value={filters.experience}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Years of experience"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{job.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{job.company_name}</p>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {job.location}
              </p>
              <p className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {job.work_mode}
              </p>
              <p className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                ${job.salary_min} - ${job.salary_max}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Posted {new Date(job.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                to={`/candidate/jobs/${job.id}`}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors text-center"
              >
                View Details
              </Link>
              <button
                onClick={() => applyForJob(job.id)}
                disabled={applying[job.id]}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {applying[job.id] ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  'Apply Now'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && !loading && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or check back later for new opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default JobBrowse;
