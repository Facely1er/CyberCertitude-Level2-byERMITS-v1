import React from 'react';
import { AlertTriangle, Calendar, Mail } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
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
                <AlertTriangle className="w-8 h-8 text-warning-500 dark:text-warning-400" />
                <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Disclaimer
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
          {/* Service Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              1. Service Disclaimer
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              THE SERVICES PROVIDED BY {companyName.toUpperCase()} ("ERMITS," "WE," "OUR," OR "US") ARE 
              PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR 
              IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
              PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              We do not guarantee that the Services will be uninterrupted, secure, or error-free, or that 
              any defects will be corrected. The Services are tools to assist with compliance efforts but 
              do not guarantee compliance or certification.
            </p>
          </section>

          {/* Compliance Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              2. Compliance Disclaimer
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              ERMITS products are tools to assist with security and compliance efforts but:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Do not guarantee compliance with any regulatory framework</li>
              <li>Do not constitute legal, compliance, or professional consulting advice</li>
              <li>Require users to interpret results in the context of their specific obligations</li>
              <li>Do not replace qualified security assessments or professional audits</li>
              <li>Are not certification authorities (not C3PAO, not CISA-endorsed)</li>
            </ul>
          </section>

          {/* Results Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              3. Results Disclaimer
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Assessment results, risk scores, and recommendations are:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>For informational and educational purposes only</li>
              <li>Based on user-provided inputs and third-party data sources</li>
              <li>Subject to interpretation and professional judgment</li>
              <li>Not guaranteed to identify all vulnerabilities or risks</li>
              <li>Not a substitute for comprehensive security assessments</li>
            </ul>
          </section>

          {/* Third-Party Data Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              4. Third-Party Data Disclaimer
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              The Services may integrate with or reference third-party services and data sources, including 
              but not limited to OSV.dev, NIST NVD, CISA advisories, and other vulnerability databases. 
              ERMITS makes no warranties regarding the accuracy, completeness, or reliability of third-party 
              data. Users are responsible for verifying third-party information.
            </p>
          </section>

          {/* Privacy-First Architecture Limitations */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              5. Privacy-First Architecture Limitations
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Due to Privacy-First Architecture:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>ERMITS cannot verify the accuracy of locally-processed User Data</li>
              <li>Users are responsible for data integrity and backup</li>
              <li>ERMITS has limited ability to provide data recovery assistance</li>
              <li>Encryption key loss results in permanent data inaccessibility</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              6. Limitation of Liability
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, {companyName.toUpperCase()} SHALL NOT BE LIABLE FOR 
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF 
              PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, 
              GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICES.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              This limitation applies regardless of the legal theory (contract, tort, negligence, strict 
              liability, or otherwise) and whether or not ERMITS was advised of the possibility of such 
              damages.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              7. Contact Information
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              If you have any questions about this Disclaimer, please contact us at{' '}
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

