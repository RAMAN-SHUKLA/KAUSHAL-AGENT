import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import { toast } from 'react-toastify';
import { Star, Mail } from 'lucide-react';

const ApplicationScoring = ({ application, onScoreUpdate }) => {
  const [score, setScore] = useState(application.score || 0);
  const [feedback, setFeedback] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleScoreChange = async (newScore) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .update({ score: newScore })
        .eq('id', application.id)
        .select()
        .single();

      if (error) throw error;

      setScore(newScore);
      onScoreUpdate(data);
      toast.success('Score updated successfully');
    } catch (error) {
      console.error('Error updating score:', error);
      toast.error('Failed to update score');
    }
  };

  const sendEmail = async () => {
    if (!feedback) {
      toast.error('Please provide feedback before sending email');
      return;
    }

    setIsSending(true);
    try {
      // Send email using Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-application-feedback', {
        body: {
          to: application.candidate_email,
          subject: `Application Update for ${application.job_title}`,
          score: score,
          feedback: feedback,
          jobTitle: application.job_title
        }
      });

      if (error) throw error;

      // Update application status
      await supabase
        .from('job_applications')
        .update({
          feedback_sent: true,
          feedback: feedback,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);

      toast.success('Feedback sent successfully');
      setFeedback('');
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Failed to send feedback');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Application Score
        </h3>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleScoreChange(star)}
              className={`p-1 rounded-full transition-colors ${
                star <= score
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-gray-300 hover:text-yellow-500'
              }`}
            >
              <Star className="h-8 w-8 fill-current" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Send Feedback
        </h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter feedback for the candidate..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
          rows={4}
        />
        <button
          onClick={sendEmail}
          disabled={isSending || !feedback}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-400"
        >
          <Mail className="h-5 w-5 mr-2" />
          {isSending ? 'Sending...' : 'Send Feedback'}
        </button>
      </div>
    </div>
  );
};

export default ApplicationScoring; 