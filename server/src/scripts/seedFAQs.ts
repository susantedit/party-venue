import 'dotenv/config';
import mongoose from 'mongoose';
import { FAQModel } from '../models/FAQ';
import { env } from '../config/env';

const DEFAULT_FAQS = [
  {
    question: 'What types of events can be hosted at Shree Ganesh Party Venue & Catering Service?',
    answer: 'We host weddings, receptions, engagements, birthdays, anniversaries, corporate gatherings, family functions, cultural programs, and other special celebrations. Contact us to discuss your event requirements.',
    order: 1,
  },
  {
    question: 'Do you provide catering services?',
    answer: 'Yes. We provide catering services for a variety of event types. Menu options and package details can be customized based on guest count, preferences, and event requirements.',
    order: 2,
  },
  {
    question: 'Can I book both the venue and catering together?',
    answer: 'Yes. Customers can choose venue-only services, catering-only services, or a complete event package that includes both venue and catering arrangements.',
    order: 3,
  },
  {
    question: 'Do you offer decoration services?',
    answer: 'Decoration services can be arranged depending on the event type and package selected. Please contact our team for customization options and pricing.',
    order: 4,
  },
  {
    question: 'How early should I book my event?',
    answer: 'We recommend booking as early as possible, especially during wedding and festival seasons, to ensure availability of your preferred date.',
    order: 5,
  },
  {
    question: 'Is parking available for guests?',
    answer: 'Parking availability may vary depending on the event size and date. Please contact our team for the latest parking arrangements and guest access information.',
    order: 6,
  },
  {
    question: 'Can I schedule a venue visit before booking?',
    answer: 'Yes. We encourage customers to visit the venue before confirming a booking. Please contact us to arrange a suitable visiting time.',
    order: 7,
  },
  {
    question: 'Do you provide customized event packages?',
    answer: 'Yes. Packages can be customized based on guest count, food preferences, decoration requirements, and event type.',
    order: 8,
  },
  {
    question: 'How can I request a quotation?',
    answer: 'You can submit a booking inquiry through the website, call us directly, or contact us through WhatsApp to receive a customized quotation.',
    order: 9,
  },
  {
    question: 'What information should I provide when booking?',
    answer: 'Please provide your event type, preferred date, estimated guest count, contact information, and any special requirements so we can prepare an appropriate proposal.',
    order: 10,
  },
];

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  const existing = await FAQModel.countDocuments();
  if (existing > 0) {
    console.log(`[seed] ${existing} FAQs already exist — skipping.`);
  } else {
    await FAQModel.insertMany(DEFAULT_FAQS.map(f => ({ ...f, isPublished: true })));
    console.log(`[seed] Inserted ${DEFAULT_FAQS.length} default FAQs.`);
  }
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
