import { supabase } from './supabase';
import { calculateMatchScore } from './ai';
import EmailJS from '@emailjs/browser';

// Initialize EmailJS with your public key
EmailJS.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export async function bulkShortlistCandidates(jobId) {
  try {
    // Get all applications for this job
    const { data: applications } = await supabase
      .from('applications')
      .select(`
        *,
        candidates (*),
        match_scores (*),
        jobs (*),
        profiles (*)
      `)
      .eq('job_id', jobId);

    if (!applications || applications.length === 0) {
      console.log('No applications found for this job');
      return;
    }

    // Calculate match scores for candidates without scores
    const candidatesToUpdate = applications
      .filter(app => !app.match_scores?.[0])
      .map(async (app) => {
        const score = await calculateMatchScore(app.candidates, app.jobs);
        return {
          id: app.id,
          score
        };
      });

    // Update match scores in database
    for (const { id, score } of await Promise.all(candidatesToUpdate)) {
      await supabase
        .from('match_scores')
        .insert({
          job_id: jobId,
          candidate_id: id,
          ...score
        });
    }

    // Get all candidates with match scores >= 75
    const shortlisted = applications.filter(app => 
      app.match_scores?.[0]?.overall_score >= 75
    );

    // Update application status and send emails
    for (const app of shortlisted) {
      // Update application status
      await supabase
        .from('applications')
        .update({ status: 'shortlisted' })
        .eq('id', app.id);

      // Send shortlist email
      await sendShortlistEmail(app);
    }

    return shortlisted;
  } catch (error) {
    console.error('Error in bulk shortlisting:', error);
    throw error;
  }
}

async function sendShortlistEmail(application) {
  try {
    const templateParams = {
      to_email: application.profiles.email,
      to_name: application.profiles.full_name,
      job_title: application.jobs.title,
      company_name: application.jobs.company_name,
      match_score: application.match_scores[0].overall_score,
      company_email: import.meta.env.VITE_COMPANY_EMAIL,
      company_phone: import.meta.env.VITE_COMPANY_PHONE,
      company_address: 'Kanpur,Uttar Pradesh, India',
      company_website: 'https://ramanhiring.com'
    };

    await EmailJS.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );
  } catch (error) {
    console.error('Error sending shortlist email:', error);
    throw error;
  }
}
