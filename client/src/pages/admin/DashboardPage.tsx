import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import {
  BookOpen, Clock, CheckCircle2, MessageSquare,
  Package, FileText, TrendingUp, ArrowRight,
  Calendar, Image, Star, UtensilsCrossed, HelpCircle,
} from 'lucide-react';

interface DashboardData {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalInquiries: number;
  totalPackages: number;
  totalBlogs: number;
  revenueEstimate: number;
}

const statConfig = [
  {
    key: 'totalBookings',
    label: 'Total Bookings',
    icon: BookOpen,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    link: '/admin/bookings',
  },
  {
    key: 'pendingBookings',
    label: 'Pending',
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    link: '/admin/bookings',
  },
  {
    key: 'confirmedBookings',
    label: 'Confirmed',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    link: '/admin/bookings',
  },
  {
    key: 'totalInquiries',
    label: 'Inquiries',
    icon: MessageSquare,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    link: '/admin/inquiries',
  },
  {
    key: 'totalPackages',
    label: 'Packages',
    icon: Package,
    color: 'text-gold',
    bg: 'bg-gold/10',
    border: 'border-gold/20',
    link: '/admin/packages',
  },
  {
    key: 'totalBlogs',
    label: 'Blog Posts',
    icon: FileText,
    color: 'text-zinc-300',
    bg: 'bg-zinc-500/10',
    border: 'border-zinc-500/20',
    link: '/admin/blogs',
  },
  {
    key: 'revenueEstimate',
    label: 'Est. Revenue',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    link: '/admin/bookings',
    format: true,
  },
];

const quickLinks = [
  { to: '/admin/bookings',    label: 'Bookings',     icon: BookOpen,        desc: 'View & manage' },
  { to: '/admin/inquiries',   label: 'Inquiries',    icon: MessageSquare,   desc: 'Customer queries' },
  { to: '/admin/calendar',    label: 'Calendar',     icon: Calendar,        desc: 'Event schedule' },
  { to: '/admin/packages',    label: 'Packages',     icon: Package,         desc: 'Pricing & offers' },
  { to: '/admin/gallery',     label: 'Gallery',      icon: Image,           desc: 'Photos & media' },
  { to: '/admin/menu',        label: 'Menu',         icon: UtensilsCrossed, desc: 'Food & catering' },
  { to: '/admin/testimonials',label: 'Testimonials', icon: Star,            desc: 'Reviews' },
  { to: '/admin/blogs',       label: 'Blogs',        icon: FileText,        desc: 'Articles' },
  { to: '/admin/faqs',        label: 'FAQs',         icon: HelpCircle,      desc: 'Q&A' },
];

function StatSkeleton() {
  return (
    <div className="border border-white/[0.06] bg-[#161616] p-5 animate-pulse" style={{ borderRadius: '4px' }}>
      <div className="h-8 w-8 bg-zinc-800 mb-4" style={{ borderRadius: '4px' }} />
      <div className="h-2.5 bg-zinc-800 rounded w-16 mb-2" />
      <div className="h-6 bg-zinc-800 rounded w-12" />
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => axiosInstance.get('/api/v1/dashboard/overview').then(r => r.data.data),
  });

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      <SEOHead title="Dashboard — Admin" noIndex />

      <div className="min-h-screen bg-[#0f0f0f]">
        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Overview</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Dashboard</h1>
            <span className="text-xs text-zinc-600 hidden sm:block">{today}</span>
          </div>
        </div>

        <div className="p-6 space-y-8">

          {/* ── Stats ── */}
          <div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-semibold mb-3">At a Glance</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
              {isLoading
                ? Array.from({ length: 7 }).map((_, i) => <StatSkeleton key={i} />)
                : statConfig.map(({ key, label, icon: Icon, color, bg, border, link, format }) => {
                    const raw = data?.[key as keyof DashboardData] ?? 0;
                    const display = format
                      ? `NPR ${Number(raw).toLocaleString()}`
                      : String(raw);
                    return (
                      <Link
                        key={key}
                        to={link}
                        className="group relative border border-white/[0.06] bg-[#161616] p-5 hover:border-white/[0.14] hover:bg-[#1a1a1a] transition-all duration-200 overflow-hidden"
                        style={{ borderRadius: '4px' }}
                      >
                        {/* Icon */}
                        <div className={`inline-flex h-8 w-8 items-center justify-center border ${border} ${bg} mb-4`} style={{ borderRadius: '4px' }}>
                          <Icon className={`h-3.5 w-3.5 ${color}`} aria-hidden="true" />
                        </div>

                        {/* Label */}
                        <p className="text-[11px] text-zinc-600 uppercase tracking-[0.12em] mb-1 font-semibold truncate">
                          {label}
                        </p>

                        {/* Value */}
                        <p className={`font-serif font-bold leading-tight ${color} ${format ? 'text-base' : 'text-2xl'}`}>
                          {display}
                        </p>

                        {/* Arrow */}
                        <ArrowRight className="absolute right-3.5 bottom-3.5 h-3 w-3 text-zinc-800 group-hover:text-zinc-500 transition-colors duration-150" aria-hidden="true" />
                      </Link>
                    );
                  })
              }
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-semibold mb-3">Quick Access</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {quickLinks.map(({ to, label, icon: Icon, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center gap-3 border border-white/[0.06] bg-[#161616] px-4 py-3.5 hover:border-gold/20 hover:bg-[#1a1a1a] transition-all duration-150"
                  style={{ borderRadius: '4px' }}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/[0.06] bg-white/[0.03] group-hover:border-gold/20 group-hover:bg-gold/5 transition-all duration-150" style={{ borderRadius: '4px' }}>
                    <Icon className="h-3.5 w-3.5 text-zinc-500 group-hover:text-gold transition-colors duration-150" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors duration-150 truncate">{label}</p>
                    <p className="text-[10px] text-zinc-700 truncate">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Tips strip ── */}
          <div className="border border-gold/10 bg-gold/[0.03] px-5 py-4 flex items-start gap-4" style={{ borderRadius: '4px' }}>
            <span className="text-gold text-lg leading-none shrink-0 mt-0.5">✦</span>
            <p className="text-xs text-zinc-500 leading-relaxed">
              <span className="text-zinc-300 font-semibold">Tip:</span> Confirm bookings promptly — customers get notified immediately and availability is blocked on the calendar.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
