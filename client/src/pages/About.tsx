import { SEOHead } from '@/components/shared/SEOHead';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionReveal } from '@/components/ui/SectionReveal';

export default function About() {
  return (
    <>
      <SEOHead
        title="About Us"
        description="Learn about Shree Ganesh Party Venue & Catering Service — Bhaktapur's premier event venue since 2014."
        canonicalUrl="https://shreeganeshsharma.com/about"
      />
      <div className="bg-zinc-950 pt-24 pb-16 px-4">
        <div className="relative z-10 mx-auto max-w-4xl">
          <PageHeader
            title="About Us"
            description="Bhaktapur's trusted partner for unforgettable celebrations since 2014."
            breadcrumb="About"
          />

          <SectionReveal className="prose prose-lg max-w-none space-y-6 text-zinc-400">
            <p>
              Shree Ganesh Party Venue & Catering Service has been creating extraordinary celebrations in the heart of Bhaktapur, Nepal for over a decade. From intimate family gatherings to grand weddings with 1,000+ guests, we bring every event vision to life with precision, warmth, and excellence.
            </p>
            <p>
              Our venue spans three beautifully designed halls, a dedicated outdoor terrace, and a full commercial kitchen — giving us the capacity and flexibility to host weddings, receptions, Bratabandha, Pasni, corporate conferences, and birthday celebrations all under one roof.
            </p>
            <p>
              Our culinary team specializes in authentic Nepali, Newari, Indian, Chinese, and BBQ cuisines, ensuring every guest leaves fully satisfied. We believe food is at the heart of every celebration — it&apos;s what people remember.
            </p>
          </SectionReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { title: 'Our Mission', desc: 'To deliver flawless events that exceed expectations, creating memories that last a lifetime.' },
              { title: 'Our Vision', desc: "To be Nepal's most trusted venue and catering brand, known for quality, reliability, and elegance." },
              { title: 'Our Values', desc: 'Hospitality, integrity, excellence, and a genuine passion for celebrating life\'s milestones.' },
            ].map((v) => (
              <GlassCard key={v.title}>
                <h3 className="font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-zinc-400">{v.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
