import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import { toast } from 'react-toastify';

const JobPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    basic_requirements: '',
    salary_min: '',
    salary_max: '',
    experience_required: '',
    work_mode: 'remote',
    location: '',
    test_questions: []
  });
  const [loading, setLoading] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTestQuestion = () => {
    setTestQuestions(prev => [...prev, {
      question: '',
      options: ['', '', '', ''],
      correct_answer: 0
    }]);
  };

  const handleTestQuestionChange = (index, field, value) => {
    setTestQuestions(prev => {
      const newQuestions = [...prev];
      if (field === 'options') {
        newQuestions[index][field] = value.split('\n');
      } else {
        newQuestions[index][field] = value;
      }
      return newQuestions;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...formData,
          test_questions: testQuestions
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Job posted successfully!');
    } catch (error) {
      toast.error('Error posting job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Post New Job</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Basic Requirements</label>
            <textarea
              name="basic_requirements"
              value={formData.basic_requirements}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              rows="4"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Salary Min</label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Salary Max</label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Experience Required</label>
            <input
              type="text"
              name="experience_required"
              value={formData.experience_required}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Work Mode</label>
            <select
              name="work_mode"
              value={formData.work_mode}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Test Questions</h3>
            <button
              type="button"
              onClick={addTestQuestion}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Add Test Question
            </button>
            
            {testQuestions.map((question, index) => (
              <div key={index} className="mt-4 border p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">Question</label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleTestQuestionChange(index, 'question', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Options (one per line)</label>
                  <textarea
                    value={question.options.join('\n')}
                    onChange={(e) => handleTestQuestionChange(index, 'options', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="4"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Correct Answer</label>
                  <select
                    value={question.correct_answer}
                    onChange={(e) => handleTestQuestionChange(index, 'correct_answer', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {question.options.map((option, i) => (
                      <option key={i} value={i}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPost;
