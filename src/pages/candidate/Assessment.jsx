import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Loader2, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const Assessment = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes

  useEffect(() => {
    fetchJobAndQuestions();
    checkAssessmentStatus();
    startTimer();
    return () => clearInterval(timer);
  }, [jobId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      submitTest();
    }
  }, [timeLeft]);

  const fetchJobAndQuestions = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;

      setJob(jobData);
      if (jobData.test_questions) {
        setQuestions(jobData.test_questions);
      }
    } catch (error) {
      console.error('Error fetching job and questions:', error);
      toast.error('Error loading assessment');
      navigate('/candidate/applications');
    } finally {
      setLoading(false);
    }
  };

  const checkAssessmentStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .select('score')
        .eq('job_id', jobId)
        .eq('candidate_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setCompleted(true);
        setScore(data.score);
      }
    } catch (error) {
      console.error('Error checking assessment status:', error);
    }
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitTest = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      // Calculate score
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (answers[index] === question.correct_answer) {
          correctAnswers++;
        }
      });
      const finalScore = Math.round((correctAnswers / questions.length) * 100);

      // Save results
      const { error: saveError } = await supabase
        .from('assessment_results')
        .insert({
          job_id: jobId,
          candidate_id: user.id,
          score: finalScore,
          answers: answers,
          completed_at: new Date().toISOString()
        });

      if (saveError) throw saveError;

      setScore(finalScore);
      setCompleted(true);
      toast.success('Assessment completed successfully!');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      </div>
    );
  }

  if (!job || !questions.length) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No assessment found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">This job doesn't have an assessment or it's not available.</p>
          <button
            onClick={() => navigate('/candidate/applications')}
            className="text-yellow-500 hover:text-yellow-600"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Assessment Completed!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your score: <span className="text-yellow-500 font-bold">{score}%</span>
          </p>
          <button
            onClick={() => navigate('/candidate/applications')}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            View Applications
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title} Assessment</h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Time remaining: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Complete this assessment as part of your application process.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {Object.keys(answers).length} of {questions.length} answered
            </div>
          </div>

          <div className="mb-8">
            <p className="text-lg text-gray-900 dark:text-white mb-4">{currentQuestionData.question}</p>
            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswer(currentQuestion, index)}
                    className="mr-3"
                  />
                  <span className="text-gray-900 dark:text-white">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={submitTest}
                disabled={submitting || Object.keys(answers).length !== questions.length}
                className="flex items-center px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Assessment'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment; 