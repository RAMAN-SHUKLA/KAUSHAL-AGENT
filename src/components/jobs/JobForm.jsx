import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, Plus, X } from 'lucide-react';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'];
const EXPERIENCE_LEVELS = ['entry', 'mid-level', 'senior', 'lead', 'executive'];

const JobForm = ({ initialData, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary_range: '',
    basic_requirements: '',
    job_description: '',
    skills: [],
    experience_level: 'entry',
    status: 'draft',
    ...initialData
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('jobs')
        .insert([formData]);
      if (error) throw error;
      onSubmit && onSubmit();
    } catch (error) {
      setError(error.message);
      if (error.message.includes('Content-Type')) {
        alert('Content-Type error: Please check your Supabase client usage.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <div>
          <label className="block mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-accent-yellow focus:border-accent-yellow"
            placeholder="e.g. Senior Software Engineer"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block mb-2">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-accent-yellow focus:border-accent-yellow"
            placeholder="Company Name"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-accent-yellow focus:border-accent-yellow"
            placeholder="e.g. New York, NY (Remote)"
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="block mb-2">
            Job Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-accent-yellow focus:border-accent-yellow"
          >
            {JOB_TYPES.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block mb-2">
            Experience Level <span className="text-red-500">*</span>
          </label>
          <select
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-accent-yellow focus:border-accent-yellow"
          >
            {EXPERIENCE_LEVELS.map(level => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block mb-2">Salary Range</label>
          <input
            type="text"
            name="salary_range"
            value={formData.salary_range}
            onChange={handleChange}
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-accent-yellow focus:border-accent-yellow"
            placeholder="e.g. $80,000 - $120,000"
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block mb-2">
          Skills <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.skills.map(skill => (
            <span
              key={skill}
              className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-accent-yellow focus:border-accent-yellow"
            placeholder="Add a skill"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <button
            type="button"
            onClick={addSkill}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
      </div>

      {/* Basic Requirements */}
      <div>
        <label className="block mb-2">
          Basic Requirements <span className="text-red-500">*</span>
        </label>
        <textarea
          name="basic_requirements"
          value={formData.basic_requirements}
          onChange={handleChange}
          required
          rows="4"
          className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-accent-yellow focus:border-accent-yellow"
          placeholder="List the basic requirements for this position..."
        />
      </div>

      {/* Job Description */}
      <div>
        <label className="block mb-2">
          Job Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="job_description"
          value={formData.job_description}
          onChange={handleChange}
          required
          rows="6"
          className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-accent-yellow focus:border-accent-yellow"
          placeholder="Provide a detailed job description..."
        />
      </div>

      {/* Status */}
      <div>
        <label className="block mb-2">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-accent-yellow focus:border-accent-yellow"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
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
              Saving...
            </>
          ) : (
            'Save Job'
          )}
        </button>
      </div>
    </form>
  );
};

export default JobForm; 