import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from '../components/ui';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogins = [
    { email: 'john.smith@lacountyfire.gov', role: 'Team Member' },
    { email: 'mike.johnson@lacountyfire.gov', role: 'Warehouse Staff' },
    { email: 'sarah.williams@lacountyfire.gov', role: 'Warehouse Admin' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-surface rounded-2xl shadow-xl border border-border p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-action-primary rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="inventory_2" size="lg" className="text-white" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-primary-900">
              CacheDEX
            </h2>
            <p className="mt-2 text-sm text-primary-500">
              Mission-Ready Logistics
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-danger-100 border border-danger-500/20 text-danger-500 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <Icon name="error" size="sm" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@lacountyfire.gov"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Demo logins */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-surface text-primary-400 font-medium uppercase tracking-wider">Demo accounts</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {demoLogins.map((demo) => (
                <button
                  key={demo.email}
                  onClick={() => {
                    setEmail(demo.email);
                    setPassword('demo');
                  }}
                  className="w-full text-left px-4 py-3 border border-border rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-all group"
                >
                  <span className="text-sm font-medium text-primary-700 group-hover:text-action-primary transition-colors">{demo.email}</span>
                  <span className="block text-xs text-primary-400 mt-0.5">{demo.role}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-primary-400">
              Use any password for demo accounts
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-primary-400">
            <Icon name="local_fire_department" size="sm" className="text-warning-500" />
            <span>LA County Fire Department - USAR Task Force</span>
          </div>
        </div>
      </div>
    </div>
  );
}
