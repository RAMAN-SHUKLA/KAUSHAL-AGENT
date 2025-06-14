import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  Upload,
  Loader2
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeFile: null
  });

  useEffect(() => {
    fetchJobDetails();
    checkApplicationStatus();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          test_questions
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Error loading job details');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', id)
        .eq('candidate_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setHasApplied(!!data);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Resume file size must be less than 5MB');
      return;
    }
    setFormData(prev => ({ ...prev, resumeFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      // Check if user has completed their profile
      if (!profile?.full_name || !profile?.phone || !profile?.location) {
        toast.error('Please complete your profile before applying');
        navigate('/profile');
        return;
      }

      // Upload resume if provided
      let resumeUrl = null;
      if (formData.resumeFile) {
        const fileExt = formData.resumeFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, formData.resumeFile);

        if (uploadError) throw uploadError;
        resumeUrl = fileName;
      }

      // Create application
      const { error: applicationError } = await supabase
        .from('applications')
        .insert([{
          job_id: id,
          candidate_id: user.id,
          status: 'pending',
          cover_letter: formData.coverLetter,
          resume_url: resumeUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (applicationError) throw applicationError;

      toast.success('Application submitted successfully!');
      setHasApplied(true);
      
      // If job has assessment questions, redirect to assessment
      if (job.test_questions?.length > 0) {
        navigate(`/assessment/${id}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Error submitting application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-300">Job not found</h2>
        <button
          onClick={() => navigate('/jobs')}
          className="mt-4 text-yellow-500 hover:text-yellow-400"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Job Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-gray-400">
              <div className="flex items-center">
                <Building className="w-4 h-4 mr-1" />
                {job.company}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {job.type}
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {job.salary_range || 'Not specified'}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Posted {new Date(job.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          {!hasApplied ? (
            <button
              onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Apply Now
            </button>
          ) : (
            <div className="flex items-center text-green-500">
              <CheckCircle className="w-5 h-5 mr-2" />
              Applied
            </div>
          )}
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Job Description</h2>
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>

      {/* Requirements */}
      {job.requirements?.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <ul className="list-disc list-inside space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="text-gray-300">{req}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Responsibilities */}
      {job.responsibilities?.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2">
            {job.responsibilities.map((resp, index) => (
              <li key={index} className="text-gray-300">{resp}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits */}
      {job.benefits?.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Benefits</h2>
          <ul className="list-disc list-inside space-y-2">
            {job.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-300">{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Application Form */}
      {!hasApplied && (
        <div id="application-form" className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Apply for this Position</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover Letter
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                rows="6"
                className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 text-white focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Tell us why you're the perfect fit for this role..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resume
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-5 h-5" />
                  Upload Resume
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {formData.resumeFile && (
                  <span className="text-sm text-gray-400">
                    {formData.resumeFile.name}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-400">
                Accepted formats: PDF, DOC, DOCX (max 5MB)
              </p>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={applying}
                className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {applying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Applying...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobDetails; 