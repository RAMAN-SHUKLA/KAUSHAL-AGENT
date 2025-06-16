import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Youtube, Instagram, Linkedin, Github, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://x.com/RamanShukla630?t=ODI3PKoGU_4nyTf5jB6r5g&s=09'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: 'https://youtube.com/@techworm-63?si=d1wjOnmbT3dwrSlL'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/ramanshukla__/profilecard/?igsh=eHE0Mm5jMWZ0cnU3'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/raman-shukla-5b7299290'
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/ramanshukla'
    }
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' }
  ];

  return (
    <footer className="bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              KAUSHAL
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Connecting talented professionals with great opportunities.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:ramanshukla2005@gmail.com"
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-500"
              >
                <Mail className="h-5 w-5 mr-2" />
                ramanshukla2005@gmail.com
              </a>
              <a
                href="tel:+916307741294"
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-500"
              >
                <Phone className="h-5 w-5 mr-2" />
                +91 6307741294
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Stay Updated
            </h3>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} KAUSHAL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 