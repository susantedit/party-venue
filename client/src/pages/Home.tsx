import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import {
  Building2, Cake, ChefHat, Flower2, Heart, PartyPopper, Sparkles, UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { FAQSection } from '@/components/sections/FAQSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { SEOHead } from '@/components/shared/SEOHead';
import type { GalleryImage } from '@/types';

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'EventVenue',
  name: 'Shree Ganesh Party Venue & Catering Service',
  address: { '@type': 'PostalAddress', addressLocality: 'Bhaktapur', addressCountry: 'NP' },
  telephone: '+977-9800000000',
  url: 'https://shreeganeshsharma.com',
};

const services: { title: string; icon: LucideIcon; desc: string }[] = [
  { title: 'Wedding Venue', icon: Heart, desc: 'Elegant spaces for your dream wedding ceremony and reception.' },
  { title: 'Reception', icon: PartyPopper, desc: 'Grand reception halls with full catering and decoration services.' },
  { title: 'Birthday Parties', icon: Cake, desc: 'Make every birthday memorable with our customized packages.' },
  { title: 'Bratabandha', icon: Sparkles, desc: 'Traditional ceremony arrangements with authentic Nepali setup.' },
  { title: 'Pasni', icon: UtensilsCrossed, desc: 'Beautiful rice-feeding ceremonies with traditional décor.' },
  { title: 'Corporate Events', icon: Building2, desc: 'Professional venue setup for conferences and corporate gatherings.' },
  { title: 'Catering', icon: ChefHat, desc: 'Authentic Nepali, Newari, Indian, and continental cuisines.' },
  { title: 'Decoration', icon: Flower2, desc: 'Custom floral and thematic decoration for every occasion.' },
];

const stats = [
  { value: '500+', label: 'Events Completed' },
  { value: '10+', label: 'Years Experience' },
  { value: '2000+', label: 'Happy Clients' },
  { value: '1000', label: 'Venue Capacity' },
];

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const numericPart = parseInt(value.replace(/\D/g, '')) || 0;
  const suffix = value.replace(/\d/g, '');
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setCount(numericPart);
      return;
    }
    const duration = 1.2;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * numericPart));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, numericPart, shouldReduceMotion]);

  return (
    <div 
      ref={ref} 
      className="text-center p-6 bg-zinc-900/30 rounded-xl border border-white/5 backdrop-blur-sm"
    >
      <p className="font-mono text-4xl font-extrabold text-white tracking-tight">
        {count}
        <span className="text-gold font-sans">{suffix}</span>
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
    </div>
  );
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  const { data: galleryData } = useQuery({
    queryKey: ['featured-gallery'],
    queryFn: () => axiosInstance.get('/api/v1/gallery', { params: { featured: 'true' } }).then(r => r.data.data as GalleryImage[]),
  });

  // Animation definitions matching strict recipes
  const enterAnimation = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: {
      duration: shouldReduceMotion ? 0.1 : 0.22,
      ease: shouldReduceMotion ? 'linear' : [0.2, 0.8, 0.2, 1], // cubic-bezier(.2,.8,.2,1)
    }
  };

  const cardContainerAnimation = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
      }
    }
  };

  const cardAnimation = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.22,
        ease: [0.2, 0.8, 0.2, 1]
      }
    }
  };

  return (
    <>
      <SEOHead
        title="Shree Ganesh Party Venue & Catering | Bhaktapur, Nepal"
        description="Premium event venue and catering in Bhaktapur, Nepal. Weddings, receptions, birthdays, corporate events. Book now."
        canonicalUrl="https://shreeganeshsharma.com"
        schema={LOCAL_BUSINESS_SCHEMA}
      />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950">
        {/* Subtle grid background overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        
        {/* Ambient background glow spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 px-4 text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-serif text-4xl sm:text-6xl font-bold leading-[1.15] text-white tracking-tight"
          >
            Create Unforgettable<br />
            <span className="text-gold bg-clip-text">Celebrations</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="mx-auto mt-6 max-w-xl text-lg text-zinc-400 font-sans"
          >
            Premium party venue & catering service in Bhaktapur, Nepal. We make every event extraordinary.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link 
              to="/booking" 
              className="rounded-lg bg-gold hover:bg-gold/90 active:scale-95 text-zinc-950 px-8 py-3.5 font-semibold shadow-md shadow-gold/10 transition-all duration-120 ease-out focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              Book Venue
            </Link>
            <Link 
              to="/contact" 
              className="rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 active:scale-95 px-8 py-3.5 font-semibold text-white transition-all duration-120 ease-out focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              Get Quote
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-zinc-950 border-y border-white/5 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <AnimatedCounter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-zinc-950 py-24 px-4 relative">
        <div className="mx-auto max-w-7xl">
          <motion.div {...enterAnimation} className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Our Services</h2>
            <p className="text-zinc-400 max-w-lg mx-auto">Expert catering and beautifully curated venues to fit any festive occasion.</p>
          </motion.div>

          <motion.div 
            variants={cardContainerAnimation}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {services.map((s) => (
              <motion.div
                key={s.title}
                variants={cardAnimation}
                whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
                transition={{ duration: 0.14, ease: 'easeOut' }}
                className="rounded-xl bg-zinc-900/30 p-6 border border-white/5 hover:border-gold/30 hover:shadow-[0_0_20px_rgba(201,162,39,0.04)] transition-all duration-140 focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-zinc-950"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gold">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Gallery */}
      {galleryData && galleryData.length > 0 && (
        <section className="py-24 px-4 bg-zinc-950 border-t border-white/5">
          <div className="mx-auto max-w-7xl">
            <motion.div {...enterAnimation} className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-white mb-4">Recent Events</h2>
              <p className="text-zinc-400 max-w-lg mx-auto">A glimpse inside the weddings, celebrations, and grand ceremonies hosted by us.</p>
            </motion.div>

            <motion.div 
              variants={cardContainerAnimation}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            >
              {galleryData.slice(0, 8).map((img) => (
                <motion.div 
                  key={img._id} 
                  variants={cardAnimation}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  className="group relative h-48 w-full overflow-hidden rounded-xl border border-white/5"
                >
                  <img 
                    src={img.imageUrl} 
                    alt={img.altText ?? img.category}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white capitalize">{img.category}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-12 text-center">
              <Link 
                to="/gallery" 
                className="inline-flex rounded-lg border border-gold/40 hover:border-gold px-6 py-2.5 text-sm font-medium text-gold hover:bg-gold/5 transition duration-120 ease-out focus:ring-2 focus:ring-gold"
              >
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <ReviewsSection />

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Everything you need to know before booking your event."
        limit={8}
        showSchema
      />

      {/* CTA */}
      <section className="bg-zinc-950 py-24 px-4 text-center border-t border-white/5 relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Ready to Book Your Event?</h2>
          <p className="text-zinc-400 mt-2">Contact us today and let's create something extraordinary together.</p>
          <div className="mt-10 flex justify-center gap-4">
            <Link 
              to="/booking" 
              className="rounded-lg bg-gold hover:bg-gold/90 active:scale-95 text-zinc-950 px-8 py-3.5 font-semibold shadow-md transition-all duration-120 ease-out focus:ring-2 focus:ring-gold focus:ring-offset-2"
            >
              Book Now
            </Link>
            <Link 
              to="/contact" 
              className="rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 active:scale-95 px-8 py-3.5 font-semibold text-white transition-all duration-120 ease-out focus:ring-2 focus:ring-white/20 focus:ring-offset-2"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
