import React, { useEffect } from 'react';
import { ChevronLeft, ExternalLink, CreditCard } from 'lucide-react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { useInternalLinking } from '../../hooks/useInternalLinking';

interface BillingViewProps {
  onBack: () => void;
}

export const BillingView: React.FC<BillingViewProps> = ({ onBack }) => {
  const { breadcrumbs } = useInternalLinking();

  useEffect(() => {
    // Redirect to the official CyberCertitude pricing page
    window.open('https://cybercertitude.com/pricing', '_blank');
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Billing & Pricing
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Redirect Message */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Redirecting to Pricing Page
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You're being redirected to our official pricing page where you can view all available plans and manage your subscription.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you're not automatically redirected, click the button below:
          </p>
          
          <a
            href="https://cybercertitude.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ExternalLink className="w-5 h-5" />
            <span>View Pricing Plans</span>
          </a>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            What you'll find on our pricing page:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
            <li>• <strong>Annual/Monthly Toggle:</strong> Switch between billing cycles with instant price updates</li>
            <li>• <strong>Multiple Plans:</strong> Starter, Professional, and Enterprise tiers</li>
            <li>• <strong>Feature Comparison:</strong> Detailed comparison of all plan features</li>
            <li>• <strong>Secure Checkout:</strong> Safe and secure payment processing</li>
            <li>• <strong>Free Trial:</strong> Start with a free trial, no credit card required</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BillingView;