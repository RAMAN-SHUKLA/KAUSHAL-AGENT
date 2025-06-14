import React from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseIcon,
  Users,
  BarChart,
  ClipboardCheckIcon,
  RocketIcon,
  BrainCircuitIcon,
  GraduationCapIcon,
  HeartHandshakeIcon,
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: BriefcaseIcon,
      title: 'Job Matching',
      description: 'Our AI-powered system matches candidates with the perfect job opportunities based on skills, experience, and preferences.',
    },
    {
      icon: Users,
      title: 'Talent Pool Management',
      description: 'Efficiently manage and organize your candidate database with our advanced talent pool management system.',
    },
    {
      icon: BarChart,
      title: 'Analytics & Reporting',
      description: 'Get detailed insights and analytics about your recruitment process, candidate pipeline, and hiring success rates.',
    },
    {
      icon: ClipboardCheckIcon,
      title: 'Automated Screening',
      description: 'Save time with our automated candidate screening process that evaluates applications based on your requirements.',
    },
    {
      icon: RocketIcon,
      title: 'Career Development',
      description: 'Access resources and tools to help advance your career, including skill assessments and learning opportunities.',
    },
    {
      icon: BrainCircuitIcon,
      title: 'AI-Powered Assessments',
      description: 'Evaluate candidates effectively with our comprehensive AI-powered assessment tools and coding challenges.',
    },
    {
      icon: GraduationCapIcon,
      title: 'Learning & Development',
      description: 'Access training materials and resources to help candidates improve their skills and stay competitive.',
    },
    {
      icon: HeartHandshakeIcon,
      title: 'Interview Preparation',
      description: 'Get comprehensive interview preparation support, including mock interviews and feedback sessions.',
    },
  ];

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      features: [
        'Basic job posting',
        'Limited candidate search',
        'Standard support',
        'Basic analytics',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$49/month',
      features: [
        'Unlimited job postings',
        'Advanced candidate search',
        'Priority support',
        'Detailed analytics',
        'Custom assessments',
        'Team collaboration',
      ],
      cta: 'Start Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'All Professional features',
        'Custom integration',
        'Dedicated support',
        'Advanced security',
        'Custom branding',
        'API access',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Our Services</span>
              <span className="block text-yellow-600 mt-2">Empowering Your Hiring Journey</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500 dark:text-gray-300">
              Discover our comprehensive suite of recruitment and hiring solutions designed to streamline your hiring process.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center">
                  <service.icon className="h-12 w-12 text-yellow-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white text-center">
                  {service.title}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-300 text-center">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Flexible Pricing Plans
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
              Choose the plan that best fits your needs
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg shadow-lg overflow-hidden ${
                  plan.popular
                    ? 'ring-2 ring-yellow-600 transform scale-105'
                    : 'transform hover:scale-105'
                } transition-transform duration-300 bg-white dark:bg-gray-700`}
              >
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
                    {plan.name}
                  </h3>
                  <div className="mt-4 text-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center text-gray-500 dark:text-gray-300"
                      >
                        <svg
                          className="h-5 w-5 text-yellow-600 mr-2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      to="/signup"
                      className={`block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                        plan.popular
                          ? 'text-white bg-yellow-600 hover:bg-yellow-700'
                          : 'text-yellow-600 bg-white border-yellow-600 hover:bg-yellow-50 dark:bg-gray-700 dark:hover:bg-gray-600'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-yellow-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Transform Your Hiring Process?
            </h2>
            <p className="mt-4 text-xl text-yellow-100">
              Join thousands of companies already using our platform
            </p>
            <div className="mt-8">
              <Link
                to="/signup"
                className="inline-block bg-white py-3 px-6 rounded-md text-yellow-600 font-medium hover:bg-yellow-50"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 