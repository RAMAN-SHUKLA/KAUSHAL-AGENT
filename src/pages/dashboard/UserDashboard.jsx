import React from 'react';
import { Search, Briefcase, User, Bell, Settings } from 'lucide-react';

const JobCard = ({ title, company, location, type, isNew }) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-400">{company}</p>
        <h3 className="text-xl font-bold text-white mt-1">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{location}</p>
      </div>
      {isNew && <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">New</span>}
    </div>
    <div className="mt-4">
      <p className="text-sm bg-gray-700 text-gray-300 rounded-full px-3 py-1 inline-block">{type}</p>
    </div>
  </div>
);

function UserDashboard() {
  const recommendedJobs = [
    { title: 'AI Prompt Engineer', company: 'Innovate AI', location: 'Remote', type: 'Full-time', isNew: true },
    { title: 'Frontend Developer (React)', company: 'Creative Solutions', location: 'San Francisco, CA', type: 'Contract' },
    { title: 'Cloud Solutions Architect', company: 'Nexus Cloud', location: 'Austin, TX', type: 'Full-time', isNew: true },
    { title: 'Data Scientist', company: 'DataDriven Inc.', location: 'Remote', type: 'Part-time' },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Your Dashboard</h1>
            <p className="text-gray-400 mt-2">Find your next opportunity.</p>
          </div>
          <div className="flex items-center space-x-6">
            <Bell className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
            <Settings className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
            <User className="w-8 h-8 text-gray-400 hover:text-white transition-colors" />
          </div>
        </header>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="w-6 h-6 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for jobs, companies, or keywords..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl py-4 pl-14 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Recommended Jobs */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Briefcase className="w-6 h-6 mr-3" />
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedJobs.map((job, index) => <JobCard key={index} {...job} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard; 