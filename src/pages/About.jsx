import React from 'react';
import { Users, Target, Shield, Award } from 'lucide-react';

const About = () => {
  const stats = [
    { name: 'Active Jobs', value: '500+' },
    { name: 'Companies', value: '100+' },
    { name: 'Successful Placements', value: '1000+' },
    { name: 'Candidate Success Rate', value: '95%' },
  ];

  const values = [
    {
      icon: Users,
      title: 'People First',
      description: 'We believe in putting people at the heart of everything we do, ensuring both candidates and employers find their perfect match.'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Using cutting-edge technology and AI-driven solutions to streamline the hiring process and deliver better results.'
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We maintain the highest standards of professionalism and ethics in all our interactions and processes.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering exceptional service and maintaining high standards in recruitment and placement.'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">About Hiring Agent</span>
              <span className="block text-yellow-600 mt-2">Transforming Recruitment</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500 dark:text-gray-300">
              We're on a mission to revolutionize the way companies hire and people find their dream jobs.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-yellow-600">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="mt-2 text-sm font-medium text-yellow-100">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our Mission
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-xl text-gray-500 dark:text-gray-300">
              To create meaningful connections between talented individuals and forward-thinking companies, 
              fostering growth and success for both parties through innovative recruitment solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our Values
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
                <div className="flex justify-center">
                  <value.icon className="h-12 w-12 text-yellow-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white text-center">
                  {value.title}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-300 text-center">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Agents Section */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">Meet Our AI Agents</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Logic, Wisdom, and Indian Philosophy
            </p>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
              Inspired by ancient Indian philosophies, our AI agents bring logic, wisdom, and clarity to your hiring journey.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Vedant */}
            <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-8">
              <span className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full mb-4">
                {/* Wisdom Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-5-9-5-9 5 9 5zm0-10V4m0 0L3 9m9-5l9 5" /></svg>
              </span>
              <div className="text-lg font-medium text-gray-900 dark:text-white">Vedant</div>
              <div className="text-base text-gray-500 dark:text-gray-300 mb-2">Wisdom & Screening Agent</div>
              <p className="text-gray-500 dark:text-gray-300 text-center">
                Guides candidates and employers with insightful screening, ensuring every match is rooted in wisdom and understanding.
              </p>
            </div>
            {/* Nyaya */}
            <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-8">
              <span className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full mb-4">
                {/* Justice/Logic Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m0 0l-3-3m3 3l3-3" /></svg>
              </span>
              <div className="text-lg font-medium text-gray-900 dark:text-white">Nyaya</div>
              <div className="text-base text-gray-500 dark:text-gray-300 mb-2">Logic & Interview Agent</div>
              <p className="text-gray-500 dark:text-gray-300 text-center">
                Conducts interviews with fairness and logical precision, upholding the principles of justice in every evaluation.
              </p>
            </div>
            {/* Maya */}
            <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-8">
              <span className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full mb-4">
                {/* Perception Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
              </span>
              <div className="text-lg font-medium text-gray-900 dark:text-white">Maya</div>
              <div className="text-base text-gray-500 dark:text-gray-300 mb-2">Experience & Onboarding Agent</div>
              <p className="text-gray-500 dark:text-gray-300 text-center">
                Smooths the onboarding journey, helping new hires see through complexity and embrace clarity in their new roles.
              </p>
            </div>
            {/* Yukti */}
            <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-8">
              <span className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full mb-4">
                {/* Strategy Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0V7m0 4l-4-4-4 4" /></svg>
              </span>
              <div className="text-lg font-medium text-gray-900 dark:text-white">Yukti</div>
              <div className="text-base text-gray-500 dark:text-gray-300 mb-2">Support & Strategy Agent</div>
              <p className="text-gray-500 dark:text-gray-300 text-center">
                Offers strategic support and clever solutions, ensuring both candidates and employers always find a way forward.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 