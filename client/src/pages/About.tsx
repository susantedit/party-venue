import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';

const values = [
  { title: 'Our Mission', desc: 'To deliver flawless events that exceed expectations, creating memories that last a lifetime for every family we serve.' },
  { title: 'Our Vision', desc: "To be Nepal's most trusted venue and catering brand, known for quality, reliability, and elegance across Bagmati Province." },
  { title: 'Our Values', desc: "Hospitality, integrity, excellence, and a genuine passion for celebrating life's milestones — big and small." },
];

const highlights = [
  { num: '500+', label: 'Events Hosted' },
  { num: '10+', label: 'Years Experience' },
  { num: '1000', label: 'Guest Capacity' },
  { num: '3', label: 'Halls Available' },
];

export default function About() {
  return (
    <>
      <SEOHead
        title="About Us — Shree Ganesh Party Venue"
        description="Learn about Shree Ganesh Party Venue & Catering Service — Bhaktapur's premier event venue since 2014."
        canonicalUrl="https://shreeganeshsharma.com/about"
      />

      <div className="bg-[#0a0a0a] pt-28 pb-20 px-4">
        <div className="mx-auto max-w-5xl">

          {/* Section header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-script text-gold text-2xl leading-none">Our Story</span>
              <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">About Us</h1>
            <p className="mt-4 font-sans text-lg italic text-zinc-400 max-w-xl mx-auto">
              Bhaktapur's trusted partner for unforgettable celebrations since 2014.
            </p>
          </div>

          {/* Story paragraphs */}
          <div className="space-y-6 font-sans text-lg text-zinc-400 leading-relaxed mb-16 max-w-3xl mx-auto">
            <p>
              Shree Ganesh Party Venue & Catering Service has been creating extraordinary celebrations in the heart of Bhaktapur, Nepal for over a decade. From intimate family gatherings to grand weddings with 1,000+ guests, we bring every event vision to life with precision, warmth, and excellence.
            </p>
            <p>
              Our venue spans three beautifully designed halls, a dedicated outdoor terrace, and a full commercial kitchen — giving us the capacity and flexibility to host weddings, receptions, Bratabandha, Pasni, corporate conferences, and birthday celebrations all under one roof.
            </p>
            <p>
              Our culinary team specialises in authentic Nepali, Newari, Indian, Chinese, and BBQ cuisines, ensuring every guest leaves fully satisfied. We believe food is at the heart of every celebration — it's what people remember.
            </p>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-gold/10 mb-16">
            {highlights.map(({ num, label }) => (
              <div key={label} className="text-center p-7 bg-[rgba(255,255,255,0.02)]">
                <p className="font-serif text-4xl font-bold text-gold">{num}</p>
                <p className="mt-1 text-xs font-sans font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="grid gap-px sm:grid-cols-3 border border-gold/10 mb-14">
            {values.map((v) => (
              <div key={v.title} className="p-7 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(201,168,76,0.04)] transition-colors duration-200">
                <h3 className="font-serif text-base font-bold text-white tracking-wider uppercase mb-3">{v.title}</h3>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="border border-gold/15 bg-[rgba(201,168,76,0.03)] p-10 text-center">
            <span className="font-script text-gold text-xl block mb-2">Ready to celebrate?</span>
            <h2 className="font-serif text-3xl font-bold text-white tracking-widest uppercase mb-4">Let's Create Together</h2>
            <p className="font-sans text-zinc-400 italic mb-8 max-w-md mx-auto">
              Contact our team today and start planning the event of your dreams.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/booking"
                className="font-serif tracking-[0.14em] uppercase text-xs px-8 py-3.5 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150 shadow-[0_0_16px_rgba(201,168,76,0.2)]"
                style={{ borderRadius: '2px' }}>
                Book Your Event
              </Link>
              <Link to="/contact"
                className="font-serif tracking-[0.14em] uppercase text-xs px-8 py-3.5 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150"
                style={{ borderRadius: '2px' }}>
                Contact Us
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
