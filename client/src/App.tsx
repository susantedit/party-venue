import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from './lib/queryClient';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import { WhatsAppButton } from './components/shared/WhatsAppButton';
import { SkeletonLoader } from './components/shared/SkeletonLoader';
import Header from './components/Header';
import Footer from './components/Footer';
import { PageTransition } from './components/ui/PageTransition';

// Lazy-loaded public pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Packages = lazy(() => import('./pages/Packages'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const Contact = lazy(() => import('./pages/Contact'));
const Booking = lazy(() => import('./pages/Booking'));
const Location = lazy(() => import('./pages/Location'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const OfflinePage = lazy(() => import('./pages/Offline'));

// SEO landing pages
const WeddingVenue = lazy(() => import('./pages/seo/WeddingVenuePage'));
const CateringPage = lazy(() => import('./pages/seo/CateringPage'));

// Lazy-loaded admin pages
const AdminLogin = lazy(() => import('./pages/admin/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/DashboardPage'));
const AdminBookings = lazy(() => import('./pages/admin/BookingsPage'));
const AdminGallery = lazy(() => import('./pages/admin/GalleryPage'));
const AdminPackages = lazy(() => import('./pages/admin/PackagesPage'));
const AdminBlogs = lazy(() => import('./pages/admin/BlogsPage'));
const AdminTestimonials = lazy(() => import('./pages/admin/TestimonialsPage'));
const AdminInquiries = lazy(() => import('./pages/admin/InquiriesPage'));
const AdminMenu = lazy(() => import('./pages/admin/MenuPage'));
const AdminCalendar = lazy(() => import('./pages/admin/CalendarPage'));
const AdminFAQs = lazy(() => import('./pages/admin/FAQsPage'));

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <SkeletonLoader className="h-8 w-48" />
  </div>
);

function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <>
      <Header />
      <main className="min-h-screen noise-overlay">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>{children}</PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
              {/* Public routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
              <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
              <Route path="/packages" element={<PublicLayout><Packages /></PublicLayout>} />
              <Route path="/menu" element={<PublicLayout><MenuPage /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/booking" element={<PublicLayout><Booking /></PublicLayout>} />
              <Route path="/location" element={<PublicLayout><Location /></PublicLayout>} />
              <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />

              {/* SEO landing pages */}
              <Route path="/wedding-venue-bhaktapur" element={<PublicLayout><WeddingVenue /></PublicLayout>} />
              <Route path="/wedding-venue-in-bhaktapur" element={<PublicLayout><WeddingVenue /></PublicLayout>} />
              <Route path="/catering-service-bhaktapur" element={<PublicLayout><CateringPage /></PublicLayout>} />
              <Route path="/catering-service-in-bhaktapur" element={<PublicLayout><CateringPage /></PublicLayout>} />

              {/* Admin login (no layout) */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected admin routes — all wrapped in AdminLayout */}
              <Route path="/admin" element={
                <ProtectedRoute><AdminLayout /></ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="packages" element={<AdminPackages />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="menu" element={<AdminMenu />} />
                <Route path="calendar" element={<AdminCalendar />} />
                <Route path="faqs" element={<AdminFAQs />} />
              </Route>

              {/* Offline */}
              <Route path="/offline" element={<OfflinePage />} />

              {/* 404 */}
              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
