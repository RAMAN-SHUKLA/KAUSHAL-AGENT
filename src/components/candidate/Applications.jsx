import React, { useState, useEffect } from 'react';
import { Clock, Building, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { applicationsService } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const data = await applicationsService.getApplications(user.id);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600';
      case 'Accepted':
        return 'text-green-600';
      case 'Rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return AlertCircle;
      case 'Accepted':
        return CheckCircle;
      case 'Rejected':
        return XCircle;
      default:
        return Clock;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Applications</h1>

      {/* Applications Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {applications.length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">Total Applications</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {applications.filter(app => app.status === 'Accepted').length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">Accepted</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {applications.filter(app => app.status === 'Pending').length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">In Progress</div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center text-gray-500 dark:text-gray-400">
            You haven't applied to any jobs yet
          </div>
        ) : (
          applications.map((application) => {
            const StatusIcon = getStatusIcon(application.status);
            return (
              <div key={application.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {application.jobs.title}
                    </h2>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                      <Building className="h-4 w-4 mr-2" />
                      <span className="mr-4">{application.jobs.company}</span>
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="mr-4">{application.jobs.location}</span>
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Applied on {new Date(application.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`flex items-center ${getStatusColor(application.status)}`}>
                    <StatusIcon className="h-5 w-5 mr-2" />
                    <span className="font-medium">{application.status}</span>
                  </div>
                </div>

                {application.next_step && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-white mb-1">Next Step</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {application.next_step} - {new Date(application.next_step_date).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {application.status === 'Rejected' && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="font-medium text-red-600 dark:text-red-400">Application Unsuccessful</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Thank you for your interest. We encourage you to apply for other positions.
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Applications; 