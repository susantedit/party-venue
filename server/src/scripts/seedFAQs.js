/**
 * Seed script — plain JavaScript, no TypeScript required.
 * Run with: node src/scripts/seedFAQs.js
 * (from d:\party venue\server directory)
 */
'use strict';

const path = require('path');
// Resolve node_modules relative to server root (two levels up from src/scripts/)
const serverRoot = path.resolve(__dirname, '../..');
const dotenv = require(path.join(serverRoot, 'node_modules', 'dotenv'));
dotenv.config({ path: path.join(serverRoot, '.env') });

const mongoose = require(path.join(serverRoot, 'node_modules', 'mongoose'));

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('✗ MONGODB_URI is not set. Check your server/.env file.');
  process.exit(1);
}

// Inline FAQ schema — no TypeScript imports needed
const FAQSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);

const FAQS = [
  { order: 1, question: 'What is the guest capacity at Shree Ganesh Party Venue?', answer: 'Shree Ganesh Party Venue can comfortably accommodate events ranging from 50 to 1,000 guests, making it suitable for intimate gatherings as well as large weddings, receptions, and corporate events.' },
  { order: 2, question: 'What is the price range at Shree Ganesh Party Venue?', answer: 'Our standard menu package starts from NPR 1,200 per plate (VAT included). Prices may vary depending on your event requirements, menu selection, and additional services.' },
  { order: 3, question: 'Where is Shree Ganesh Party Venue located?', answer: 'Shree Ganesh Party Venue is conveniently located at Ganesthan, Suryabinayak, Bhaktapur, Nepal, with easy access from Kathmandu, Lalitpur, and surrounding areas.' },
  { order: 4, question: 'Is parking available at Shree Ganesh Party Venue?', answer: 'Yes. We provide ample parking facilities, including parking for up to 100 cars and parking for up to 200 motorcycles.' },
  { order: 5, question: 'What facilities are available at Shree Ganesh Party Venue?', answer: 'Our venue offers: a spacious banquet hall, catering services, car parking, bike parking, outside alcohol allowed, professional event management support, wedding and reception setup, and birthday and celebration arrangements.' },
  { order: 6, question: 'What types of halls are available?', answer: 'We offer a versatile banquet hall suitable for weddings, receptions, engagements, birthdays, corporate events, seminars, and private celebrations.' },
  { order: 7, question: 'Are menu packages available?', answer: 'Yes. We currently offer menu packages starting from NPR 1,200 per plate, and customized packages are available to suit your preferences and budget.' },
  { order: 8, question: 'What menu packages do you offer?', answer: 'Our standard package starts from NPR 1,200 per plate. We can also customize the menu based on your guest count, cuisine preferences, and event type.' },
  { order: 9, question: 'Can I customize the decoration for my event?', answer: 'Yes. Decoration can be customized according to your event theme, color preferences, and budget. Please contact us to discuss your requirements.' },
  { order: 10, question: 'Is Shree Ganesh Party Venue suitable for weddings?', answer: 'Yes. Our venue is designed for weddings of various sizes and includes catering, seating arrangements, decoration options, and ample parking.' },
  { order: 11, question: 'Do you host engagement ceremonies?', answer: 'Yes. We regularly host engagement ceremonies, ring ceremonies, and family celebrations with customizable packages.' },
  { order: 12, question: 'Can I book the venue for birthday parties?', answer: 'Absolutely. We host birthday parties for children and adults, offering flexible seating arrangements and customized food packages.' },
  { order: 13, question: 'Is the venue available for corporate events?', answer: 'Yes. We welcome seminars, conferences, office parties, training sessions, product launches, and other corporate events.' },
  { order: 14, question: 'How far is Shree Ganesh Party Venue from Kathmandu?', answer: 'The venue is located in Suryabinayak, Bhaktapur. You can see the exact location on our website map. It is easily accessible from Kathmandu, Lalitpur, and nearby municipalities.' },
  { order: 15, question: 'How early should I book the venue?', answer: 'We recommend booking at least 2-6 weeks in advance for weddings during the peak season. Early booking helps secure your preferred date.' },
  { order: 16, question: 'Can I visit the venue before booking?', answer: 'Yes. We encourage customers to schedule a venue visit to explore the hall, facilities, parking, and event setup options before confirming a booking.' },
  { order: 17, question: 'Do you provide catering services?', answer: 'Yes. We offer professional catering services with customizable menus for weddings, receptions, birthday parties, and corporate events.' },
  { order: 18, question: 'Can I customize the food menu?', answer: 'Yes. Our catering team can customize the menu based on your preferences, dietary requirements, cuisine selection, and budget.' },
  { order: 19, question: 'Do you offer vegetarian and non-vegetarian menu options?', answer: 'Yes. We provide both vegetarian and non-vegetarian menu options. Customized combinations are also available.' },
  { order: 20, question: 'Is outside catering allowed?', answer: 'Please contact us directly to discuss outside catering arrangements and venue policies.' },
  { order: 21, question: 'Is outside alcohol allowed?', answer: 'Outside alcohol is allowed at Shree Ganesh Party Venue. For serving alcohol inside the venue, prior permission is required.' },
  { order: 22, question: 'Does the venue have backup power?', answer: 'Yes. We have generator and backup power availability to ensure your event runs smoothly without interruptions.' },
  { order: 23, question: 'Do you provide event decoration services?', answer: 'Yes. Decoration services can be arranged and customized according to your event theme and preferences.' },
  { order: 24, question: 'Can I book the venue online?', answer: 'You can contact us through our website or by phone to check availability and begin the booking process.' },
  { order: 25, question: 'How can I check date availability?', answer: 'Simply contact our team with your preferred event date, expected guest count, and event type. We will confirm availability and provide package details.' },
  { order: 26, question: 'Why choose Shree Ganesh Party Venue in Bhaktapur?', answer: 'Shree Ganesh Party Venue is a popular choice for weddings and celebrations because of its convenient Bhaktapur location, capacity for up to 1,000 guests, spacious parking, customizable catering packages, and flexible event arrangements.' },
  { order: 27, question: 'How can I contact Shree Ganesh Party Venue?', answer: 'You can contact our team through the phone number, contact form on our website, or visit the venue directly to discuss your event requirements, pricing, and available dates.' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✓ Connected to MongoDB\n');

  let inserted = 0;
  let skipped = 0;

  for (const faq of FAQS) {
    const exists = await FAQ.exists({ question: faq.question });
    if (exists) {
      console.log(`  — skipped: "${faq.question.substring(0, 60)}..."`);
      skipped++;
    } else {
      await FAQ.create({ ...faq, isPublished: true });
      console.log(`  ✓ inserted: "${faq.question.substring(0, 60)}..."`);
      inserted++;
    }
  }

  console.log(`\n✓ Done. Inserted: ${inserted}, Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('✗ Failed:', err.message);
  process.exit(1);
});
