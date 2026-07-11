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
import { GoogleReviews } from '@/components/sections/GoogleReviews';
import { SEOHead } from '@/components/shared/SEOHead';
import type { GalleryImage } from '@/types';
import meatVideo from '@/assets/imagesandvedioes/meatmaking.mp4';
import vegVideo from '@/assets/imagesandvedioes/vegies.mp4';

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'EventVenue',
  name: 'Shree Ganesh Party Venue & Catering Service',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Suryabinayak-6, Ganesthan Chwok',
    addressLocality: 'Bhaktapur',
    addressCountry: 'NP',
  },
  telephone: '+977-9851337076',
  url: 'https://shreeganeshsharma.com',
};

const services: { title: string; icon: LucideIcon; desc: string }[] = [
  { title: 'Wedding Venue', icon: Heart, desc: 'Elegant spaces for your dream wedding ceremony and reception.' },
  { title: 'Reception', icon: PartyPopper, desc: 'Grand reception halls with full catering and decoration services.' },
  { title: 'Birthday Parties', icon: Cake, desc: 'Make every birthday memorable with our customised packages.' },
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

/** Queens-Palace-style 3-layer section header */
function SectionHeader({ script, title, subtitle }: { script: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-3 mb-1">
        <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" aria-hidden="true" />
        <span className="font-script text-gold text-2xl leading-none">{script}</span>
        <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" aria-hidden="true" />
      </div>
      <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 font-sans text-lg italic text-zinc-400 max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const numericPart = parseInt(value.replace(/\D/g, '')) || 0;
  const suffix = value.replace(/\d/g, '');
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) { setCount(numericPart); return; }
    const duration = 1.2;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * numericPart));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, numericPart, shouldReduceMotion]);

  return (
    <div ref={ref} className="text-center p-6 border border-gold/15 hover:border-gold/40 transition-colors duration-300 bg-[rgba(201,168,76,0.03)]">
      <p className="font-serif text-5xl font-bold text-white tracking-tight">
        {count}<span className="text-gold">{suffix}</span>
      </p>
      <p className="mt-2 text-xs font-sans font-semibold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
    </div>
  );
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  const { data: galleryData } = useQuery({
    queryKey: ['featured-gallery'],
    queryFn: () => axiosInstance.get('/api/v1/gallery', { params: { featured: 'true' } }).then(r => r.data.data as GalleryImage[]),
  });

  const enter = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.24, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] },
  };

  return (
    <>
      <SEOHead
        title="Shree Ganesh Party Venue & Catering | Bhaktapur, Nepal"
        description="Premium event venue and catering in Bhaktapur, Nepal. Weddings, receptions, birthdays, Bratabandha, Pasni, corporate events. Book now."
        canonicalUrl="https://shreeganeshsharma.com"
        schema={LOCAL_BUSINESS_SCHEMA}
      />

      {/* ── HERO ── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(201,168,76,0.07)_0%,transparent_65%)]" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 px-4 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }} className="mb-4">
            <span className="font-script text-gold text-3xl sm:text-4xl leading-none">Welcome to</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] text-white tracking-[0.1em] uppercase">
            Shree Ganesh
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.24 }}
            className="mx-auto mt-4 max-w-xl font-sans text-lg italic text-zinc-400">
            Party Venue &amp; Catering Service — Bhaktapur, Nepal
          </motion.p>

          <motion.div className="mt-2 flex justify-center gap-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}>
            <span className="block h-px w-16 bg-gradient-to-r from-transparent to-gold/70 self-center" />
            <span className="text-gold/60 text-xs tracking-[0.3em] uppercase font-sans">Est. 2014</span>
            <span className="block h-px w-16 bg-gradient-to-l from-transparent to-gold/70 self-center" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.24 }}
            className="flex flex-wrap justify-center gap-4">
            <Link to="/booking"
              className="font-serif tracking-[0.14em] uppercase text-sm px-8 py-3.5 bg-gold hover:bg-gold/90 active:scale-95 text-zinc-950 font-semibold shadow-[0_0_20px_rgba(201,168,76,0.25)] transition-all duration-150 focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-zinc-950"
              style={{ borderRadius: '2px' }}>
              Book Your Event
            </Link>
            <Link to="/contact"
              className="font-serif tracking-[0.14em] uppercase text-sm px-8 py-3.5 border border-gold/50 hover:border-gold hover:bg-gold/5 active:scale-95 text-gold font-medium transition-all duration-150"
              style={{ borderRadius: '2px' }}>
              Get a Quote
            </Link>
          </motion.div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-xs font-sans tracking-widest text-zinc-500 uppercase">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-zinc-500 to-transparent" />
        </div>
      </section>

      {/* ── VIDEOS ── */}
      <section className="bg-[#0a0a0a] border-b border-gold/10 py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div {...enter}>
            <SectionHeader script="See It Live" title="Our Kitchen in Action" />
          </motion.div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative w-full overflow-hidden border border-gold/15" style={{ aspectRatio: '16/9' }}>
              <video
                src={vegVideo}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                aria-label="Vegetarian food preparation"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-4 left-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Vegetarian Delights
              </span>
            </div>
            <div className="relative w-full overflow-hidden border border-gold/15" style={{ aspectRatio: '16/9' }}>
              <video
                src={meatVideo}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                aria-label="Non-vegetarian food preparation"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-4 left-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Non-Vegetarian Specials
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#0a0a0a] border-y border-gold/10 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-px sm:grid-cols-4 border border-gold/10">
            {stats.map((s) => <AnimatedCounter key={s.label} value={s.value} label={s.label} />)}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="bg-[#0a0a0a] py-28 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div {...enter}>
            <SectionHeader script="What We Offer" title="Our Services"
              subtitle="Expert catering and beautifully curated venues to fit any festive occasion." />
          </motion.div>
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4 border border-gold/10">
            {services.map((s, i) => (
              <motion.div key={s.title} {...enter} transition={{ delay: i * 0.04, duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                className="p-7 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(201,168,76,0.04)] border-r border-b border-gold/[0.08] last:border-r-0 transition-all duration-200 group">
                <div className="flex h-10 w-10 items-center justify-center border border-gold/20 bg-gold/5 text-gold mb-5 group-hover:border-gold/50 transition-colors">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-base font-semibold text-white tracking-wider uppercase mb-2">{s.title}</h3>
                <p className="text-sm font-sans text-zinc-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOK EARLY CTA ── */}
      <section className="relative overflow-hidden py-28 bg-[#0a0a0a] border-t border-gold/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,168,76,0.05)_0%,transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="font-script text-gold text-2xl">Book Early</span>
            <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mb-4">
            Dates Fill Fast!
          </h2>
          <p className="font-sans text-lg text-zinc-300 mb-8 italic">
            Our venue gets booked quickly on popular dates. Check availability in minutes — fast, free, and risk-free.
          </p>

          <div className="border border-gold/20 bg-[rgba(201,168,76,0.04)] p-8 mb-8 text-left max-w-md mx-auto">
            <ul className="space-y-4 font-sans text-zinc-300">
              {[
                'No payment required now.',
                'We confirm only after mutual discussion.',
                'Advance collected only after agreement.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-gold mt-0.5 text-lg leading-none">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="font-serif text-xl text-white tracking-wide mb-8">Secure your date before it's gone!</p>
          <Link to="/booking"
            className="inline-block font-serif tracking-[0.14em] uppercase text-sm px-10 py-4 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold shadow-[0_0_24px_rgba(201,168,76,0.3)] transition-all duration-150"
            style={{ borderRadius: '2px' }}>
            Book Online
          </Link>
        </div>
      </section>

      {/* ── FEATURED GALLERY ── */}
      {galleryData && galleryData.length > 0 && (
        <section className="py-28 px-4 bg-[#0a0a0a] border-t border-gold/10">
          <div className="mx-auto max-w-7xl">
            <motion.div {...enter}>
              <SectionHeader script="Our Work" title="Recent Events"
                subtitle="A glimpse inside the weddings, celebrations, and grand ceremonies hosted by us." />
            </motion.div>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
              {galleryData.slice(0, 8).map((img, i) => (
                <motion.div key={img._id} {...enter}
                  transition={{ delay: i * 0.04, duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                  className="group relative h-52 w-full overflow-hidden border border-gold/[0.08]">
                  <img src={img.imageUrl} alt={img.altText ?? img.category}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
                    <p className="text-xs font-sans font-semibold uppercase tracking-widest text-white capitalize">{img.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/gallery"
                className="inline-block font-serif tracking-[0.14em] uppercase text-sm px-7 py-3 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150"
                style={{ borderRadius: '2px' }}>
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── REVIEWS (DB testimonials) ── */}
      <ReviewsSection />

      {/* ── GOOGLE REVIEWS (live from Google Places API) ── */}
      <GoogleReviews />

      {/* ── GOOGLE MAP + CONTACT ── */}
      <section className="bg-[#0a0a0a] border-t border-gold/10 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div {...enter}>
            <SectionHeader script="Find Us" title="Visit Our Venue" />
          </motion.div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="border border-gold/15 bg-[rgba(255,255,255,0.02)] p-8 flex flex-col justify-between">
              <div>
                <p className="font-sans text-zinc-300 leading-relaxed mb-6 text-base">
                  Shree Ganesh Party Venue is located in <strong className="text-white">Suryabinayak-6, Ganesthan Chwok, Bhaktapur</strong> — easily accessible from Kathmandu. Our wide entrance handles heavy event traffic comfortably.
                </p>
              </div>
              <div className="space-y-3 border-t border-gold/10 pt-6 font-sans text-sm text-zinc-400">
                <div>📍 <strong className="text-white">Address:</strong> Suryabinayak-6, Bhaktapur (Near Ganesthan Temple)</div>
                <div>📞 <strong className="text-white">Phone:</strong> +977 9851337076 / 9841358723</div>
                <div>✉️ <strong className="text-white">Email:</strong> shreeganeshsharma@gmail.com</div>
                <div>⏰ <strong className="text-white">Hours:</strong> Sun – Sat: 9:00 AM – 7:00 PM</div>
              </div>
            </div>
            <div className="h-[380px] border border-gold/15 overflow-hidden">
              <iframe
                title="Shree Ganesh Party Venue Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3534.1635!2d85.4192105!3d27.6568609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb110c2267df35%3A0x7ebc0c5dd5079595!2sShree%20Ganesh%20Party%20Venue%20And%20Catering%20Service!5e0!3m2!1sen!2snp!4v1690000000000!5m2!1sen!2snp"
                className="w-full h-full border-0 grayscale-[60%] hover:grayscale-0 transition-all duration-500"
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQSection title="Frequently Asked Questions"
        subtitle="Everything you need to know before booking your event." limit={8} showSchema />

      {/* ── BOTTOM CTA ── */}
      <section className="bg-[#0a0a0a] py-28 px-4 text-center border-t border-gold/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(201,168,76,0.05)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-xl mx-auto">
          <span className="font-script text-gold text-2xl block mb-2">Ready?</span>
          <h2 className="font-serif text-4xl font-bold text-white tracking-widest uppercase mb-4">Book Your Event</h2>
          <p className="font-sans text-zinc-400 italic mb-10">Contact us today and let's create something extraordinary together.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/booking"
              className="font-serif tracking-[0.14em] uppercase text-sm px-8 py-3.5 bg-gold hover:bg-gold/90 active:scale-95 text-zinc-950 font-semibold shadow-[0_0_20px_rgba(201,168,76,0.25)] transition-all duration-150"
              style={{ borderRadius: '2px' }}>
              Book Now
            </Link>
            <Link to="/contact"
              className="font-serif tracking-[0.14em] uppercase text-sm px-8 py-3.5 border border-gold/50 hover:border-gold hover:bg-gold/5 active:scale-95 text-gold font-medium transition-all duration-150"
              style={{ borderRadius: '2px' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
