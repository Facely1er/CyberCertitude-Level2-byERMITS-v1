import React from 'react';
import { Cookie, Calendar, Mail } from 'lucide-react';

export const CookiePolicyPage: React.FC = () => {
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
                <Cookie className="w-8 h-8 text-primary-500 dark:text-primary-400" />
                <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  COOKIE POLICY
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
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              This Cookie Policy explains how {companyName} ("ERMITS," "we," "our," or "us") uses cookies and similar technologies when you use our Services. This policy should be read in conjunction with our Privacy Policy.
            </p>
          </section>

          {/* What Are Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              1. What Are Cookies?
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              1.1 Definition
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Cookies are small text files stored on your device (computer, tablet, smartphone) when you visit websites or use applications. Cookies enable websites to remember your actions and preferences over time.
            </p>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              1.2 Similar Technologies
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              This policy also covers similar technologies including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Local Storage:</strong> Browser-based storage (localStorage, IndexedDB)</li>
              <li><strong>Session Storage:</strong> Temporary storage cleared when browser closes</li>
              <li><strong>Web Beacons (Pixels):</strong> Small graphics that track page views</li>
              <li><strong>SDKs:</strong> Software development kits for mobile applications</li>
              <li><strong>Fingerprinting:</strong> Device and browser characteristic collection</li>
            </ul>
          </section>

          {/* How We Use Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              2. How We Use Cookies
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              2.1 Cookie Categories
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We use the following categories of cookies:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Essential Cookies (Always Active)
                </h4>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  Required for basic service functionality:
                </p>
                <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark ml-4">
                  <li>Authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Load balancing and performance</li>
                  <li>User preference storage (language, theme)</li>
                </ul>
              </div>

              <div className="border-l-4 border-secondary-400 pl-4">
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Performance Cookies (Optional)
                </h4>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  Help us improve service performance:
                </p>
                <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark ml-4">
                  <li>Page load time measurement</li>
                  <li>Error tracking and debugging (Sentry)</li>
                  <li>Feature usage analytics</li>
                  <li>Service optimization</li>
                </ul>
              </div>

              <div className="border-l-4 border-accent-500 pl-4">
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Analytics Cookies (Optional)
                </h4>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  Help us understand how Services are used:
                </p>
                <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark ml-4">
                  <li>User behavior patterns (PostHog with differential privacy)</li>
                  <li>Popular features and pages</li>
                  <li>User journey analysis</li>
                  <li>Conversion tracking</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-400 pl-4">
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Functional Cookies (Optional)
                </h4>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  Enable enhanced functionality:
                </p>
                <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark ml-4">
                  <li>Remember settings and preferences</li>
                  <li>Personalize user experience</li>
                  <li>Enable integrations with third-party services</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Specific Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              3. Specific Cookies We Use
            </h2>
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-support-light dark:border-support-dark rounded-lg">
                <thead className="bg-primary-50 dark:bg-primary-900/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Cookie Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Provider</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-support-light dark:divide-support-dark">
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">sb-access-token</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Supabase</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Authentication</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Essential</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">1 hour</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">sb-refresh-token</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Supabase</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Session renewal</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Essential</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">30 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">theme</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">ERMITS</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">UI theme preference (light/dark)</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Functional</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">language</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">ERMITS</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Language preference</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Functional</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">consent</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">ERMITS</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Cookie consent preferences</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Essential</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">phc_***</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">PostHog</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Anonymous analytics</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Analytics</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">sentry-session</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Sentry</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Error tracking session</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Performance</td>
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              <strong>Note:</strong> Cookie names and specifics may change. This table represents typical cookies; actual implementation may vary by product.
            </p>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              4. Third-Party Cookies
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              4.1 Third-Party Service Providers
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We use third-party services that may set cookies:
            </p>

            <div className="space-y-4 mb-4">
              <div className="border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Supabase (Authentication & Database)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                  <li><strong>Purpose:</strong> User authentication and session management</li>
                  <li><strong>Privacy:</strong> Essential for service functionality</li>
                  <li><strong>Control:</strong> Required for service use; cannot be disabled</li>
                  <li><strong>More info:</strong> <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-500 dark:text-primary-400 hover:underline">https://supabase.com/privacy</a></li>
                </ul>
              </div>

              <div className="border-l-4 border-secondary-400 pl-4">
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Sentry (Error Tracking)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                  <li><strong>Purpose:</strong> Monitor application errors and performance</li>
                  <li><strong>Privacy:</strong> Automatically scrubs PII from error reports</li>
                  <li><strong>Control:</strong> Can be disabled in privacy settings</li>
                  <li><strong>More info:</strong> <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary-500 dark:text-primary-400 hover:underline">https://sentry.io/privacy/</a></li>
                </ul>
              </div>

              <div className="border-l-4 border-accent-500 pl-4">
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  PostHog (Analytics)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                  <li><strong>Purpose:</strong> Anonymous usage analytics with differential privacy</li>
                  <li><strong>Privacy:</strong> Cannot identify individual users</li>
                  <li><strong>Control:</strong> Can be disabled in privacy settings (opt-out)</li>
                  <li><strong>More info:</strong> <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-500 dark:text-primary-400 hover:underline">https://posthog.com/privacy</a></li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-400 pl-4">
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Stripe (Payment Processing)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                  <li><strong>Purpose:</strong> Payment processing and fraud prevention</li>
                  <li><strong>Privacy:</strong> Handles payment information securely</li>
                  <li><strong>Control:</strong> Required for payment functionality</li>
                  <li><strong>More info:</strong> <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-500 dark:text-primary-400 hover:underline">https://stripe.com/privacy</a></li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-300 pl-4">
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Vercel (Hosting & CDN)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                  <li><strong>Purpose:</strong> Content delivery and performance optimization</li>
                  <li><strong>Privacy:</strong> Standard web server logs</li>
                  <li><strong>Control:</strong> Required for service delivery</li>
                  <li><strong>More info:</strong> <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary-500 dark:text-primary-400 hover:underline">https://vercel.com/legal/privacy-policy</a></li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              4.2 Third-Party Privacy
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              ERMITS is not responsible for third-party cookie practices. We encourage you to review third-party privacy policies. We contractually require third parties to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Use data only for specified purposes</li>
              <li>Comply with applicable privacy laws</li>
              <li>Implement appropriate security measures</li>
              <li>Respect user privacy choices</li>
            </ul>
          </section>

          {/* Cookies and Privacy-First Architecture */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              5. Cookies and Privacy-First Architecture
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              5.1 Minimal Cookie Use
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Due to Privacy-First Architecture:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>No tracking cookies</strong> for advertising or marketing</li>
              <li><strong>No cross-site tracking</strong> or profiling</li>
              <li><strong>Minimal essential cookies</strong> only for functionality</li>
              <li><strong>Local processing</strong> reduces need for server-side cookies</li>
              <li><strong>Pseudonymized analytics</strong> cannot identify individual users</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              5.2 Data Minimization
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Cookies are designed to collect minimum data necessary:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>No PII in cookies</strong> (names, emails, addresses not stored in cookies)</li>
              <li><strong>Session tokens only</strong> for authentication</li>
              <li><strong>Hashed identifiers</strong> for analytics (cannot be reverse-engineered)</li>
              <li><strong>No sensitive data</strong> in cookies (passwords, financial info, CUI/FCI)</li>
            </ul>
          </section>

          {/* Your Cookie Choices */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              6. Your Cookie Choices
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              6.1 Cookie Consent
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              When you first visit ERMITS Services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Cookie Banner:</strong> You'll see a cookie consent banner</li>
              <li><strong>Granular Control:</strong> Choose which cookie categories to accept</li>
              <li><strong>Default Settings:</strong> Only essential cookies enabled by default</li>
              <li><strong>Change Anytime:</strong> Update preferences in Account Settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              6.2 Managing Cookie Preferences
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              <strong>Within ERMITS Services:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Navigate to Account Settings → Privacy → Cookie Preferences</li>
              <li>Toggle categories on/off (except essential cookies)</li>
              <li>Save preferences (stored in essential consent cookie)</li>
            </ul>

            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              <strong>Browser Controls:</strong> Most browsers allow cookie management:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Block all cookies:</strong> May prevent service functionality</li>
              <li><strong>Block third-party cookies:</strong> Reduces tracking</li>
              <li><strong>Delete cookies:</strong> Clear existing cookies</li>
              <li><strong>Incognito/Private mode:</strong> Cookies deleted when browser closes</li>
            </ul>

            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Browser-Specific Instructions:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data</li>
              <li><strong>Edge:</strong> Settings → Privacy, Search, and Services → Cookies</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              6.3 Opt-Out Tools
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Analytics Opt-Out:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Disable analytics cookies in Account Settings</li>
              <li>Use browser Do Not Track (DNT) signal (we honor DNT)</li>
              <li>PostHog opt-out: <a href="https://posthog.com/opt-out" target="_blank" rel="noopener noreferrer" className="text-primary-500 dark:text-primary-400 hover:underline">https://posthog.com/opt-out</a></li>
            </ul>

            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Error Tracking Opt-Out:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Disable performance cookies in Account Settings</li>
              <li>Sentry respects privacy settings</li>
            </ul>
          </section>

          {/* Do Not Track */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              7. Do Not Track (DNT)
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              7.1 DNT Support
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              ERMITS respects browser Do Not Track signals:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>DNT Enabled:</strong> We disable optional analytics and performance cookies</li>
              <li><strong>Essential Cookies Only:</strong> Authentication and security cookies remain active</li>
              <li><strong>No Tracking:</strong> No behavioral tracking when DNT is enabled</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              7.2 Enabling DNT
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              To enable Do Not Track in your browser:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Chrome:</strong> Not supported (use cookie controls instead)</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Send websites a "Do Not Track" signal</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Website Tracking → Prevent cross-site tracking</li>
              <li><strong>Edge:</strong> Settings → Privacy, Search, and Services → Send "Do Not Track" requests</li>
            </ul>
          </section>

          {/* Mobile Applications */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              8. Mobile Applications
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              For ERMITS mobile applications (if applicable):
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Mobile SDKs:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Similar functionality to cookies</li>
              <li>Device identifiers may be collected</li>
              <li>Opt-out available in app settings</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Mobile Privacy Controls:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>iOS:</strong> Settings → Privacy → Tracking → Allow Apps to Request to Track (disable)</li>
              <li><strong>Android:</strong> Settings → Privacy → Ads → Opt out of Ads Personalization</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              <strong>Note:</strong> ERMITS current products are web-based. Mobile-specific policies will be added if mobile apps are released.
            </p>
          </section>

          {/* Cookies and International Privacy Laws */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              9. Cookies and International Privacy Laws
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              9.1 GDPR Compliance (EU/UK/Swiss)
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              For users in the European Economic Area, United Kingdom, or Switzerland:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Consent Required:</strong> We obtain consent before setting non-essential cookies</li>
              <li><strong>Granular Control:</strong> You can accept/reject specific cookie categories</li>
              <li><strong>Easy Withdrawal:</strong> Withdraw consent anytime in Account Settings</li>
              <li><strong>Pre-Checked Boxes Prohibited:</strong> Cookie preferences start with only essential cookies enabled</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              9.2 CCPA Compliance (California)
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              For California residents:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>No Sale of Data:</strong> We do not sell personal information collected via cookies</li>
              <li><strong>Opt-Out Rights:</strong> You can disable optional cookies anytime</li>
              <li><strong>Disclosure:</strong> This policy discloses all cookies used</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              9.3 Other Jurisdictions
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We comply with cookie laws in all jurisdictions where we operate, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Canada's PIPEDA</li>
              <li>Brazil's LGPD</li>
              <li>Australia's Privacy Act</li>
              <li>Other applicable data protection laws</li>
            </ul>
          </section>

          {/* Cookies and Security */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              10. Cookies and Security
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              10.1 Secure Cookie Practices
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              ERMITS implements secure cookie handling:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Secure Flag:</strong> Cookies transmitted only over HTTPS</li>
              <li><strong>HttpOnly Flag:</strong> Cookies inaccessible to JavaScript (prevents XSS attacks)</li>
              <li><strong>SameSite Attribute:</strong> Cookies sent only to same-site requests (prevents CSRF)</li>
              <li><strong>Encrypted Values:</strong> Sensitive cookie values are encrypted</li>
              <li><strong>Short Expiration:</strong> Session cookies expire quickly</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              10.2 Cookie Security Risks
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              Be aware of cookie-related security risks:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Session Hijacking:</strong> Attackers stealing session cookies</li>
              <li><strong>XSS Attacks:</strong> Malicious scripts accessing cookies</li>
              <li><strong>CSRF Attacks:</strong> Unauthorized actions using your cookies</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Protect Yourself:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Use strong, unique passwords</li>
              <li>Enable multi-factor authentication</li>
              <li>Log out when finished (especially on shared devices)</li>
              <li>Clear cookies on shared/public computers</li>
              <li>Keep browser and OS updated</li>
              <li>Use antivirus and security software</li>
            </ul>
          </section>

          {/* Local Storage and IndexedDB */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              11. Local Storage and IndexedDB
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              11.1 Privacy-First Local Storage
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              ERMITS products extensively use browser local storage (localStorage, IndexedDB) for Privacy-First Architecture:
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Purpose:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>Store assessment data locally (never transmitted to servers)</li>
              <li>Enable offline functionality</li>
              <li>Reduce server data storage</li>
              <li>Provide faster performance</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Privacy Benefits:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Data stays local:</strong> Your data remains on your device</li>
              <li><strong>No server transmission:</strong> ERMITS doesn't access local storage data</li>
              <li><strong>User control:</strong> You can clear local storage anytime</li>
              <li><strong>Encryption option:</strong> Sensitive data can be encrypted locally</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              11.2 Managing Local Storage
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Clear Local Storage:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li><strong>Within Services:</strong> Account Settings → Data → Clear Local Data</li>
              <li><strong>Browser Settings:</strong> Developer Tools → Application → Storage → Clear</li>
              <li><strong>Warning:</strong> Clearing local storage deletes locally-stored assessments and data</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Backup Local Data:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Export data before clearing: Account Settings → Export Data</li>
              <li>Download JSON/CSV backups</li>
              <li>Store backups securely</li>
            </ul>
          </section>

          {/* Updates to This Cookie Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              12. Updates to This Cookie Policy
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              12.1 Policy Changes
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We may update this Cookie Policy to reflect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>New cookies or technologies</li>
              <li>Changes in legal requirements</li>
              <li>Service updates or new features</li>
              <li>User feedback</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              12.2 Notification
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Material Changes:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-4">
              <li>30 days' advance notice via email</li>
              <li>Updated cookie consent banner on first visit</li>
              <li>Opportunity to review and adjust preferences</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">
              <strong>Non-Material Changes:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>Update "Last Updated" date</li>
              <li>Effective immediately upon posting</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              13. Contact Information
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              For questions, concerns, or notices regarding this Cookie Policy:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Cookie Policy Questions:</strong> {contactEmail} (Subject: "Cookie Policy Inquiry")</li>
              <li><strong>Cookie Preferences:</strong> Account Settings → Privacy → Cookie Preferences</li>
              <li><strong>Data Protection Officer (EU/UK/Swiss):</strong> {contactEmail} (Subject: "Cookie GDPR Inquiry")</li>
              <li><strong>Technical Support:</strong> {contactEmail}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
