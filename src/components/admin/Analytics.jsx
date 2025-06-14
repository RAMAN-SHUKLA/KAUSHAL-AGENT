import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { BarChart, PieChart, TrendingUp, Users, Briefcase, Calendar } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    applicationRate: 0,
    averageApplicationsPerJob: 0,
    topJobCategories: [],
    recentActivity: []
  });
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Get total jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('id, status, created_at');
      
      if (jobsError) throw jobsError;

      // Get applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('job_applications')
        .select('id, created_at, status, job_id');
      
      if (applicationsError) throw applicationsError;

      // Calculate statistics
      const activeJobs = jobsData.filter(job => job.status === 'active').length;
      const totalApplications = applicationsData.length;
      const applicationRate = totalApplications / jobsData.length || 0;
      const averageApplicationsPerJob = totalApplications / activeJobs || 0;

      // Prepare time series data for applications
      const timeSeriesData = prepareTimeSeriesData(applicationsData);

      setStats({
        totalJobs: jobsData.length,
        activeJobs,
        totalApplications,
        applicationRate: Math.round(applicationRate * 100) / 100,
        averageApplicationsPerJob: Math.round(averageApplicationsPerJob * 100) / 100
      });

      setApplicationData(timeSeriesData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareTimeSeriesData = (applications) => {
    const dates = getLast7Days();
    const applicationCounts = new Array(7).fill(0);

    applications.forEach(app => {
      const appDate = new Date(app.created_at).toLocaleDateString();
      const index = dates.findIndex(date => date === appDate);
      if (index !== -1) {
        applicationCounts[index]++;
      }
    });

    return {
      labels: dates,
      datasets: [
        {
          label: 'Applications',
          data: applicationCounts,
          borderColor: '#FDB813',
          backgroundColor: 'rgba(253, 184, 19, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString());
    }
    return dates;
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Application Trends'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Analytics Dashboard
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-700 border-gray-600 rounded-lg p-2 focus:ring-accent-yellow focus:border-accent-yellow"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <Briefcase className="w-8 h-8 text-accent-yellow" />
            <div>
              <p className="text-sm text-gray-400">Total Jobs</p>
              <p className="text-2xl font-bold">{stats.totalJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-accent-yellow" />
            <div>
              <p className="text-sm text-gray-400">Total Applications</p>
              <p className="text-2xl font-bold">{stats.totalApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <BarChart className="w-8 h-8 text-accent-yellow" />
            <div>
              <p className="text-sm text-gray-400">Application Rate</p>
              <p className="text-2xl font-bold">{stats.applicationRate}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <PieChart className="w-8 h-8 text-accent-yellow" />
            <div>
              <p className="text-sm text-gray-400">Apps per Job</p>
              <p className="text-2xl font-bold">{stats.averageApplicationsPerJob}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <Line options={chartOptions} data={applicationData} />
      </div>
    </div>
  );
};

export default Analytics; 