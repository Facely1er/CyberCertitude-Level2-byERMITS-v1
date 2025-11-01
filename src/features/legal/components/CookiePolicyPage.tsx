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
                  Cookie Policy
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
              This Cookie Policy explains how {companyName} ("ERMITS," "we," "our," or "us") uses cookies 
              and similar technologies when you use our Services. This policy should be read in conjunction 
              with our Privacy Policy.
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
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              Cookies are small text files stored on your device (computer, tablet, smartphone) when you 
              visit websites or use applications. Cookies enable websites to remember your actions and 
              preferences over time.
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
            <div className="overflow-x-auto">
              <table className="min-w-full border border-support-light dark:border-support-dark rounded-lg">
                <thead className="bg-primary-50 dark:bg-primary-900/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">
                      Cookie Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">
                      Provider
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">
                      Purpose
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-support-light dark:border-support-dark">
                      Duration
                    </th>
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
                    <td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">UI theme preference</td>
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
                </tbody>
              </table>
            </div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-3">
              <strong>Note:</strong> Cookie names and specifics may change. This table represents typical cookies; actual implementation may vary by product.
            </p>
          </section>

          {/* Cookie Choices */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              4. Your Cookie Choices
            </h2>
            
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              4.1 Cookie Consent
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              When you first visit ERMITS Services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Cookie Banner:</strong> You'll see a cookie consent banner</li>
              <li><strong>Granular Control:</strong> Choose which cookie categories to accept</li>
              <li><strong>Default Settings:</strong> Only essential cookies enabled by default</li>
              <li><strong>Change Anytime:</strong> Update preferences in Account Settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 mt-4">
              4.2 Managing Cookie Preferences
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
              <strong>Browser Controls:</strong> Most browsers allow cookie management. You can block all cookies, block third-party cookies, delete cookies, or use incognito/private mode.
            </p>
          </section>

          {/* Privacy-First Architecture */}
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
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
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

          {/* Security */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              6. Cookies and Security
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              ERMITS implements secure cookie handling:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li><strong>Secure Flag:</strong> Cookies transmitted only over HTTPS</li>
              <li><strong>HttpOnly Flag:</strong> Cookies inaccessible to JavaScript (prevents XSS attacks)</li>
              <li><strong>SameSite Attribute:</strong> Cookies sent only to same-site requests (prevents CSRF)</li>
              <li><strong>Encrypted Values:</strong> Sensitive cookie values are encrypted</li>
              <li><strong>Short Expiration:</strong> Session cookies expire quickly</li>
            </ul>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              7. Updates to This Cookie Policy
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We may update this Cookie Policy to reflect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary-light dark:text-text-secondary-dark ml-4">
              <li>New cookies or technologies</li>
              <li>Changes in legal requirements</li>
              <li>Service updates or new features</li>
              <li>User feedback</li>
            </ul>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mt-3">
              <strong>Material Changes:</strong> 30 days' advance notice via email, updated cookie consent banner on first visit, opportunity to review and adjust preferences.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              8. Contact Information
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              If you have any questions about this Cookie Policy, please contact us at{' '}
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

