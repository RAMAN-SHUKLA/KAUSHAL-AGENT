import React, { useState } from 'react';
import { 
  Plus, 
  Trash2 as Delete, 
  X as Close 
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { toast } from 'react-toastify';

const JobPostForm = ({ onJobPosted }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary_range: '',
    description: '',
    requirements: [],
    responsibilities: [],
    benefits: [],
    experience_required: '',
    test_questions: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInput = (field, value, index) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      if (index !== undefined) {
        newArray[index] = value;
      } else {
        newArray.push('');
      }
      return { ...prev, [field]: newArray };
    });
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addTestQuestion = () => {
    setFormData(prev => ({
      ...prev,
      test_questions: [
        ...prev.test_questions,
        {
          question: '',
          options: ['', '', '', ''],
          correct_answer: 0
        }
      ]
    }));
  };

  const handleQuestionChange = (index, field, value, optionIndex) => {
    setFormData(prev => {
      const newQuestions = [...prev.test_questions];
      if (field === 'options') {
        newQuestions[index].options[optionIndex] = value;
      } else if (field === 'correct_answer') {
        newQuestions[index].correct_answer = parseInt(value);
      } else {
        newQuestions[index][field] = value;
      }
      return { ...prev, test_questions: newQuestions };
    });
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      test_questions: prev.test_questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('jobs')
        .insert([{
          ...formData,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast.success('Job posted successfully!');
      onJobPosted();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-2 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-2 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-2 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Job Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-2 text-white"
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Salary Range</label>
          <input
            type="text"
            name="salary_range"
            value={formData.salary_range}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-2 text-white"
            placeholder="e.g. $50,000 - $70,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Experience Required</label>
          <input
            type="text"
            name="experience_required"
            value={formData.experience_required}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border-gray-600 rounded-lg p-2 text-white"
            placeholder="e.g. 3+ years"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Job Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full bg-gray-700 border-gray-600 rounded-lg p-2 text-white"
          rows="4"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Requirements</label>
        {formData.requirements.map((req, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={req}
              onChange={(e) => handleArrayInput('requirements', e.target.value, index)}
              className="flex-1 bg-gray-700 border-gray-600 rounded-lg p-2 text-white"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('requirements', index)}
              className="text-red-500 hover:text-red-400"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleArrayInput('requirements')}
          className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Requirement
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Responsibilities</label>
        {formData.responsibilities.map((resp, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={resp}
              onChange={(e) => handleArrayInput('responsibilities', e.target.value, index)}
              className="flex-1 bg-gray-700 border-gray-600 rounded-lg p-2 text-white"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('responsibilities', index)}
              className="text-red-500 hover:text-red-400"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleArrayInput('responsibilities')}
          className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Responsibility
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Benefits</label>
        {formData.benefits.map((benefit, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={benefit}
              onChange={(e) => handleArrayInput('benefits', e.target.value, index)}
              className="flex-1 bg-gray-700 border-gray-600 rounded-lg p-2 text-white"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('benefits', index)}
              className="text-red-500 hover:text-red-400"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleArrayInput('benefits')}
          className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Benefit
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-300">Assessment Questions</label>
          <button
            type="button"
            onClick={addTestQuestion}
            className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>
        
        {formData.test_questions.map((question, qIndex) => (
          <div key={qIndex} className="bg-gray-700 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-start mb-2">
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                className="flex-1 bg-gray-600 border-gray-500 rounded-lg p-2 text-white"
                placeholder="Enter question"
              />
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="ml-2 text-red-500 hover:text-red-400"
              >
                <Close className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2 ml-4">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct_${qIndex}`}
                    checked={question.correct_answer === oIndex}
                    onChange={() => handleQuestionChange(qIndex, 'correct_answer', oIndex)}
                    className="text-yellow-500 focus:ring-yellow-500"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleQuestionChange(qIndex, 'options', e.target.value, oIndex)}
                    className="flex-1 bg-gray-600 border-gray-500 rounded-lg p-2 text-white"
                    placeholder={`Option ${oIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </div>
    </form>
  );
};

export default JobPostForm;
