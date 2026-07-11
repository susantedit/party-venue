import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { SEOHead } from '@/components/shared/SEOHead';

export default function LoginPage() {
  const { signIn } = useFirebaseAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Admin Login" noIndex />

      <div className="relative flex min-h-screen bg-[#0a0a0a]">
        {/* Left decorative panel — hidden on mobile */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-white/[0.06] relative overflow-hidden">
          {/* Background radial */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(201,168,76,0.08)_0%,transparent_60%)]" />
          {/* Dot grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center border border-gold/40 bg-gold/10 font-serif font-bold text-gold text-sm">
                SG
              </div>
              <div>
                <p className="font-serif text-white text-sm font-bold tracking-widest uppercase">Shree Ganesh</p>
                <p className="text-[10px] text-zinc-600 tracking-[0.2em] uppercase">Party Venue</p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="block h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-script text-gold text-2xl leading-none">Welcome back</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-white tracking-widest uppercase leading-snug mb-4">
              Manage Your<br />Venue & Events
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Access bookings, packages, gallery, inquiries, and more from one place.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3">
            {[
              { label: 'Bookings', value: '500+' },
              { label: 'Happy Clients', value: '2000+' },
              { label: 'Years Active', value: '10+' },
              { label: 'Events/Year', value: '50+' },
            ].map(s => (
              <div key={s.label} className="border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="font-serif text-xl font-bold text-gold">{s.value}</p>
                <p className="text-[11px] text-zinc-600 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: login form */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_20%,rgba(201,168,76,0.05)_0%,transparent_60%)]" />

          {/* Back to site */}
          <Link
            to="/"
            className="absolute left-5 top-5 inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-gold transition-colors duration-150"
            aria-label="Back to website"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to site
          </Link>

          <div className="relative z-10 w-full max-w-sm">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
              <div className="flex h-9 w-9 items-center justify-center border border-gold/40 bg-gold/10 font-serif font-bold text-gold text-sm">
                SG
              </div>
              <div>
                <p className="font-serif text-white text-sm font-bold tracking-widest uppercase">Shree Ganesh</p>
                <p className="text-[10px] text-zinc-600 tracking-[0.2em] uppercase">Admin Panel</p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-serif text-2xl font-bold text-white tracking-widest uppercase mb-1">
                Sign In
              </h1>
              <p className="text-sm text-zinc-500">Enter your credentials to access the dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-all duration-150 focus:border-gold/40 focus:bg-white/[0.05] focus:ring-1 focus:ring-gold/20"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" aria-hidden="true" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-white/[0.08] bg-white/[0.03] pl-10 pr-11 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-all duration-150 focus:border-gold/40 focus:bg-white/[0.05] focus:ring-1 focus:ring-gold/20"
                    style={{ borderRadius: '4px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors duration-150 p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 border border-red-500/20 bg-red-500/[0.07] px-3.5 py-2.5 text-xs text-red-400" style={{ borderRadius: '4px' }}>
                  <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-red-400" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full bg-gold hover:bg-gold/90 active:scale-[0.99] disabled:opacity-50 py-3 text-sm font-bold tracking-[0.15em] uppercase text-zinc-950 transition-all duration-150 font-serif shadow-[0_0_24px_rgba(201,168,76,0.2)] hover:shadow-[0_0_32px_rgba(201,168,76,0.3)]"
                style={{ borderRadius: '4px' }}
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                    Signing in…
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-zinc-700">
              Shree Ganesh Party Venue · Admin Panel
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
