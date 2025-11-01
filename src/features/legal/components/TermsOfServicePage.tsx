import React from 'react';
import { FileText, Calendar, Mail } from 'lucide-react';

export const TermsOfServicePage: React.FC = () => {
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
                <FileText className="w-8 h-8 text-primary-500 dark:text-primary-400" />
                <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Terms of Service
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
              Welcome to CyberCertitude™, a comprehensive CMMC 2.0 Level 2 compliance platform ("Service") 
              operated by {companyName} ("we," "us," or "our"). These Terms of Service ("Terms") govern 
              your access to and use of our Service. By accessing or using CyberCertitude™, you agree to 
              be bound by these Terms and our Privacy Policy.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              2. Acceptance of Terms
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              By creating an account, accessing, or using the Service, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may 
              not use the Service.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of any material 
              changes by posting the new Terms on this page and updating the "Last Updated" date. Your 
              continued use of the Service after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              3. Service Description
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              CyberCertitude™ provides:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>CMMC 2.0 Level 2 compliance assessment and tracking tools</li>
              <li>Policy template library and document generation</li>
              <li>Evidence collection and management capabilities</li>
              <li>Risk assessment and gap analysis tools</li>
              <li>Implementation guidance and workflow support</li>
              <li>Reporting and audit preparation features</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mt-3">
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time, 
              with or without notice.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              4. User Accounts
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              To access certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              5. Acceptable Use
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Transmit any malicious code, viruses, or harmful materials</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Interfere with or disrupt the Service or servers connected to the Service</li>
              <li>Use automated systems to access the Service without our written permission</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Reproduce, duplicate, copy, sell, or exploit any portion of the Service without permission</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              6. Intellectual Property
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              The Service, including its original content, features, functionality, and design, is owned by 
              {companyName} and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              You retain ownership of any content you submit, post, or display on or through the Service 
              ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, 
              royalty-free license to use, reproduce, modify, and distribute your User Content solely for 
              the purpose of providing and improving the Service.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              You may not use our trademarks, logos, or brand features without our prior written consent.
            </p>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              7. Payment Terms
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Certain features of the Service may require payment. If you purchase a subscription or paid 
              feature:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>You agree to pay all fees as described during the purchase process</li>
              <li>All fees are non-refundable unless required by law</li>
              <li>We reserve the right to change our pricing with 30 days' notice</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You are responsible for any applicable taxes</li>
            </ul>
          </section>

          {/* Data and Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              8. Data and Privacy
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              Your use of the Service is also governed by our Privacy Policy. Please review our Privacy 
              Policy, which explains how we collect, use, and protect your information. We implement 
              industry-standard security measures to protect your data, but we cannot guarantee absolute 
              security.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              9. Disclaimer
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR 
              A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              We do not guarantee that the Service will be uninterrupted, secure, or error-free, or that 
              any defects will be corrected. The Service is a tool to assist with compliance efforts but 
              does not guarantee compliance or certification.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              10. Limitation of Liability
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, {companyName.toUpperCase()} SHALL NOT BE LIABLE FOR 
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF 
              PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, 
              GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              11. Termination
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We may terminate or suspend your account and access to the Service immediately, without prior 
              notice, for any reason, including if you breach these Terms.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              You may terminate your account at any time by contacting us. Upon termination, your right to 
              use the Service will cease immediately, but provisions of these Terms that by their nature 
              should survive termination will survive.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              12. Governing Law
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the United 
              States, without regard to its conflict of law provisions. Any disputes arising from these 
              Terms or your use of the Service shall be resolved in the appropriate courts of jurisdiction.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              13. Contact Information
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
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

