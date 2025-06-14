import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { toast } from 'react-toastify';

const Test = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTest();
    startTimer();
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      submitTest();
    }
  }, [timeLeft]);

  const loadTest = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('test_questions')
        .eq('id', jobId)
        .single();

      if (error) throw error;
      setQuestions(data.test_questions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading test:', error);
      toast.error('Error loading test questions');
      navigate('/applications');
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

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          test_completed: true,
          test_answers: answers,
          test_score: calculateScore()
        })
        .eq('job_id', jobId)
        .eq('candidate_id', supabase.auth.getUser().data.user.id);

      if (error) throw error;
      toast.success('Test submitted successfully!');
      navigate('/applications');
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Error submitting test');
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        score += 100 / questions.length;
      }
    });
    return Math.round(score);
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Job Test</h1>
          <div className="text-sm">
            Time remaining: {Math.floor(timeLeft / 60)}:{
              String(timeLeft % 60).padStart(2, '0')
            }
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <p className="text-gray-600 mb-4">{currentQuestionData.question}</p>

          {currentQuestionData.options.map((option, index) => (
            <div
              key={index}
              className="flex items-center mb-2"
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={index}
                checked={answers[currentQuestion] === index}
                onChange={() => handleAnswer(currentQuestion, index)}
                className="mr-2"
              />
              <span>{option}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={handleSubmit}
              disabled={currentQuestion !== questions.length - 1}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
