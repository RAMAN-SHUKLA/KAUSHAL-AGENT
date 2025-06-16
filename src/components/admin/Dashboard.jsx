import React, { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/supabase';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    placementRate: '0%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await analyticsService.getDashboardStats();
        // Calculate placement rate (example: 10% of applications are successful)
        const placementRate = data.totalApplications > 0 
          ? Math.round((data.totalApplications * 0.1) * 100) / 100
          : 0;
        
        setStats({
          totalUsers: data.totalUsers,
          totalJobs: data.totalJobs,
          totalApplications: data.totalApplications,
          placementRate: `${placementRate}%`
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      change: '+12%',
      href: '/admin/users'
    },
    {
      name: 'Active Jobs',
      value: stats.totalJobs.toString(),
      icon: Briefcase,
      change: '+8%',
      href: '/admin/jobs'
    },
    {
      name: 'Applications',
      value: stats.totalApplications.toString(),
      icon: FileText,
      change: '+23%',
      href: '/admin/applications'
    },
    {
      name: 'Placement Rate',
      value: stats.placementRate,
      icon: TrendingUp,
      change: '+5%',
      href: '/admin/analytics'
    },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="h-8 w-8 text-yellow-600" />
              <span className="flex items-center text-sm text-green-600">
                {stat.change}
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</h3>
            <p className="text-gray-600 dark:text-gray-400">{stat.name}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/jobs/new"
            className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
          >
            <Briefcase className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Post New Job</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create a new job listing</p>
            </div>
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
          >
            <Users className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Manage Users</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View and manage users</p>
            </div>
          </Link>
          <Link
            to="/admin/applications"
            className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
          >
            <FileText className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Review Applications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Process pending applications</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 