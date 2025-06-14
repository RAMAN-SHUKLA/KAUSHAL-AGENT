import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    job_posting_settings: {
      require_company_verification: false,
      max_active_jobs: 10,
      allowed_job_types: ['full-time', 'part-time', 'contract', 'internship']
    },
    application_settings: {
      allow_multiple_applications: false,
      require_resume: true,
      require_cover_letter: false
    },
    notification_settings: {
      email_notifications: true,
      application_updates: true,
      job_alerts: true
    }
  });

  const handleChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleJobTypeChange = (type) => {
    setSettings(prev => ({
      ...prev,
      job_posting_settings: {
        ...prev.job_posting_settings,
        allowed_job_types: prev.job_posting_settings.allowed_job_types.includes(type)
          ? prev.job_posting_settings.allowed_job_types.filter(t => t !== type)
          : [...prev.job_posting_settings.allowed_job_types, type]
      }
    }));
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            Admin Settings
          </h2>
        </div>

        <div className="grid gap-6">
          {/* Job Posting Settings */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Job Posting Settings</h3>
            <div className="grid gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.job_posting_settings.require_company_verification}
                  onChange={(e) => handleChange('job_posting_settings', 'require_company_verification', e.target.checked)}
                  className="rounded border-gray-600 text-accent-yellow focus:ring-accent-yellow"
                />
                Require Company Verification
              </label>

              <div>
                <label className="block mb-2">Maximum Active Jobs</label>
                <input
                  type="number"
                  value={settings.job_posting_settings.max_active_jobs}
                  onChange={(e) => handleChange('job_posting_settings', 'max_active_jobs', parseInt(e.target.value))}
                  className="w-full bg-gray-700 border-gray-600 rounded-lg p-2 focus:ring-accent-yellow focus:border-accent-yellow"
                />
              </div>

              <div>
                <label className="block mb-2">Allowed Job Types</label>
                <div className="grid grid-cols-2 gap-2">
                  {['full-time', 'part-time', 'contract', 'internship'].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.job_posting_settings.allowed_job_types.includes(type)}
                        onChange={() => handleJobTypeChange(type)}
                        className="rounded border-gray-600 text-accent-yellow focus:ring-accent-yellow"
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Application Settings */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Application Settings</h3>
            <div className="grid gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.application_settings.allow_multiple_applications}
                  onChange={(e) => handleChange('application_settings', 'allow_multiple_applications', e.target.checked)}
                  className="rounded border-gray-600 text-accent-yellow focus:ring-accent-yellow"
                />
                Allow Multiple Applications
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.application_settings.require_resume}
                  onChange={(e) => handleChange('application_settings', 'require_resume', e.target.checked)}
                  className="rounded border-gray-600 text-accent-yellow focus:ring-accent-yellow"
                />
                Require Resume
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.application_settings.require_cover_letter}
                  onChange={(e) => handleChange('application_settings', 'require_cover_letter', e.target.checked)}
                  className="rounded border-gray-600 text-accent-yellow focus:ring-accent-yellow"
                />
                Require Cover Letter
              </label>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Notification Settings</h3>
            <div className="grid gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.notification_settings.email_notifications}
                  onChange={(e) => handleChange('notification_settings', 'email_notifications', e.target.checked)}
                  className="rounded border-gray-600 text-accent-yellow focus:ring-accent-yellow"
                />
                Email Notifications
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.notification_settings.application_updates}
                  onChange={(e) => handleChange('notification_settings', 'application_updates', e.target.checked)}
                  className="rounded border-gray-600 text-accent-yellow focus:ring-accent-yellow"
                />
                Application Updates
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.notification_settings.job_alerts}
                  onChange={(e) => handleChange('notification_settings', 'job_alerts', e.target.checked)}
                  className="rounded border-gray-600 text-accent-yellow focus:ring-accent-yellow"
                />
                Job Alerts
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;