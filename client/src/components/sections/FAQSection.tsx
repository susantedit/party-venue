import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showSchema?: boolean; // inject FAQPage JSON-LD
}

export function FAQSection({
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know before booking your event.',
  limit,
  showSchema = false,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { data: faqs = [] } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => axiosInstance.get('/api/v1/faqs').then(r => r.data.data as FAQ[]),
    staleTime: 5 * 60 * 1000,
  });

  const displayed = limit ? faqs.slice(0, limit) : faqs;

  // FAQPage JSON-LD schema
  const faqSchema = showSchema && faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  if (displayed.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-zinc-950 border-t border-white/5">
      {faqSchema && (
        <SEOHead
          title=""
          schema={faqSchema}
        />
      )}
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-4xl font-bold text-white text-center mb-4">{title}</h2>
        {subtitle && <p className="text-center text-zinc-400 mb-12">{subtitle}</p>}

        <div className="space-y-4">
          {displayed.map((faq, idx) => (
            <div key={faq._id} className="rounded-xl bg-zinc-900/30 border border-white/5 overflow-hidden transition-all duration-140 hover:border-white/10">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition focus:outline-none focus-visible:bg-white/5"
                aria-expanded={openIndex === idx}
              >
                <span className="font-semibold text-white pr-4">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-gold" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ 
                      duration: shouldReduceMotion ? 0.08 : 0.2, 
                      ease: 'easeOut' // Accordion expand timing recipe: 200ms ease-out
                    }}
                  >
                    <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
