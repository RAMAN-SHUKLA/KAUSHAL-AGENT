import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../services/supabase";
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    shortlisted: 0,
    pending: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let channel;

    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // First check if user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (!profile) {
          // Create profile if it doesn't exist
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email.split('@')[0],
              role: 'candidate'
            });

          if (createError) throw createError;
        }

        // Fetch applications
        const { data: applications, error: applicationsError } = await supabase
          .from('job_applications')
          .select('status')
          .eq('applicant_id', user.id);

        if (applicationsError) throw applicationsError;

        const statsData = (applications || []).reduce((acc, app) => {
          acc.totalApplications++;
          switch (app.status) {
            case 'pending': acc.pending++; break;
            case 'shortlisted': acc.shortlisted++; break;
            case 'rejected': acc.rejected++; break;
            default: break;
          }
          return acc;
        }, { totalApplications: 0, shortlisted: 0, pending: 0, rejected: 0 });

        if (isMounted) {
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        if (isMounted) {
          setError(error.message);
          toast.error('Failed to load dashboard data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    if (user) {
      channel = supabase
        .channel(`candidate-dashboard-${user.id}`)
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'job_applications', filter: `applicant_id=eq.${user.id}` },
          () => {
            console.log('Application status changed, refreshing stats...');
            fetchStats();
          }
        )
        .subscribe();
    }

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2 text-gray-900 dark:text-white">
          <Briefcase className="w-6 h-6" />
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Applications</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-500">{stats.totalApplications}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shortlisted</h3>
            </div>
            <p className="text-3xl font-bold text-green-500">{stats.shortlisted}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <XCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rejected</h3>
            </div>
            <p className="text-3xl font-bold text-red-500">{stats.rejected}</p>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={() => navigate('/jobs')} 
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Jobs
          </button>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Tips for Success</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">1. Complete Your Profile</h3>
              <p className="text-gray-600 dark:text-gray-400">Make sure your profile is complete with all relevant information.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">2. Take Tests</h3>
              <p className="text-gray-600 dark:text-gray-400">Complete all required tests for your applications.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">3. Follow Up</h3>
              <p className="text-gray-600 dark:text-gray-400">Check your applications regularly and follow up when needed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
