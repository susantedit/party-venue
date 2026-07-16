import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';
import { SITE_URL } from '@/constants';

const values = [
  { title: 'Our Mission', desc: 'To deliver flawless events that exceed expectations, creating memories that last a lifetime for every family we serve.' },
  { title: 'Our Vision', desc: "To be Nepal's most trusted venue and catering brand, known for quality, reliability, and elegance across Bagmati Province." },
  { title: 'Our Values', desc: "Hospitality, integrity, excellence, and a genuine passion for celebrating life's milestones — big and small." },
];

const highlights = [
  { num: '700-800', label: 'Verified Capacity' },
  { num: '7', label: 'Verified Event Types' },
  { num: '4', label: 'Booking Channels' },
  { num: 'Bhaktapur', label: 'Primary Location' },
];

export default function About() {
  return (
    <>
      <SEOHead
        title="About Shree Ganesh Party Venue And Catering Service"
        description="Learn about the Bhaktapur event venue near Suryabinayak Ganesh Mandir."
        canonicalUrl={`${SITE_URL}/about`}
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
              Shree Ganesh Party Venue And Catering Service near Suryabinayak Ganesh Mandir, Bhaktapur.
            </p>
          </div>

          {/* Story paragraphs */}
          <div className="space-y-6 font-sans text-lg text-zinc-400 leading-relaxed mb-16 max-w-3xl mx-auto">
            <p>
              Shree Ganesh Party Venue And Catering Service is a Bhaktapur event venue and catering service near Suryabinayak Ganesh Mandir. We host weddings, receptions, birthdays, Bratabandha, Pasni, corporate events, and catering bookings.
            </p>
            <p>
              Our verified capacity is 700-800 guests depending on the event setup. Exact package inclusions, seating layout, menu, and décor should be confirmed with the team before booking.
            </p>
            <p>
              We focus on clear communication, practical event planning, and real local visibility so guests can find the venue easily from Bhaktapur and the wider Kathmandu Valley.
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
                <h2 className="font-serif text-base font-bold text-white tracking-wider uppercase mb-3">{v.title}</h2>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="border border-gold/15 bg-[rgba(201,168,76,0.03)] p-10 text-center">
            <span className="font-script text-gold text-xl block mb-2">Ready to celebrate?</span>
            <p className="font-serif text-3xl font-bold text-white tracking-widest uppercase mb-4">Let's Create Together</p>
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
