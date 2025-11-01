import React from 'react';
import { Shield, Calendar, Mail } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = 'October 31, 2025';
  const effectiveDate = 'October 31, 2025';
  const companyName = 'ERMITS LLC';
  const contactEmail = 'contact@ermits.com';

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <img src="/cybercertitude.png" alt="CyberCertitude" className="w-12 h-12 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="w-8 h-8 text-primary-500 dark:text-primary-400" />
                <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Privacy Policy
                </h1>
              </div>
              <div className="flex items-center space-x-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <span className="font-medium">CyberCertitude™</span>
                <span>•</span>
                <span>CMMC 2.0 Compliance</span>
                <span>•</span>
                <span>by ERMITS</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${contactEmail}`} className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                {contactEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-surface-light dark:bg-surface-dark border border-support-light dark:border-support-dark rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              1. Introduction
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              {companyName} ("we," "us," or "our") is committed to protecting your privacy. This Privacy 
              Policy explains how we collect, use, disclose, and safeguard your information when you use 
              our CyberCertitude™ platform ("Service"). Please read this Privacy Policy carefully. If you 
              do not agree with the terms of this Privacy Policy, please do not access the Service.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              2. Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.1 Personal Information
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials and authentication information</li>
              <li>Organization name and details</li>
              <li>Billing and payment information</li>
              <li>Profile information and preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.2 Usage Information
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We automatically collect information about your use of the Service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Log data (IP address, browser type, device information)</li>
              <li>Usage patterns and feature interactions</li>
              <li>Performance and error data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.3 Compliance Data
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              As a compliance platform, we process compliance-related data you input:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Assessment responses and results</li>
              <li>Policy documents and templates</li>
              <li>Evidence files and documentation</li>
              <li>Risk assessments and gap analyses</li>
              <li>Team and organizational structure information</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              3. How We Use Your Information
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Provide, maintain, and improve the Service</li>
              <li>Process transactions and manage your account</li>
              <li>Send you updates, security alerts, and support messages</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              4. Data Security
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Encryption in transit (TLS/SSL) and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security assessments and audits</li>
              <li>Employee access restrictions and training</li>
              <li>Compliance with CMMC 2.0 Level 2 security requirements</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mt-3">
              However, no method of transmission over the internet or electronic storage is 100% secure. 
              While we strive to use commercially acceptable means to protect your information, we cannot 
              guarantee absolute security.
            </p>
          </section>

          {/* Data Sharing and Disclosure */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              5. Data Sharing and Disclosure
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We do not sell your personal information. We may share your information only in the following 
              circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating the Service</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> When you have given explicit consent for us to share your information</li>
              <li><strong>Protection:</strong> To protect our rights, property, or safety, or that of our users</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              6. Your Rights and Choices
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              You have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Account Closure:</strong> Close your account at any time</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mt-3">
              To exercise these rights, please contact us at{' '}
              <a href={`mailto:${contactEmail}`} className="text-primary-500 dark:text-primary-400 hover:underline">
                {contactEmail}
              </a>.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              7. Cookies and Tracking Technologies
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We use cookies and similar tracking technologies to track activity on our Service and hold 
              certain information. You can instruct your browser to refuse all cookies or to indicate when 
              a cookie is being sent. However, if you do not accept cookies, you may not be able to use 
              some portions of our Service.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              For more detailed information, please see our Cookie Policy.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              8. Data Retention
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              We retain your personal information for as long as necessary to provide the Service and 
              fulfill the purposes described in this Privacy Policy, unless a longer retention period is 
              required or permitted by law. When you close your account, we will delete or anonymize your 
              personal information, except where we are required to retain it for legal or legitimate 
              business purposes.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              9. Children's Privacy
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              The Service is not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children. If you are a parent or guardian and believe your child 
              has provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last Updated" date. You are 
              advised to review this Privacy Policy periodically for any changes. Changes to this Privacy 
              Policy are effective when posted on this page.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              11. Contact Us
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href={`mailto:${contactEmail}`} className="text-primary-500 dark:text-primary-400 hover:underline">
                {contactEmail}
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

