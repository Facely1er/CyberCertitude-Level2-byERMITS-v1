import { TermsOfServicePage } from '../features/legal/components/TermsOfServicePage';
import { PrivacyPolicyPage } from '../features/legal/components/PrivacyPolicyPage';
import { CookiePolicyPage } from '../features/legal/components/CookiePolicyPage';
import { AcceptableUsePolicyPage } from '../features/legal/components/AcceptableUsePolicyPage';
import { DisclaimerPage } from '../features/legal/components/DisclaimerPage';

export const legalRoutes = [
  {
    path: "/legal/terms-of-service",
    element: TermsOfServicePage,
    title: "Terms of Service"
  },
  {
    path: "/legal/privacy-policy",
    element: PrivacyPolicyPage,
    title: "Privacy Policy"
  },
  {
    path: "/legal/cookie-policy",
    element: CookiePolicyPage,
    title: "Cookie Policy"
  },
  {
    path: "/legal/acceptable-use-policy",
    element: AcceptableUsePolicyPage,
    title: "Acceptable Use Policy"
  },
  {
    path: "/legal/disclaimer",
    element: DisclaimerPage,
    title: "Disclaimer"
  }
];

