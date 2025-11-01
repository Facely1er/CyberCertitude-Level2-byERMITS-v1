import React from 'react';
import { ShieldAlert, Calendar, Mail } from 'lucide-react';

export const AcceptableUsePolicyPage: React.FC = () => {
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
                <ShieldAlert className="w-8 h-8 text-primary-500 dark:text-primary-400" />
                <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Acceptable Use Policy
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
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              This Acceptable Use Policy ("AUP") governs your use of {companyName} ("ERMITS") Services and 
              supplements the Master Terms of Service. By using the Services, you agree to comply with 
              this AUP.
            </p>
          </section>

          {/* Purpose and Scope */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              1. Purpose and Scope
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              This AUP defines prohibited activities and behavioral standards for all ERMITS users. 
              Violation of this AUP may result in immediate suspension or termination of your access to 
              the Services.
            </p>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              2. Prohibited Activities
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.1 Illegal Activities
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              You may not use the Services to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Violate any applicable laws, regulations, or ordinances</li>
              <li>Engage in, promote, or facilitate illegal activities</li>
              <li>Violate intellectual property rights, privacy rights, or other third-party rights</li>
              <li>Engage in fraud, money laundering, or financial crimes</li>
              <li>Facilitate human trafficking, child exploitation, or other serious crimes</li>
              <li>Violate export control or economic sanctions laws</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.2 Security Violations
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Attempt to gain unauthorized access to Services, user accounts, or computer systems</li>
              <li>Interfere with or disrupt Services, servers, or networks</li>
              <li>Introduce malware, viruses, worms, Trojan horses, or other harmful code</li>
              <li>Conduct vulnerability scanning, penetration testing, or security assessments without prior written authorization</li>
              <li>Circumvent or attempt to circumvent authentication mechanisms or security controls</li>
              <li>Exploit security vulnerabilities for any purpose</li>
              <li>Participate in denial-of-service (DoS) or distributed denial-of-service (DDoS) attacks</li>
              <li>Engage in password cracking, network sniffing, or packet manipulation</li>
              <li>Use automated tools to bypass rate limits or access restrictions</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.3 Data and Privacy Violations
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Collect, store, or process personal data in violation of applicable privacy laws (GDPR, CCPA, etc.)</li>
              <li>Scrape, harvest, or collect user information without authorization</li>
              <li>Use Services to process data you do not have the right to process</li>
              <li>Upload or transmit data containing personally identifiable information (PII) without appropriate safeguards</li>
              <li>Process special categories of personal data without appropriate legal basis</li>
              <li>Violate data subject rights or ignore data deletion requests</li>
              <li>Transmit unsolicited communications (spam, phishing, etc.)</li>
              <li>Engage in identity theft, impersonation, or social engineering attacks</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.4 Abusive Behavior
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Harass, threaten, intimidate, or harm others</li>
              <li>Engage in hate speech, discrimination, or incitement of violence</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Stalk or otherwise harass individuals</li>
              <li>Post or transmit sexually explicit, violent, or disturbing content (unless specifically authorized for security research purposes)</li>
              <li>Engage in cyberbullying or coordinated harassment campaigns</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.5 System Abuse
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Exceed rate limits, quotas, or resource allocations</li>
              <li>Use Services for cryptocurrency mining without authorization</li>
              <li>Consume excessive bandwidth, storage, or computational resources</li>
              <li>Interfere with other users' use of Services</li>
              <li>Attempt to reverse engineer, decompile, or disassemble Services (except as permitted by law)</li>
              <li>Create or use multiple accounts to circumvent restrictions or abuse free trials</li>
              <li>Share accounts or credentials with unauthorized users</li>
              <li>Resell, rent, or lease Services without authorization</li>
            </ul>
          </section>

          {/* Acceptable Security Research */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              3. Acceptable Security Research
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              ERMITS encourages responsible security research. If you discover a security vulnerability:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Responsibly report vulnerabilities to <a href={`mailto:${contactEmail}`} className="text-primary-500 dark:text-primary-400 hover:underline">{contactEmail}</a></li>
              <li>Do not access or modify data belonging to other users</li>
              <li>Do not perform testing that degrades service performance</li>
              <li>Do not publicly disclose vulnerabilities before ERMITS has had reasonable time to remediate</li>
              <li>Provide detailed vulnerability reports with reproduction steps</li>
              <li>Allow ERMITS reasonable time to respond (90 days recommended)</li>
            </ul>
          </section>

          {/* CUI/FCI Handling */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              4. Federal Contractor and CUI/FCI Handling
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              4.1 CUI Marking and Handling
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Users processing CUI or FCI must:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Properly mark CUI according to NIST SP 800-171 and 32 CFR Part 2002</li>
              <li>Use encryption features and self-managed deployment options</li>
              <li>Implement appropriate access controls and authentication</li>
              <li>Maintain audit logs of CUI access</li>
              <li>Report cyber incidents as required by DFARS 252.204-7012</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              4.2 Prohibited CUI Activities
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Process CUI without appropriate safeguards</li>
              <li>Share CUI with unauthorized users or countries</li>
              <li>Export CUI in violation of export control laws</li>
              <li>Fail to report cyber incidents involving CUI within required timeframes (72 hours to DoD)</li>
              <li>Store CUI on unauthorized systems or in unauthorized locations</li>
              <li>Transmit CUI over unsecured channels without encryption</li>
            </ul>
          </section>

          {/* Enforcement */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              5. Enforcement and Consequences
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Depending on violation severity, ERMITS may:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Warning:</strong> Email notification of violation, request for corrective action</li>
              <li><strong>Temporary Suspension:</strong> Immediate suspension of account access, opportunity to respond and remediate</li>
              <li><strong>Permanent Termination:</strong> Immediate and permanent account closure, no refund of fees</li>
              <li><strong>Legal Action:</strong> Pursuit of damages for harm caused, cooperation with law enforcement investigations</li>
            </ul>
          </section>

          {/* Reporting Violations */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              6. Reporting Violations
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              If you become aware of violations of this AUP, please report them:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Email:</strong> <a href={`mailto:${contactEmail}`} className="text-primary-500 dark:text-primary-400 hover:underline">{contactEmail}</a> (Subject: "AUP Violation Report")</li>
              <li>Include detailed description, evidence, affected accounts/systems</li>
              <li>Reports are treated confidentially</li>
            </ul>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              7. Updates to This Policy
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              ERMITS may update this AUP to reflect evolving security threats, legal and regulatory changes, 
              new Services or features, and industry best practices. Material changes require 30 days' advance 
              notice. Non-material changes are effective immediately upon posting. Continued use constitutes 
              acceptance.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              8. Contact Information
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              For questions about this AUP or to report violations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mt-3">
              <li><strong>AUP Violation Reports:</strong> <a href={`mailto:${contactEmail}`} className="text-primary-500 dark:text-primary-400 hover:underline">{contactEmail}</a> (Subject: "AUP Violation Report")</li>
              <li><strong>AUP Questions:</strong> <a href={`mailto:${contactEmail}`} className="text-primary-500 dark:text-primary-400 hover:underline">{contactEmail}</a> (Subject: "AUP Inquiry")</li>
              <li><strong>Appeals:</strong> <a href={`mailto:${contactEmail}`} className="text-primary-500 dark:text-primary-400 hover:underline">{contactEmail}</a> (Subject: "AUP Enforcement Appeal")</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

