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
                  MASTER PRIVACY POLICY
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
              <span>Effective Date: {effectiveDate}</span>
            </div>
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
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              {companyName} ("ERMITS," "we," "our," or "us") is committed to protecting your privacy through a Privacy-First Architecture that ensures you maintain control over your data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our Services.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              By using our Services, you consent to the data practices described in this policy. If you do not agree with this Privacy Policy, please do not use our Services.
            </p>
          </section>

          {/* Privacy-First Architecture Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              1. Privacy-First Architecture Overview
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              1.1 Core Principles
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              ERMITS implements Privacy-First Architecture built on five fundamental principles:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li className="mb-3">
                <strong>Client-Side Processing:</strong> All core computational functions (security assessments, SBOM analysis, risk scoring, compliance evaluations) are performed locally within your browser or self-managed environment whenever technically feasible. Your data remains under your control throughout the analysis process.
              </li>
              <li className="mb-3">
                <strong>Data Sovereignty Options:</strong> You choose where your data resides:
                <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                  <li><strong>Local-Only Mode:</strong> All data stored exclusively in your browser or desktop application</li>
                  <li><strong>Self-Managed Cloud:</strong> Deploy to your own cloud infrastructure with full control</li>
                  <li><strong>ERMITS-Managed Cloud:</strong> Optional encrypted cloud synchronization with zero-knowledge architecture</li>
                  <li><strong>Hybrid Deployment:</strong> Local processing with selective encrypted cloud backup</li>
                </ul>
              </li>
              <li className="mb-3">
                <strong>Zero-Knowledge Encryption:</strong> When using ERMITS-managed cloud features with encryption enabled:
                <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                  <li>Data is encrypted client-side using AES-256-GCM before transmission</li>
                  <li>Encryption keys are derived from your credentials and never transmitted to ERMITS</li>
                  <li>ERMITS cannot decrypt, access, or view your encrypted data</li>
                  <li>You are solely responsible for maintaining access to encryption keys</li>
                </ul>
              </li>
              <li className="mb-3">
                <strong>Data Minimization:</strong> We collect only the minimum data necessary for service functionality:
                <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                  <li><strong>Never Collected:</strong> Raw SBOM files, assessment content, CUI, FCI, vulnerability findings, compliance data, or proprietary business information</li>
                  <li><strong>Pseudonymized Telemetry:</strong> Optional, anonymous performance metrics using irreversible cryptographic hashing</li>
                  <li><strong>Account Data:</strong> Only when you create an account (name, email, company for authentication and billing)</li>
                </ul>
              </li>
              <li className="mb-3">
                <strong>Transparency and Control:</strong> You have complete control over your data:
                <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                  <li>Export all data at any time in standard formats (JSON, CSV, PDF)</li>
                  <li>Delete all data permanently with one click</li>
                  <li>Opt in or opt out of telemetry collection</li>
                  <li>Choose your deployment and storage model</li>
                  <li>Review detailed data flow documentation</li>
                </ul>
              </li>
            </ol>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-6">
              1.2 Privacy-First Implementation by Product
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Each ERMITS product implements Privacy-First Architecture as follows:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-support-light dark:border-support-dark rounded-lg">
                <thead className="bg-primary-50 dark:bg-primary-900/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Processing Model</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Data Storage Options</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Encryption</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-support-light dark:divide-support-dark">
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">TechnoSoluce SBOM Analyzer</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">100% client-side</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Local browser storage only</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Optional local encryption</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">CyberCertitude Level 1 & 2</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Client-side with optional sync</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Local, self-managed, or ERMITS cloud</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">AES-256-GCM E2EE</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">VendorSoluce</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Client-side with optional sync</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Local, self-managed, or ERMITS cloud</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">AES-256-GCM E2EE</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">CyberCorrect Portal/Platform</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Client-side with optional sync</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Local, self-managed, or ERMITS cloud</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">AES-256-GCM E2EE</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">CyberCaution Products</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Client-side with optional sync</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Local, self-managed, or ERMITS cloud</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">AES-256-GCM E2EE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              2. Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.1 Information You Provide Directly
            </h3>
            
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Account Information (Optional):</strong>
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              When you create an account or subscribe to paid features, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Company name and job title (optional)</li>
              <li>Billing information (processed by Stripe, not stored by ERMITS)</li>
              <li>Password (cryptographically hashed, never stored in plaintext)</li>
            </ul>

            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>User-Generated Content:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Support requests and communications</li>
              <li>Feedback and survey responses</li>
              <li>Customization preferences and settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.2 Information We Do NOT Collect
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              ERMITS explicitly does NOT collect, access, store, or transmit:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>SBOM Data:</strong> Software bill of materials files, component lists, dependency graphs, or package metadata</li>
              <li><strong>Assessment Content:</strong> Security assessments, compliance evaluations, risk analyses, or audit findings</li>
              <li><strong>Vulnerability Data:</strong> Vulnerability scan results, CVE findings, or remediation plans</li>
              <li><strong>Compliance Data:</strong> CMMC documentation, POAMs, SSPs, evidence portfolios, or certification materials</li>
              <li><strong>Proprietary Business Data:</strong> Trade secrets, confidential information, or business-sensitive data</li>
              <li><strong>CUI/FCI:</strong> Controlled Unclassified Information or Federal Contract Information</li>
              <li><strong>Personal Health Information (PHI):</strong> Protected health information under HIPAA</li>
              <li><strong>Financial Records:</strong> Detailed financial data or payment card information (except via Stripe)</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.3 Automatically Collected Information
            </h3>
            
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Pseudonymized Telemetry (Optional):</strong>
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              With your consent, we collect anonymous, aggregated performance data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Feature usage statistics (which tools are used, how often)</li>
              <li>Performance metrics (page load times, API response times)</li>
              <li>Error reports (crash logs, exceptions) with PII automatically scrubbed by Sentry</li>
              <li>Browser and device information (browser type, OS version, screen resolution)</li>
              <li>Session metadata (session duration, navigation paths)</li>
            </ul>

            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Telemetry Characteristics:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Irreversible Pseudonymization:</strong> User identifiers are cryptographically hashed and cannot be reverse-engineered</li>
              <li><strong>No Content Data:</strong> Telemetry never includes file contents, assessment results, or user inputs</li>
              <li><strong>Opt-Out Available:</strong> You can disable telemetry at any time in account settings</li>
              <li><strong>Differential Privacy:</strong> PostHog analytics use differential privacy techniques to prevent individual identification</li>
            </ul>

            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Technical Data:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>IP address (used for security, rate limiting, and geolocation for service delivery; not linked to user accounts)</li>
              <li>Log data (server logs for security monitoring and debugging; retained for 90 days)</li>
              <li>Cookies and similar technologies (see Cookie Policy)</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.4 Information from Third Parties
            </h3>
            
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Authentication Providers:</strong>
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              If you use OAuth (Google, Microsoft, GitHub) for authentication, we receive:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Name and email address from the provider</li>
              <li>Profile information you choose to share</li>
              <li>Provider's unique identifier for your account</li>
            </ul>

            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Payment Processor:</strong>
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Stripe provides us with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Payment success/failure status</li>
              <li>Subscription status and billing cycle</li>
              <li>Last 4 digits of payment method (for your reference)</li>
              <li>Billing address (for tax compliance)</li>
            </ul>

            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Vulnerability Databases:</strong>
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              When you use SBOM analysis or security assessment tools, your browser makes anonymous, client-side queries to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>OSV.dev (Google Open Source Vulnerabilities)</li>
              <li>NIST National Vulnerability Database</li>
              <li>CISA Known Exploited Vulnerabilities catalog</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mt-3">
              These queries are performed client-side and do not transit ERMITS servers. We do not track or log your queries to these services.
            </p>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              3. How We Use Information
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              3.1 Service Delivery and Operation
            </h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Provide, maintain, and improve the Services</li>
              <li>Process transactions and send transaction confirmations</li>
              <li>Authenticate users and maintain account security</li>
              <li>Enable features like cloud synchronization and multi-device access</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              3.2 Service Improvement and Analytics
            </h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Analyze pseudonymized usage patterns to improve features</li>
              <li>Identify and fix bugs, errors, and performance issues</li>
              <li>Develop new features and services</li>
              <li>Conduct research and analysis (using only aggregated, anonymous data)</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              3.3 Communication
            </h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Send service-related announcements and updates</li>
              <li>Respond to support requests and feedback</li>
              <li>Send security alerts and critical notifications</li>
              <li>Deliver marketing communications (with your consent; opt-out available)</li>
              <li>Conduct user surveys and request feedback</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              3.4 Security and Fraud Prevention
            </h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Detect and prevent security threats and abuse</li>
              <li>Monitor for unauthorized access or account compromise</li>
              <li>Enforce Terms of Service and Acceptable Use Policy</li>
              <li>Protect ERMITS, users, and third parties from harm</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              3.5 Legal and Compliance
            </h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Comply with legal obligations and respond to lawful requests</li>
              <li>Enforce our legal rights and agreements</li>
              <li>Protect against legal liability</li>
              <li>Conduct audits and maintain business records</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              3.6 What We Do NOT Do
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              ERMITS does NOT:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Sell or rent your personal information to third parties</li>
              <li>Use your data for advertising or marketing to others</li>
              <li>Share your User Data with third parties (except as disclosed in Section 2.4)</li>
              <li>Train AI models on your User Data</li>
              <li>Analyze your assessment results or SBOM data for any purpose</li>
              <li>Profile users for behavioral targeting</li>
            </ul>
          </section>

          {/* Information Sharing and Disclosure */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              4. Information Sharing and Disclosure
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              4.1 Service Providers (Sub-Processors)
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We share limited data with trusted third-party service providers who assist in delivering the Services:
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-support-light dark:border-support-dark rounded-lg">
                <thead className="bg-primary-50 dark:bg-primary-900/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Service Provider</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Data Shared</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-support-light dark:divide-support-dark">
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Supabase</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Database and authentication</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Email, encrypted user data (if cloud sync enabled)</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">United States</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Stripe</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Payment processing</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Email, billing information</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">United States</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Sentry</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Error monitoring</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Error logs with PII automatically scrubbed</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">United States</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">PostHog</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Analytics</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Pseudonymized usage metrics with differential privacy</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">United States / EU</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Vercel</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Hosting and CDN</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">IP address, HTTP headers (standard web traffic)</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Global CDN</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Sub-Processor Requirements:</strong>
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              All sub-processors are contractually required to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Use data only for specified purposes</li>
              <li>Implement appropriate security measures</li>
              <li>Comply with applicable privacy laws</li>
              <li>Not use data for their own purposes</li>
              <li>Delete data when no longer needed</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              4.2 Legal Requirements
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We may disclose information if required by law or in response to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Court orders, subpoenas, or legal process</li>
              <li>Government or regulatory investigations</li>
              <li>Law enforcement requests (where legally required)</li>
              <li>National security or public safety threats</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              When legally permitted, we will:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Notify affected users of legal requests</li>
              <li>Challenge overly broad or improper requests</li>
              <li>Provide only the minimum information required</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              4.3 Business Transfers
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              If ERMITS is involved in a merger, acquisition, asset sale, or bankruptcy:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>User information may be transferred as part of the business assets</li>
              <li>We will provide notice before information is transferred</li>
              <li>The successor entity will be bound by this Privacy Policy</li>
              <li>You will have the option to delete your data before transfer</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              4.4 Consent-Based Sharing
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We may share information with your explicit consent for purposes such as:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Integration with third-party tools you authorize</li>
              <li>Sharing data with your organization's administrators</li>
              <li>Public testimonials or case studies (with identifying information only if you approve)</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              4.5 Aggregated and Anonymous Data
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We may share aggregated, anonymous data that cannot identify you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Industry benchmarks and statistics</li>
              <li>Research publications and presentations</li>
              <li>Public reports on security trends</li>
              <li>Product improvement insights</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mt-3">
              This data is derived from pseudonymized telemetry and cannot be reverse-engineered to identify users or organizations.
            </p>
          </section>

          {/* Data Security Measures */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              5. Data Security Measures
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              5.1 Encryption
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Data in Transit:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>TLS 1.3 encryption for all data transmission</li>
              <li>HTTPS required for all web traffic</li>
              <li>Certificate pinning for critical connections</li>
              <li>Perfect Forward Secrecy (PFS) enabled</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Data at Rest:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>AES-256-GCM encryption for cloud-stored data</li>
              <li>Client-side encryption with user-controlled keys (zero-knowledge architecture)</li>
              <li>Encrypted database backups</li>
              <li>Secure key management practices</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Data in Use:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Local processing minimizes data exposure</li>
              <li>Memory encryption where supported by browser</li>
              <li>Secure coding practices to prevent data leakage</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              5.2 Access Controls
            </h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Multi-Factor Authentication (MFA):</strong> Available for all accounts, required for administrators</li>
              <li><strong>Role-Based Access Control (RBAC):</strong> Granular permissions based on user roles</li>
              <li><strong>Row-Level Security (RLS):</strong> Database-level isolation ensuring users can only access their own data</li>
              <li><strong>Principle of Least Privilege:</strong> Internal access limited to minimum necessary</li>
              <li><strong>Access Logging:</strong> All data access logged for audit and security monitoring</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              5.3 Infrastructure Security
            </h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Secure Cloud Hosting:</strong> Enterprise-grade infrastructure (Supabase, Vercel)</li>
              <li><strong>Network Segmentation:</strong> Isolated production, staging, and development environments</li>
              <li><strong>DDoS Protection:</strong> Distributed denial-of-service attack mitigation</li>
              <li><strong>Intrusion Detection:</strong> 24/7 monitoring for suspicious activity</li>
              <li><strong>Regular Security Audits:</strong> Penetration testing and vulnerability assessments</li>
              <li><strong>Incident Response Plan:</strong> Documented procedures for security incidents</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              5.4 Application Security
            </h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Secure Coding Practices:</strong> Following OWASP Top 10 guidelines</li>
              <li><strong>Input Validation:</strong> Comprehensive sanitization of all user inputs</li>
              <li><strong>SQL Injection Prevention:</strong> Parameterized queries and prepared statements</li>
              <li><strong>XSS Protection:</strong> Content Security Policy (CSP) and output encoding</li>
              <li><strong>CSRF Protection:</strong> Anti-CSRF tokens for state-changing operations</li>
              <li><strong>Dependency Management:</strong> Regular updates and vulnerability scanning</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              5.5 Employee and Contractor Access
            </h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Background checks for employees with data access</li>
              <li>Confidentiality agreements and security training</li>
              <li>Access granted only on need-to-know basis</li>
              <li>Regular access reviews and revocations</li>
              <li>Monitoring and logging of all employee data access</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              5.6 Security Incident Response
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              In the event of a data breach or security incident:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Detection:</strong> 24/7 monitoring and alerting systems</li>
              <li><strong>Containment:</strong> Immediate action to isolate affected systems</li>
              <li><strong>Investigation:</strong> Forensic analysis to determine scope and impact</li>
              <li><strong>Notification:</strong> Timely notification to affected users and regulators as required by law</li>
              <li><strong>Remediation:</strong> Fixes to prevent recurrence</li>
              <li><strong>Documentation:</strong> Comprehensive incident reporting and lessons learned</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              6. Data Retention
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              6.1 Active Accounts
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We retain your data for as long as your account is active or as needed to provide Services:
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-support-light dark:border-support-dark rounded-lg">
                <thead className="bg-primary-50 dark:bg-primary-900/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Data Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Retention Period</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-support-light dark:divide-support-dark">
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Account Information</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Duration of account + 30 days</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Service delivery, support</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">User-Generated Content</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">User-controlled (can delete anytime)</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Service functionality</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Encrypted Cloud Data</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">User-controlled (can delete anytime)</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Cloud synchronization</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Support Communications</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">3 years</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Customer support, quality improvement</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Pseudonymized Telemetry</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Indefinite (anonymous, cannot be deleted)</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Service improvement, analytics</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              6.2 Deleted Accounts
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              When you delete your account or request data deletion:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Immediate:</strong> Account access disabled, data marked for deletion</li>
              <li><strong>Within 30 days:</strong> User Data permanently deleted from production systems</li>
              <li><strong>Within 90 days:</strong> Backup copies permanently deleted</li>
              <li><strong>Exceptions:</strong> Data retained longer only where legally required</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              6.3 Legal and Regulatory Retention
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Certain data must be retained for legal, regulatory, or tax purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Financial Records:</strong> 7 years (IRS requirements)</li>
              <li><strong>Audit Logs:</strong> 3 years (security and compliance)</li>
              <li><strong>Legal Hold Data:</strong> Retained as required by litigation or investigation</li>
              <li><strong>Pseudonymized Analytics:</strong> Indefinite (anonymous, cannot be reverse-engineered)</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              6.4 Inactive Accounts
            </h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Free Accounts:</strong> May be deleted after 12 months of inactivity (with 30 days' notice)</li>
              <li><strong>Paid Accounts:</strong> Retained for duration of subscription plus 30 days</li>
              <li><strong>Data Export:</strong> Users notified before deletion and given opportunity to export data</li>
            </ul>
          </section>

          {/* Your Privacy Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              7. Your Privacy Rights
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              7.1 Universal Rights
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              All users have the following rights regardless of location:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete personal data</li>
              <li><strong>Right to Deletion (Right to be Forgotten):</strong> Request deletion of your personal data</li>
              <li><strong>Right to Data Portability:</strong> Export your data in machine-readable formats (JSON, CSV)</li>
              <li><strong>Right to Restriction of Processing:</strong> Request limitation of processing in certain circumstances</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              7.2 Additional Rights for EU/UK/Swiss Users (GDPR/UK GDPR/Swiss DPA)
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              If you are located in the European Economic Area, United Kingdom, or Switzerland, you have additional rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Legal Basis for Processing:</strong> Consent, contract, legitimate interests, or legal obligation</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time (does not affect prior processing)</li>
              <li><strong>Right to Lodge a Complaint:</strong> File complaint with your local data protection authority</li>
              <li><strong>Right to Automated Decision-Making:</strong> ERMITS does not engage in automated decision-making with legal or significant effects</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              <strong>Data Protection Officer:</strong> For GDPR-related inquiries, contact: {contactEmail} (Subject: "GDPR Inquiry")
            </p>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              7.3 Additional Rights for California Residents (CCPA/CPRA)
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Right to Know:</strong> Request categories and specific pieces of personal information collected</li>
              <li><strong>Right to Delete:</strong> Request deletion of personal information (subject to legal exceptions)</li>
              <li><strong>Right to Opt-Out of Sale:</strong> ERMITS does not sell personal information</li>
              <li><strong>Right to Non-Discrimination:</strong> Equal service and pricing regardless of privacy rights exercise</li>
              <li><strong>Right to Limit Use of Sensitive Personal Information:</strong> ERMITS does not use or disclose sensitive personal information for purposes other than providing Services</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              <strong>California Consumer Privacy Request:</strong> Submit requests via email: {contactEmail} (Subject: "CCPA Request")
            </p>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              7.4 Exercising Your Rights
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>How to Submit Requests:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Email:</strong> {contactEmail} (Subject: "Privacy Rights Request")</li>
              <li><strong>In-App:</strong> Account Settings → Privacy Rights</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Verification Process:</strong>
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              To protect your privacy, we must verify your identity before fulfilling requests:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Account-based verification (log in to verify identity)</li>
              <li>Email verification (confirmation link sent to registered email)</li>
              <li>Additional verification for sensitive requests (government-issued ID may be required)</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Response Timeline:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Initial Response:</strong> Within 10 business days acknowledging receipt</li>
              <li><strong>Complete Response:</strong> Within 45 days (may extend 45 days with notice for complex requests)</li>
              <li><strong>Free of Charge:</strong> First two requests per year are free; reasonable fee may apply for excessive requests</li>
            </ul>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              8. International Data Transfers
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              8.1 Data Processing Locations
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              ERMITS is based in the United States. If you access Services from outside the U.S., your data may be transferred to, stored, and processed in the United States or other countries where our service providers operate.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Primary Data Locations:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>United States:</strong> Primary data processing and storage (Supabase, Vercel, Stripe)</li>
              <li><strong>European Union:</strong> Optional data residency for EU customers (Supabase EU region)</li>
              <li><strong>Global CDN:</strong> Content delivery network nodes worldwide (Vercel)</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              8.2 Safeguards for International Transfers
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              For data transfers from the EEA, UK, or Switzerland to the United States:
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Standard Contractual Clauses (SCCs):</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>ERMITS uses European Commission-approved Standard Contractual Clauses</li>
              <li>SCCs incorporated into agreements with sub-processors</li>
              <li>Full text available in Standard Contractual Clauses addendum (Enterprise Policies)</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Additional Safeguards:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Encryption in transit and at rest</li>
              <li>Access controls and authentication</li>
              <li>Regular security assessments</li>
              <li>Incident response procedures</li>
              <li>Transparency about government access requests</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Data Residency Options:</strong>
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Enterprise customers can request:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>EU-only data storage (Supabase EU region)</li>
              <li>Self-managed infrastructure in preferred jurisdiction</li>
              <li>On-premises deployment for complete data control</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              9. Children's Privacy
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              9.1 Age Restrictions
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              The Services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>If You Are Under 18:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Do not use the Services</li>
              <li>Do not provide any information to ERMITS</li>
              <li>Have a parent or guardian contact us if you have provided information</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              9.2 Parental Rights
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              If we learn that we have collected personal information from a child under 18:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>We will delete the information as quickly as possible</li>
              <li>Parents may contact us to request deletion: {contactEmail}</li>
              <li>Parents have the right to review, delete, and refuse further collection of their child's information</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              9.3 Educational Use
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              For educational institutions using Services for students:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Institution must obtain appropriate parental consent</li>
              <li>Institution acts as agent for parents</li>
              <li>FERPA and COPPA compliance is institution's responsibility</li>
              <li>Student data is processed under institution's direction</li>
            </ul>
          </section>

          {/* Federal Contractor Privacy Considerations */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              10. Federal Contractor Privacy Considerations
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              10.1 CUI and FCI Handling
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Privacy-First Architecture Benefits:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>CUI/FCI is processed client-side and never transmitted to ERMITS</li>
              <li>Zero-knowledge encryption ensures ERMITS cannot access CUI/FCI</li>
              <li>Local storage options eliminate cloud transmission of sensitive data</li>
              <li>Users maintain complete control over CUI/FCI data</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>User Responsibilities:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Properly mark and handle CUI/FCI according to NIST SP 800-171</li>
              <li>Use encryption features and self-managed deployment options</li>
              <li>Implement appropriate access controls</li>
              <li>Maintain audit logs for CUI/FCI access</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              10.2 NIST SP 800-171 Privacy Controls
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              ERMITS Services support implementation of NIST SP 800-171 privacy controls:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>3.13.1: Monitor, control, and protect organizational communications</li>
              <li>3.13.2: Employ architectural designs, software development techniques, and systems engineering principles</li>
              <li>3.13.3: Separate user functionality from information system management functionality</li>
              <li>3.13.5: Implement subnetworks for publicly accessible system components</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>User Implementation:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Services provide tools and templates for privacy control implementation</li>
              <li>Users must configure and implement controls according to their requirements</li>
              <li>ERMITS does not implement controls on behalf of users</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              10.3 Incident Reporting
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Federal contractors must report cyber incidents involving CUI to DoD within 72 hours (DFARS 252.204-7012). Because ERMITS does not access CUI due to Privacy-First Architecture:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Users are solely responsible for incident detection and reporting</li>
              <li>ERMITS will cooperate with authorized incident investigations</li>
              <li>ERMITS maintains audit logs that may assist incident investigations</li>
            </ul>
          </section>

          {/* Updates to This Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              11. Updates to This Privacy Policy
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              11.1 Policy Updates
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We may update this Privacy Policy periodically to reflect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Changes in data practices or Services</li>
              <li>Legal or regulatory developments</li>
              <li>Technological improvements</li>
              <li>User feedback and industry best practices</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              11.2 Notification of Changes
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Material Changes:</strong>
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              For significant changes affecting your rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>30 Days' Notice:</strong> Advance notice via email and in-app notification</li>
              <li><strong>Prominent Display:</strong> Notice displayed on website and in Services</li>
              <li><strong>Opt-Out Option:</strong> Option to export data and close account before changes take effect</li>
              <li><strong>Continued Use:</strong> Continued use after effective date constitutes acceptance</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Non-Material Changes:</strong>
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              For clarifications, formatting, or minor updates:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Update "Last Updated" date at top of policy</li>
              <li>Changes effective immediately upon posting</li>
              <li>No advance notice required</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              11.3 Version History
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              Previous versions of this Privacy Policy are available upon request: {contactEmail}
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              12. Contact Information
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              For questions, concerns, or notices regarding this Privacy Policy:
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              <strong>{companyName}</strong><br />
              Email: <a href={`mailto:${contactEmail}`} className="text-primary-500 dark:text-primary-400 hover:underline">{contactEmail}</a><br />
              Website: <a href="https://www.ermits.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 dark:text-primary-400 hover:underline">www.ermits.com</a>
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              For specific inquiries:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Privacy Inquiries:</strong> {contactEmail} (Subject: "Privacy Inquiry")</li>
              <li><strong>Data Rights Requests:</strong> {contactEmail} (Subject: "Privacy Rights Request")</li>
              <li><strong>Data Protection Officer (EU/UK/Swiss):</strong> {contactEmail} (Subject: "GDPR Inquiry")</li>
              <li><strong>California Privacy Requests:</strong> {contactEmail} (Subject: "CCPA Request")</li>
              <li><strong>Security Concerns:</strong> {contactEmail} (Subject: "Security Issue")</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
