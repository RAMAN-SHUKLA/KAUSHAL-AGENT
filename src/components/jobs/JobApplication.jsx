import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, Upload } from 'lucide-react';

const JobApplication = ({ jobId, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    require_resume: true,
    require_cover_letter: false
  });
  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeFile: null
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('setting_value')
        .eq('setting_key', 'application_settings')
        .single();

      if (error) throw error;
      setSettings(data.setting_value);
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Resume file size must be less than 5MB');
      return;
    }
    setFormData(prev => ({ ...prev, resumeFile: file }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if user has already applied
      const { data: existingApplication } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('applicant_id', user.id)
        .single();

      if (existingApplication) {
        throw new Error('You have already applied for this job');
      }

      let resumeUrl = null;
      if (formData.resumeFile) {
        const fileExt = formData.resumeFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('resumes')
          .upload(fileName, formData.resumeFile);

        if (uploadError) throw uploadError;
        resumeUrl = data.path;
      }

      const { error: applicationError } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          applicant_id: user.id,
          resume_url: resumeUrl,
          cover_letter: formData.coverLetter || null
        });

      if (applicationError) throw applicationError;

      // Update application count
      const { error: updateError } = await supabase.rpc('increment_application_count', {
        job_id: jobId
      });

      if (updateError) throw updateError;

      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Submit Application</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resume Upload */}
        <div>
          <label className="block mb-2">
            Resume {settings.require_resume && <span className="text-red-500">*</span>}
          </label>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-5 h-5" />
              Upload Resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required={settings.require_resume}
                className="hidden"
              />
            </label>
            {formData.resumeFile && (
              <span className="text-sm text-gray-400">
                {formData.resumeFile.name}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Accepted formats: PDF, DOC, DOCX (max 5MB)
          </p>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block mb-2">
            Cover Letter {settings.require_cover_letter && <span className="text-red-500">*</span>}
          </label>
          <textarea
            value={formData.coverLetter}
            onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
            required={settings.require_cover_letter}
            rows="6"
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-accent-yellow focus:border-accent-yellow"
            placeholder="Tell us why you're the perfect fit for this role..."
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-accent-yellow hover:bg-accent-yellow/90 text-black px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobApplication; 