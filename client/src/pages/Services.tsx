import { Link } from 'react-router-dom';
import {
  Building2, Cake, ChefHat, Flower2, PartyPopper, Sparkles, UtensilsCrossed, Heart,
  Car, Music, Camera, type LucideIcon,
} from 'lucide-react';
import { SEOHead } from '@/components/shared/SEOHead';

const services: { icon: LucideIcon; title: string; desc: string; features: string[] }[] = [
  {
    icon: Heart,
    title: 'Wedding Venue',
    desc: 'Grand halls for up to 1,000 guests with elegant décor, premium sound, and dedicated bridal suites. Every detail handled so you can focus on your moment.',
    features: ['Up to 1,000 guests', 'Bridal changing room', 'Custom floral décor', 'Sound & lighting'],
  },
  {
    icon: PartyPopper,
    title: 'Reception',
    desc: 'Spectacular reception halls with multi-cuisine catering and experienced event coordinators managing everything seamlessly.',
    features: ['Live music setups', 'Multi-cuisine buffet', 'Cocktail arrangements', 'Photo backdrop'],
  },
  {
    icon: Cake,
    title: 'Birthday Parties',
    desc: 'From children's first birthdays to milestone celebrations — custom themes, cakes, and entertainment tailored to your vision.',
    features: ['Custom themes', 'Birthday cakes', 'Entertainment', 'All age groups'],
  },
  {
    icon: Sparkles,
    title: 'Bratabandha',
    desc: 'Sacred ceremony setups with priests, ritual arrangements, and authentic Newari and Hindu cultural décor.',
    features: ['Traditional setup', 'Priest coordination', 'Cultural décor', 'Family catering'],
  },
  {
    icon: UtensilsCrossed,
    title: 'Pasni Ceremony',
    desc: "Authentic Newari Pasni arrangements — traditional food, rituals, and family gathering logistics all under one roof.",
    features: ['Traditional rituals', 'Newari cuisine', 'Family packages', 'Photography setup'],
  },
  {
    icon: Building2,
    title: 'Corporate Events',
    desc: 'Conference rooms, seminar halls, and corporate dining for business meetings, product launches, and team events.',
    features: ['AV equipment', 'Conference rooms', 'Business catering', 'WiFi & projectors'],
  },
  {
    icon: ChefHat,
    title: 'Catering Services',
    desc: 'Nepali, Newari, Indian, Chinese, and BBQ cuisines for events of any size — from intimate dinners to large banquets. Off-site available.',
    features: ['17+ menu categories', 'Custom menus', 'Dietary options', 'Off-site catering'],
  },
  {
    icon: Flower2,
    title: 'Decoration',
    desc: 'Professional decoration from floral arrangements to themed setups, lighting design to stage décor — we make your vision real.',
    features: ['Floral arrangements', 'Stage design', 'LED lighting', 'Custom themes'],
  },
];

const amenities = [
  { icon: Car, label: '100+ Car Parking', desc: 'Secure basement parking for large gatherings' },
  { icon: Music, label: 'DJ & Sound System', desc: 'Professional audio setup for every event' },
  { icon: Camera, label: 'Bridal Suite', desc: 'Private changing room with dedicated bathroom' },
  { icon: Sparkles, label: 'Backup Generator', desc: 'Uninterrupted power throughout your event' },
];

export default function Services() {
  return (
    <>
      <SEOHead
        title="Our Services — Shree Ganesh Party Venue"
        description="Wedding venues, catering, decoration, Bratabandha, Pasni, corporate events and more at Shree Ganesh Party Venue, Bhaktapur."
        canonicalUrl="https://shreeganeshsharma.com/services"
      />

      <div className="bg-[#0a0a0a] pt-28 pb-20 px-4">
        <div className="mx-auto max-w-6xl">

          {/* Section header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-script text-gold text-2xl leading-none">Everything You Need</span>
              <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">Our Services</h1>
            <p className="mt-4 font-sans text-lg italic text-zinc-400 max-w-xl mx-auto">
              From intimate ceremonies to grand celebrations — complete event solutions under one roof.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid gap-px sm:grid-cols-2 border border-gold/10 mb-16">
            {services.map((s) => (
              <div key={s.title}
                className="p-7 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(201,168,76,0.04)] transition-colors duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 flex items-center justify-center border border-gold/20 bg-gold/5 text-gold shrink-0">
                    <s.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="font-serif text-lg font-bold text-white tracking-wider uppercase">{s.title}</h2>
                </div>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed mb-4">{s.desc}</p>
                <ul className="grid grid-cols-2 gap-1.5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs font-sans text-zinc-500">
                      <span className="text-gold shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Amenities highlight strip */}
          <div className="border border-gold/15 bg-[rgba(201,168,76,0.03)] p-8 mb-14">
            <div className="text-center mb-8">
              <span className="font-script text-gold text-xl block mb-1">Venue Amenities</span>
              <h2 className="font-serif text-2xl font-bold text-white tracking-widest uppercase">
                Why Guests Choose Us
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-gold/10">
              {amenities.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="p-6 text-center bg-[rgba(255,255,255,0.02)]">
                  <Icon className="h-7 w-7 text-gold mx-auto mb-3" aria-hidden="true" />
                  <p className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-1">{label}</p>
                  <p className="font-sans text-xs text-zinc-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="border border-gold/15 bg-[rgba(255,255,255,0.02)] p-10 text-center">
            <span className="font-script text-gold text-xl block mb-2">Ready to begin?</span>
            <h2 className="font-serif text-3xl font-bold text-white tracking-widest uppercase mb-4">Book Your Event</h2>
            <p className="font-sans text-zinc-400 italic mb-8">
              Our team takes care of everything — you just show up and celebrate.
            </p>
            <Link to="/booking"
              className="inline-block font-serif tracking-[0.14em] uppercase text-xs px-8 py-3.5 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150 shadow-[0_0_16px_rgba(201,168,76,0.2)]"
              style={{ borderRadius: '2px' }}>
              Book Your Event
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
