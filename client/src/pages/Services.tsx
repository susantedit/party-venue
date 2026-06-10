import { Link } from 'react-router-dom';
import {
  Building2, Cake, ChefHat, Flower2, PartyPopper, Sparkles, UtensilsCrossed, Heart,
  type LucideIcon,
} from 'lucide-react';
import { SEOHead } from '@/components/shared/SEOHead';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionReveal } from '@/components/ui/SectionReveal';

const services: {
  icon: LucideIcon;
  title: string;
  desc: string;
  features: string[];
}[] = [
  {
    icon: Heart,
    title: 'Wedding Venue',
    desc: 'Our grand wedding halls accommodate up to 1,000 guests with elegant décor, premium sound systems, and dedicated bridal suites. We handle everything from floral arrangements to lighting to ensure your special day is perfect.',
    features: ['Up to 1,000 guests', 'Bridal suite', 'Custom décor', 'Sound & lighting'],
  },
  {
    icon: PartyPopper,
    title: 'Reception',
    desc: 'Celebrate your union with a spectacular reception featuring live music, multi-cuisine catering, and our experienced event coordinators managing every detail.',
    features: ['Live music setups', 'Multi-cuisine menus', 'Cocktail arrangements', 'Photo booth'],
  },
  {
    icon: Cake,
    title: 'Birthday Parties',
    desc: "From children's parties to milestone birthdays, we create memorable celebrations tailored to your style and budget with custom cakes, themed décor, and entertainment.",
    features: ['Custom themes', 'Birthday cakes', 'Entertainment', 'Any age group'],
  },
  {
    icon: Sparkles,
    title: 'Bratabandha',
    desc: 'A sacred ceremony deserves a sacred setting. We provide traditional Newari and Hindu ceremony setups with priests, ritual arrangements, and authentic cultural décor.',
    features: ['Traditional setup', 'Priest coordination', 'Cultural décor', 'Family catering'],
  },
  {
    icon: UtensilsCrossed,
    title: 'Pasni Ceremony',
    desc: "Mark your child's first rice-feeding with an authentic Newari Pasni ceremony. We handle all ritual requirements, traditional food, and family gathering logistics.",
    features: ['Traditional rituals', 'Newari cuisine', 'Family packages', 'Photography setup'],
  },
  {
    icon: Building2,
    title: 'Corporate Events',
    desc: 'Professional conference rooms, seminar halls, and corporate dining facilities for your business meetings, product launches, and team events.',
    features: ['AV equipment', 'Conference rooms', 'Business catering', 'WiFi & projectors'],
  },
  {
    icon: ChefHat,
    title: 'Catering Services',
    desc: 'Our kitchen team delivers exceptional Nepali, Newari, Indian, Chinese, and BBQ cuisines for events of any size — from intimate dinners to large banquets.',
    features: ['Multiple cuisines', 'Custom menus', 'Dietary options', 'Off-site catering'],
  },
  {
    icon: Flower2,
    title: 'Decoration',
    desc: 'Transform any space with our professional decoration team. From floral arrangements to themed setups, lighting design to stage décor — we make your vision a reality.',
    features: ['Floral arrangements', 'Stage design', 'Lighting setups', 'Custom themes'],
  },
];

export default function Services() {
  return (
    <>
      <SEOHead
        title="Our Services"
        description="Wedding venues, catering, decoration, Bratabandha, Pasni, corporate events and more at Shree Ganesh Party Venue, Bhaktapur."
        canonicalUrl="https://shreeganeshsharma.com/services"
      />
      <div className="bg-zinc-950 pt-24 pb-16 px-4">
        <div className="relative z-10 mx-auto max-w-6xl">
          <PageHeader
            title="Our Services"
            description="From intimate ceremonies to grand celebrations — we offer complete event solutions under one roof."
            breadcrumb="Services"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {services.map((s) => (
              <GlassCard key={s.title}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gold">
                    <s.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-white">{s.title}</h2>
                </div>
                <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{s.desc}</p>
                <ul className="grid grid-cols-2 gap-1">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <span className="text-gold" aria-hidden="true">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>

          <SectionReveal className="mt-12 rounded-xl border border-white/5 bg-zinc-900/40 p-8 text-center backdrop-blur-sm">
            <h3 className="font-serif text-2xl font-bold text-white mb-2">Ready to get started?</h3>
            <p className="text-zinc-400 mb-6">Book your event today and let our team take care of everything.</p>
            <Link
              to="/booking"
              className="inline-flex min-h-[44px] items-center rounded-lg bg-gold px-6 py-3 font-semibold text-zinc-950 transition-all duration-120 ease-out hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Book Your Event
            </Link>
          </SectionReveal>
        </div>
      </div>
    </>
  );
}
