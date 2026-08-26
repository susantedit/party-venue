import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';
import { BUSINESS_PHONE, SITE_URL } from '@/constants';
import { trackPackageView } from '@/lib/analytics';
import { Phone, Calendar, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

function SectionHeader({ script, title, subtitle }: { script: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-1">
        <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
        <span className="font-script text-gold text-2xl leading-none">{script}</span>
        <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">{title}</h1>
      {subtitle && <p className="mt-4 font-sans text-lg italic text-zinc-400 max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

export default function Packages() {
  useEffect(() => {
    trackPackageView('packages_page');
  }, []);

  return (
    <>
      <SEOHead
        title="Custom Event Quotes & Booking | Shree Ganesh Party Venue"
        description="Every event is unique. Contact the owner directly for personalized quotes and negotiable pricing based on your guest size, menu, and setup."
        canonicalUrl={`${SITE_URL}/packages`}
      />
      <div className="bg-[#0a0a0a] pt-28 pb-20 px-4">
        <div className="relative z-10 mx-auto max-w-4xl">
          <SectionHeader
            script="Direct Consultation"
            title="Custom Pricing & Quotes"
            subtitle="We do not list rigid package prices because rates depend directly on your guest count, menu choices, and seasonal negotiation."
          />

          {/* Main Hero Card */}
          <div className="border border-gold/30 bg-[rgba(201,168,76,0.03)] p-8 sm:p-12 text-center rounded-xs shadow-[0_0_30px_rgba(201,168,76,0.08)] mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/30 text-gold text-xs font-serif uppercase tracking-widest font-semibold mb-6 rounded-full">
              <Sparkles className="h-3.5 w-3.5" /> Tailored For Every Celebration
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-wider uppercase mb-4 leading-snug">
              Get Your Best Rate via Direct Owner Call
            </h2>
            <p className="font-sans text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Whether you are planning an intimate gathering of 50 guests or a grand wedding of 1,000+, we negotiate rates directly with you to match your exact budget and preferences.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+9779851337076"
                className="inline-flex items-center gap-2 font-serif tracking-[0.14em] uppercase text-xs sm:text-sm px-8 py-4 bg-gold hover:bg-gold/90 text-zinc-950 font-bold transition-all duration-150 shadow-[0_0_24px_rgba(201,168,76,0.3)]"
                style={{ borderRadius: '2px' }}
              >
                <Phone className="h-4 w-4" /> Call Owner — {BUSINESS_PHONE}
              </a>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 font-serif tracking-[0.14em] uppercase text-xs sm:text-sm px-8 py-4 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 font-semibold transition-all duration-150"
                style={{ borderRadius: '2px' }}
              >
                <Calendar className="h-4 w-4" /> Request Quote Online
              </Link>
            </div>
          </div>

          {/* Why We Negotiate Directly */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: ShieldCheck,
                title: 'No Fixed Overcharging',
                desc: 'You only pay for what you actually use — guest count, specific dishes, and decoration elements.',
              },
              {
                icon: MessageSquare,
                title: 'Direct Negotiation',
                desc: 'Speak directly with the venue owner to discuss flexible rates, weekday discounts, and custom perks.',
              },
              {
                icon: Calendar,
                title: 'Custom Menu & Setup',
                desc: 'Tailor Nepali, Newari, Indian, or Continental menus according to your family choices and dietary preferences.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 bg-[#111111] border border-gold/15 text-center">
                <div className="h-10 w-10 mx-auto flex items-center justify-center border border-gold/30 bg-gold/5 text-gold mb-4 rounded-full">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-2">{title}</h3>
                <p className="font-sans text-xs text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom Action */}
          <div className="text-center pt-4">
            <p className="font-sans text-zinc-400 text-sm mb-4">Have questions or want to inspect the venue in person?</p>
            <Link
              to="/contact"
              className="inline-block text-xs font-serif tracking-widest text-gold hover:underline uppercase font-semibold"
            >
              Contact Our Event Coordination Team →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
