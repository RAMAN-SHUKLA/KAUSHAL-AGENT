import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Award,
  Target,
  CheckCircle,
  TrendingUp,
  Star,
  UserCheck,
  GraduationCap,
  Building,
  Handshake,
  Shield,
  Mail,
} from 'lucide-react';

// Custom SVG Icons for Agents
const VedantIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-5-9-5-9 5 9 5zm0-10V4m0 0L3 9m9-5l9 5" />
  </svg>
);

const NyayaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m0 0l-3-3m3 3l3-3" />
  </svg>
);

const MayaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const YuktiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0V7m0 4l-4-4-4 4" />
  </svg>
);

const LandingPage = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Skill Assessment",
      description: "Comprehensive evaluation of your professional capabilities",
    },
    {
      icon: Building,
      title: "Top Companies",
      description: "Connect with India's leading organizations",
    },
    {
      icon: Handshake,
      title: "Perfect Match",
      description: "AI-powered matching for ideal job placements",
    },
    {
      icon: Mail,
      title: "Smart Updates",
      description: "Real-time notifications for your dream opportunities",
    }
  ];

  const stats = [
    { number: "10,000+", label: "Skilled Professionals" },
    { number: "500+", label: "Partner Companies" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Expert Support" },
  ];

  const whyChooseUs = [
    {
      icon: Target,
      title: "Skill-First Approach",
      description: "Our AI matches your skills with the perfect opportunities, focusing on what you can do."
    },
    {
      icon: CheckCircle,
      title: "Verified Employers",
      description: "All companies are thoroughly vetted for authenticity and quality."
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Access learning resources and mentorship programs to advance your career."
    },
    {
      icon: Star,
      title: "Indian Values",
      description: "Built on principles of trust, respect, and excellence for the Indian professional."
    },
  ];

  const agents = [
    {
      name: "Vedant",
      role: "Wisdom & Screening Agent",
      description: "Guides candidates and employers with insightful screening, ensuring every match is rooted in wisdom.",
      icon: VedantIcon
    },
    {
      name: "Nyaya",
      role: "Logic & Interview Agent",
      description: "Conducts interviews with fairness and logical precision, upholding principles of justice.",
      icon: NyayaIcon
    },
    {
      name: "Maya",
      role: "Onboarding Agent",
      description: "Smooths the onboarding journey, helping new hires see through complexity and embrace clarity.",
      icon: MayaIcon
    },
    {
      name: "Yukti",
      role: "Support & Strategy Agent",
      description: "Offers strategic support and clever solutions, ensuring you always find a way forward.",
      icon: YuktiIcon
    }
  ];

  const adminFeatures = [
    {
      icon: Shield,
      title: "Admin Dashboard",
      description: "Manage job postings, applications, and users with powerful tools.",
      link: "/admin"
    }
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-sm z-50">
        <div className="max-w-16xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-yellow-600">KAUSHAL</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-yellow-600 dark:hover:text-yellow-500 px-3 py-2 text-sm font-medium">Home</Link>
              <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-yellow-600 dark:hover:text-yellow-500 px-3 py-2 text-sm font-medium">About</Link>
              <Link to="/services" className="text-gray-700 dark:text-gray-200 hover:text-yellow-600 dark:hover:text-yellow-500 px-3 py-2 text-sm font-medium">Services</Link>
              <Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-yellow-600 dark:hover:text-yellow-500 px-3 py-2 text-sm font-medium">Contact</Link>
            </div>
          </div>
        </div>
        {/* Yellow bar below navigation */}
        <div className="h-2 bg-yellow-500 w-full"></div>
      </nav>

      {/* Add padding to account for fixed header */}
      <div className="pt-0">
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block text-7xl font-bold text-yellow-600 mb-4">KAUSHAL</span>
            <span className="block text-2xl mt-3 font-serif text-gray-700 dark:text-gray-300 tracking-wide font-bold">
              Connecting Skills with Success
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            India's premier hiring platform where your skills are the key to unlocking opportunities with top companies.
          </p>

          {/* Professional -> Hired -> Success */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-100/50">
                <Briefcase className="w-12 h-12 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Professional</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Showcase your skills</p>
            </div>
            <ArrowRight className="w-10 h-10 text-gray-400 dark:text-gray-500 hidden sm:block" />
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-100/50">
                <UserCheck className="w-12 h-12 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Hired</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get matched with companies</p>
            </div>
            <ArrowRight className="w-10 h-10 text-gray-400 dark:text-gray-500 hidden sm:block" />
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-100/50">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Success</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Achieve your career goals</p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 md:py-4 md:text-lg md:px-10"
            >
              Get Started Now
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>
      
      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">Our Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              A better way to find work
            </p>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-yellow-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-4xl font-extrabold text-white">{stat.number}</p>
                <p className="mt-2 text-lg font-medium text-yellow-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">Why Choose Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Built for the Indian Professional
            </p>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <item.icon className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-base text-gray-500 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">Our AI Agents</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Powered by Ancient Wisdom, Modern Tech
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {agents.map((agent, index) => (
              <div key={index} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md flex flex-col items-center">
                <agent.icon />
                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{agent.name}</h3>
                <div className="text-base text-gray-500 dark:text-gray-300 mb-2">{agent.role}</div>
                <p className="text-gray-500 dark:text-gray-300 text-center">
                  {agent.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Section */}
      <div className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">For Employers</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Powerful Admin Tools
            </p>
          </div>

          <div className="flex justify-center">
            {adminFeatures.map((feature, index) => (
              <button
                key={index}
                className="relative group p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 max-w-md w-full"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mb-4">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {feature.title}
                  </p>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-4 text-yellow-600 group-hover:text-yellow-700 text-center">
                  Access portal →
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Founder's Desk Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-xl p-8 md:p-12 flex flex-col items-center text-center">
                <div className="mb-6">
                    <img 
                      className="h-48 w-48 rounded-full object-cover shadow-lg border-4 border-yellow-400" 
                      src="founder.jpg" 
                      alt="RAMAN SHUKLA - Founder" 
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">From the Founder's Desk</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                      "We started Kaushal with a simple mission to empower every professional in India to build a career they love. Your success is our success."
                    </p>
                    <p className="mt-6 font-semibold text-xl text-gray-900 dark:text-white">Raman Shukla</p>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Founder & CEO, Kaushal</p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-yellow-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to Start Your Journey?</span>
          </h2>
          <p className="mt-4 text-xl text-yellow-100">
            Join thousands of professionals who've found their dream jobs.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <button
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-yellow-600 bg-white hover:bg-yellow-50"
              >
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default LandingPage;