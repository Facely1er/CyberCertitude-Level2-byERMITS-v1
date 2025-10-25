import { AuthPage, MagicLinkCallback } from '../components/LazyComponents';

export const authRoutes = [
  {
    path: "/auth",
    element: AuthPage,
    title: "Authentication"
  },
  {
    path: "/auth/callback",
    element: MagicLinkCallback,
    title: "Authentication Callback"
  },
  {
    path: "/forgot-password",
    element: () => (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background-light to-secondary-50 dark:from-background-dark dark:via-surface-dark dark:to-background-dark flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card-standard p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Reset Password
              </h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
                Enter your email to receive reset instructions
              </p>
            </div>
            <div className="text-center">
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                Password reset functionality is available through the authentication system.
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="btn-primary px-6 py-3"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    title: "Forgot Password"
  }
];
