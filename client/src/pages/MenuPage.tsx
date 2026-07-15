import { useState } from 'react';
import { SEOHead } from '@/components/shared/SEOHead';
import { Link } from 'react-router-dom';
import { BUSINESS_PHONE, SITE_URL } from '@/constants';

interface MenuEntry {
  np: string;   // Nepali name
  en: string;   // English name / translation
  tag?: 'Veg' | 'Non-Veg';
}

interface MenuSection {
  npTitle: string;
  enTitle: string;
  items: MenuEntry[];
}

const SECTIONS: MenuSection[] = [
  {
    npTitle: 'ब्रेक फास्ट',
    enTitle: 'Breakfast',
    items: [
      { np: 'जुस', en: 'Juice', tag: 'Veg' },
      { np: 'चिया र कफि', en: 'Tea & Coffee', tag: 'Veg' },
      { np: 'मसला ओम्लेट', en: 'Masala Omelette', tag: 'Non-Veg' },
      { np: 'उसिनेको अण्डा', en: 'Boiled Egg', tag: 'Non-Veg' },
      { np: 'ब्रेड विद बटर एण्ड जाम', en: 'Bread with Butter & Jam', tag: 'Veg' },
      { np: 'स्क्राम्बल्ड अण्डा', en: 'Scrambled Egg', tag: 'Non-Veg' },
      { np: 'पुरी', en: 'Puri', tag: 'Veg' },
      { np: 'आलु जिरा', en: 'Aloo Jeera (Cumin Potatoes)', tag: 'Veg' },
      { np: 'कट फ्रेस फ्रुट', en: 'Cut Fresh Fruit', tag: 'Veg' },
      { np: 'पकौडा', en: 'Pakoda / Fritters', tag: 'Veg' },
      { np: 'कुकिज', en: 'Cookies', tag: 'Veg' },
      { np: 'स्यान्डविच — चिज / चिकेन / भेज', en: 'Sandwich — Cheese / Chicken / Veg' },
      { np: 'केराउ मसला', en: 'Green Peas Masala', tag: 'Veg' },
      { np: 'केराउ र आलु मसला', en: 'Green Peas & Potato Masala', tag: 'Veg' },
      { np: 'चना मसला', en: 'Chana Masala (Chickpea Curry)', tag: 'Veg' },
    ],
  },
  {
    npTitle: 'स्न्याक्स',
    enTitle: 'Snacks',
    items: [
      { np: 'फ्रेन्च फ्राई', en: 'French Fries', tag: 'Veg' },
      { np: 'तरुल फिङ्गर', en: 'Yam Fingers', tag: 'Veg' },
      { np: 'भेज टेम्प्युरा', en: 'Veg Tempura', tag: 'Veg' },
      { np: 'आलु चिल्ली', en: 'Aloo Chilli (Spicy Potatoes)', tag: 'Veg' },
      { np: 'बदाम सादेको', en: 'Spiced Peanut Salad (Badam Sandeko)', tag: 'Veg' },
      { np: 'पापड', en: 'Papad', tag: 'Veg' },
      { np: 'प्रौन क्राकर', en: 'Prawn Crackers', tag: 'Non-Veg' },
      { np: 'पनिर चिल्ली', en: 'Paneer Chilli', tag: 'Veg' },
      { np: 'मसरुम पकौडा', en: 'Mushroom Pakoda', tag: 'Veg' },
      { np: 'म:म — भेज / चिकेन / बफ', en: 'Momo — Veg / Chicken / Buff' },
      { np: 'स्टिक — भेज / चिज / पनिर / फ्रुट', en: 'Sticks — Veg / Cheese / Paneer / Fruit' },
      { np: 'वाण्टन् — भेज / बफ / चिकेन', en: 'Wonton — Veg / Buff / Chicken' },
      { np: 'मसरुम छोयला', en: 'Mushroom Chhoyela', tag: 'Veg' },
      { np: 'भेज पकौडा', en: 'Veg Pakoda', tag: 'Veg' },
      { np: 'स्प्रीङ रोल', en: 'Spring Roll', tag: 'Veg' },
    ],
  },
  {
    npTitle: 'मटन आइटम',
    enTitle: 'Mutton Items',
    items: [
      { np: 'सेकुवा', en: 'Mutton Sekuwa (Seared Mutton)', tag: 'Non-Veg' },
      { np: 'तावा', en: 'Mutton Tawa', tag: 'Non-Veg' },
      { np: 'भुटन', en: 'Bhutan (Fried Offal)', tag: 'Non-Veg' },
      { np: 'फोक्सो फ्राई', en: 'Fokso Fry (Fried Lungs)', tag: 'Non-Veg' },
    ],
  },
  {
    npTitle: 'चिकेन आइटम',
    enTitle: 'Chicken Items',
    items: [
      { np: 'चिल्ली', en: 'Chilli Chicken', tag: 'Non-Veg' },
      { np: 'सेकुवा', en: 'Chicken Sekuwa', tag: 'Non-Veg' },
      { np: 'ससेज', en: 'Chicken Sausage', tag: 'Non-Veg' },
      { np: 'ड्रम स्टिक', en: 'Chicken Drumsticks', tag: 'Non-Veg' },
      { np: 'तन्दुरी', en: 'Tandoori Chicken', tag: 'Non-Veg' },
      { np: 'बि.बि.क्यू', en: 'Chicken BBQ (Barbecue)', tag: 'Non-Veg' },
      { np: 'फ्राईड', en: 'Fried Chicken', tag: 'Non-Veg' },
      { np: 'मिट बल', en: 'Chicken Meatballs', tag: 'Non-Veg' },
      { np: 'साँदेको', en: 'Chicken Sandeko (Spiced Chicken Salad)', tag: 'Non-Veg' },
      { np: 'हाकु छोयला', en: 'Haku Chhoyela (Blackened Grilled Chicken)', tag: 'Non-Veg' },
    ],
  },
  {
    npTitle: 'फिस आइटम',
    enTitle: 'Fish Items',
    items: [
      { np: 'टिक्का', en: 'Fish Tikka', tag: 'Non-Veg' },
      { np: 'फिङ्गर', en: 'Fish Fingers', tag: 'Non-Veg' },
      { np: 'फ्राई', en: 'Fried Fish', tag: 'Non-Veg' },
    ],
  },
  {
    npTitle: 'बफ आइटम',
    enTitle: 'Buff Items',
    items: [
      { np: 'चिल्ली', en: 'Buff Chilli', tag: 'Non-Veg' },
      { np: 'साँदेको', en: 'Buff Sandeko (Spiced Buff Salad)', tag: 'Non-Veg' },
      { np: 'वि.वि.क्यू', en: 'Buff BBQ', tag: 'Non-Veg' },
      { np: 'तावा', en: 'Buff Tawa', tag: 'Non-Veg' },
      { np: 'ससेज', en: 'Buff Sausage', tag: 'Non-Veg' },
      { np: 'छोयला', en: 'Buff Chhoyela', tag: 'Non-Veg' },
      { np: 'हाकु', en: 'Haku (Grilled Blackened Buff)', tag: 'Non-Veg' },
      { np: 'मना', en: 'Mana (Boiled & Marinated Buff)', tag: 'Non-Veg' },
      { np: 'सेकुवा', en: 'Buff Sekuwa', tag: 'Non-Veg' },
      { np: 'मिट बल', en: 'Buff Meatballs', tag: 'Non-Veg' },
    ],
  },
  {
    npTitle: 'पोर्क आइटम',
    enTitle: 'Pork Items',
    items: [
      { np: 'चिल्ली', en: 'Pork Chilli', tag: 'Non-Veg' },
      { np: 'साँदेको', en: 'Pork Sandeko', tag: 'Non-Veg' },
      { np: 'वि.वि.क्यू', en: 'Pork BBQ', tag: 'Non-Veg' },
      { np: 'सेकुवा', en: 'Pork Sekuwa', tag: 'Non-Veg' },
      { np: 'पोर्क साईनिङ्ग', en: 'Pork Shining', tag: 'Non-Veg' },
    ],
  },
  {
    npTitle: 'मेन कोर्ष',
    enTitle: 'Main Course',
    items: [
      { np: 'बटर पुलाउ', en: 'Butter Pulao', tag: 'Veg' },
      { np: 'प्लेन पुलाउ', en: 'Plain Pulao', tag: 'Veg' },
      { np: 'कश्मिरी पुलाउ', en: 'Kashmiri Pulao', tag: 'Veg' },
      { np: 'पिज पुलाउ', en: 'Peas Pulao', tag: 'Veg' },
      { np: 'जिरा पुलाउ', en: 'Jeera Pulao (Cumin Rice)', tag: 'Veg' },
      { np: 'भेज पुलाउ', en: 'Veg Pulao', tag: 'Veg' },
      { np: 'भेज चाउमिन', en: 'Veg Chowmein', tag: 'Veg' },
      { np: 'नन् भेज चाउमिन', en: 'Non-Veg Chowmein', tag: 'Non-Veg' },
      { np: 'भेज म्याकोनी', en: 'Veg Macaroni', tag: 'Veg' },
      { np: 'नन् भेज म्याकोनी', en: 'Non-Veg Macaroni', tag: 'Non-Veg' },
      { np: 'प्लेन नान', en: 'Plain Naan', tag: 'Veg' },
      { np: 'बटर नान', en: 'Butter Naan', tag: 'Veg' },
      { np: 'रुमाली', en: 'Rumali Roti', tag: 'Veg' },
      { np: 'प्लेन रोटी', en: 'Plain Roti', tag: 'Veg' },
      { np: 'भटौरा', en: 'Bhatura', tag: 'Veg' },
    ],
  },
  {
    npTitle: 'भेज करी',
    enTitle: 'Veg Curry',
    items: [
      { np: 'नवरत्न करी', en: 'Navratan Curry', tag: 'Veg' },
      { np: 'पालक पनिर', en: 'Palak Paneer', tag: 'Veg' },
      { np: 'आलु काउली फ्राईड', en: 'Fried Potato & Cauliflower', tag: 'Veg' },
      { np: 'मिक्स भेज करी', en: 'Mixed Veg Curry', tag: 'Veg' },
      { np: 'मटर पनिर', en: 'Muttar Paneer', tag: 'Veg' },
      { np: 'कटहर फ्राईड', en: 'Fried Jackfruit', tag: 'Veg' },
      { np: 'परवल कोफ्ता', en: 'Parwal Kofta (Pointed Gourd Kofta)', tag: 'Veg' },
      { np: 'परवल फ्राईड', en: 'Fried Parwal (Pointed Gourd)', tag: 'Veg' },
      { np: 'मटरकोषा च्याउ करी', en: 'Peas & Mushroom Curry', tag: 'Veg' },
      { np: 'पोक्चा सँग', en: 'Pokchoy / Bok Choy Greens', tag: 'Veg' },
      { np: 'थाई सँग', en: 'Thai Greens', tag: 'Veg' },
      { np: 'मिक्स सँग (चम्सुर, पालुङ्गो, रायो)', en: 'Mixed Greens — Watercress, Spinach, Mustard', tag: 'Veg' },
    ],
  },
  {
    npTitle: 'दाल',
    enTitle: 'Dal / Lentils',
    items: [
      { np: 'राजमा दाल', en: 'Rajma Dal (Kidney Bean Curry)', tag: 'Veg' },
      { np: 'फ्राईड दाल', en: 'Fried Dal', tag: 'Veg' },
      { np: 'मिक्स दाल', en: 'Mixed Dal', tag: 'Veg' },
      { np: 'दाल मखानी', en: 'Dal Makhani', tag: 'Veg' },
      { np: 'मटर मसाला', en: 'Muttar Masala (Green Peas Curry)', tag: 'Veg' },
    ],
  },
  {
    npTitle: 'नन् भेज मासुको परिकार',
    enTitle: 'Non-Veg Meat Dishes',
    items: [
      { np: 'मटन मसला', en: 'Mutton Masala', tag: 'Non-Veg' },
      { np: 'मटन करी', en: 'Mutton Curry', tag: 'Non-Veg' },
      { np: 'मटन टावा', en: 'Mutton Tawa', tag: 'Non-Veg' },
      { np: 'चिकेन फ्राई', en: 'Chicken Fry', tag: 'Non-Veg' },
      { np: 'चिकेन करी', en: 'Chicken Curry', tag: 'Non-Veg' },
      { np: 'चिकेन बटर मसला', en: 'Chicken Butter Masala', tag: 'Non-Veg' },
      { np: 'चिकेन तन्दुरी', en: 'Chicken Tandoori', tag: 'Non-Veg' },
      { np: 'चिकेन तावा', en: 'Chicken Tawa', tag: 'Non-Veg' },
      { np: 'वेक्ती फ्राईड', en: 'Fried Bhetki / Barramundi', tag: 'Non-Veg' },
      { np: 'वेक्ती ग्रिल्ड', en: 'Grilled Bhetki / Barramundi', tag: 'Non-Veg' },
      { np: 'माछा फ्राईड', en: 'Fried Fish', tag: 'Non-Veg' },
      { np: 'बफ तावा', en: 'Buff Tawa', tag: 'Non-Veg' },
      { np: 'बफ करी', en: 'Buff Curry', tag: 'Non-Veg' },
      { np: 'बनेल तावा', en: 'Wild Boar Tawa', tag: 'Non-Veg' },
      { np: 'पोर्क करी', en: 'Pork Curry', tag: 'Non-Veg' },
    ],
  },
  {
    npTitle: 'अचार',
    enTitle: 'Pickle / Achar',
    items: [
      { np: 'मिक्स अचार नेपाली', en: 'Nepali Mixed Pickle', tag: 'Veg' },
      { np: 'आलु अचार', en: 'Aloo Achar (Potato Pickle)', tag: 'Veg' },
      { np: 'गुन्द्रुक सादेको', en: 'Gundruk Sandeko (Fermented Leafy Green Salad)', tag: 'Veg' },
      { np: 'लप्सी गुलियो र अमिलो', en: 'Sweet & Sour Lapsi (Hog Plum Pickle)', tag: 'Veg' },
      { np: 'गोल्भेडा अचार', en: 'Tomato Pickle (Plain)', tag: 'Veg' },
      { np: 'गोल्भेडा टोफु', en: 'Tomato Pickle with Tofu', tag: 'Veg' },
      { np: 'गोल्भेडा मटर', en: 'Tomato Pickle with Peas', tag: 'Veg' },
      { np: 'गोल्भेडा पनिर', en: 'Tomato Pickle with Paneer', tag: 'Veg' },
    ],
  },
  {
    npTitle: 'सलाद',
    enTitle: 'Salad',
    items: [
      { np: 'हरियो सलाद', en: 'Green Salad', tag: 'Veg' },
      { np: 'रसियन सलाद', en: 'Russian Salad', tag: 'Veg' },
    ],
  },
  {
    npTitle: 'डेजर्ट',
    enTitle: 'Dessert',
    items: [
      { np: 'गाँजरको हलुवा', en: 'Gajar Ko Haluwa (Carrot Pudding)', tag: 'Veg' },
      { np: 'रसवरी', en: 'Rasbari (Sweet Milk Balls)', tag: 'Veg' },
      { np: 'लालमोन', en: 'Lalmon / Gulab Jamun', tag: 'Veg' },
      { np: 'जुलेवी', en: 'Jalebi', tag: 'Veg' },
      { np: 'बर्फ', en: 'Barfi', tag: 'Veg' },
      { np: 'मिठो दही', en: 'Sweet Yogurt (Meethi Dahi)', tag: 'Veg' },
      { np: 'फ्रेस फ्रुट', en: 'Fresh Fruit', tag: 'Veg' },
    ],
  },
  {
    npTitle: 'आईस क्रिम',
    enTitle: 'Ice Cream',
    items: [
      { np: 'स्ट्रवेरी', en: 'Strawberry Ice Cream', tag: 'Veg' },
      { np: 'भैनिला', en: 'Vanilla Ice Cream', tag: 'Veg' },
      { np: 'चकलेट', en: 'Chocolate Ice Cream', tag: 'Veg' },
    ],
  },
  {
    npTitle: 'अरु आइटम',
    enTitle: 'Other Items',
    items: [
      { np: 'पानी पुरी', en: 'Pani Puri', tag: 'Veg' },
      { np: 'चाट', en: 'Chaat', tag: 'Veg' },
      { np: 'पान', en: 'Paan', tag: 'Veg' },
      { np: 'भेज सुप', en: 'Veg Soup', tag: 'Veg' },
      { np: 'नन् भेज सुप', en: 'Non-Veg Soup', tag: 'Non-Veg' },
      { np: 'कोल्ड ड्रिङ्क्स', en: 'Cold Drinks (Coca-Cola, Fanta, Miranda, Dew, etc.)', tag: 'Veg' },
    ],
  },
];

const TAG_STYLE: Record<string, string> = {
  Veg:     'border-emerald-500/40 text-emerald-400 bg-emerald-500/5',
  'Non-Veg': 'border-red-500/40 text-red-400 bg-red-500/5',
};

// Short index labels for sidebar nav (number + both script titles)
const TAB_LABELS = SECTIONS.map((s, i) => ({
  index: i,
  npTitle: s.npTitle,
  enTitle: s.enTitle,
}));

export default function MenuPage() {
  const [active, setActive] = useState(0);
  const section = SECTIONS[active];

  return (
    <>
      <SEOHead
        title="Our Menu — Shree Ganesh Party Venue"
        description="Complete catering menu: Breakfast, Snacks, Mutton, Chicken, Buff, Pork, Fish, Main Course, Veg Curry, Dal, Non-Veg Dishes, Pickle, Salad, Dessert, Ice Cream and more."
        canonicalUrl={`${SITE_URL}/menu`}
      />

      <div className="bg-[#0a0a0a] pt-28 pb-20">

        {/* ── Page header ── */}
        <div className="mx-auto max-w-7xl px-4 mb-10">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="font-script text-gold text-2xl leading-none">Taste the Tradition</span>
            <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          <h1 className="text-center font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">
            Our Menu
          </h1>
          <p className="mt-3 text-center text-sm text-zinc-500 max-w-xl mx-auto leading-relaxed">
            Authentic flavours from Nepal and beyond — available for in-venue events and off-site catering.
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-4 flex flex-col lg:flex-row gap-6">

          {/* ── Left: section navigation ── */}
          <aside className="lg:w-56 xl:w-64 shrink-0">
            {/* Mobile: horizontal scroll tabs */}
            <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-px border border-gold/10 min-w-max">
                {TAB_LABELS.map(t => (
                  <button
                    key={t.index}
                    onClick={() => setActive(t.index)}
                    className={`flex flex-col items-start px-4 py-2.5 transition-all duration-150 whitespace-nowrap ${
                      active === t.index
                        ? 'bg-gold text-zinc-950'
                        : 'bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-gold/5'
                    }`}
                  >
                    <span className="text-[9px] font-semibold tracking-widest uppercase opacity-70 leading-none mb-0.5">
                      {String(t.index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-semibold">{t.enTitle}</span>
                    <span className="text-[10px] opacity-60">{t.npTitle}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: sticky vertical nav */}
            <nav className="hidden lg:block sticky top-24 border border-gold/10 overflow-hidden">
              {TAB_LABELS.map(t => (
                <button
                  key={t.index}
                  onClick={() => setActive(t.index)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] last:border-b-0 transition-all duration-150 ${
                    active === t.index
                      ? 'bg-gold/10 border-l-2 border-l-gold text-white'
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className={`shrink-0 text-[10px] font-mono w-5 text-right leading-none ${active === t.index ? 'text-gold' : 'text-zinc-700'}`}>
                    {String(t.index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-tight truncate">{t.enTitle}</p>
                    <p className="text-[10px] text-zinc-600 leading-tight truncate">{t.npTitle}</p>
                  </div>
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Right: items panel ── */}
          <div className="flex-1 min-w-0">
            {/* Section heading */}
            <div className="border border-gold/15 bg-gold/[0.03] px-5 py-4 mb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-[10px] text-gold/70 uppercase tracking-[0.2em] font-semibold mb-0.5">
                  {String(active + 1).padStart(2, '0')} / {String(SECTIONS.length).padStart(2, '0')}
                </p>
                <div className="flex items-baseline gap-3">
                  <h2 className="font-serif text-2xl font-bold text-white tracking-widest uppercase">
                    {section.enTitle}
                  </h2>
                  <span className="text-base text-gold/70 font-medium">{section.npTitle}</span>
                </div>
              </div>
              <span className="text-[11px] text-zinc-600">{section.items.length} items</span>
            </div>

            {/* Items grid */}
            <div className="grid gap-px sm:grid-cols-2 border border-white/[0.06]">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 px-5 py-4 bg-[#111111] hover:bg-[rgba(201,168,76,0.03)] transition-colors duration-150"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="shrink-0 text-[10px] font-mono text-zinc-700 mt-0.5 w-5 text-right">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      {/* English name — primary */}
                      <p className="text-sm font-medium text-zinc-100 leading-snug">{item.en}</p>
                      {/* Nepali name — secondary */}
                      <p className="text-xs text-zinc-600 mt-0.5 leading-snug">{item.np}</p>
                    </div>
                  </div>
                  {item.tag && (
                    <span className={`shrink-0 mt-0.5 border text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 ${TAG_STYLE[item.tag]}`}>
                      {item.tag === 'Veg' ? '● VEG' : '● NON-VEG'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Prev / Next nav */}
            <div className="flex items-center justify-between mt-4 gap-3">
              <button
                onClick={() => setActive(a => Math.max(0, a - 1))}
                disabled={active === 0}
                className="flex items-center gap-2 border border-white/[0.06] bg-[#111111] px-4 py-2 text-xs text-zinc-500 hover:text-zinc-200 hover:border-white/[0.12] transition disabled:opacity-25"
                style={{ borderRadius: '4px' }}
              >
                ← Previous
              </button>
              <span className="text-[11px] text-zinc-700">
                {active + 1} / {SECTIONS.length}
              </span>
              <button
                onClick={() => setActive(a => Math.min(SECTIONS.length - 1, a + 1))}
                disabled={active === SECTIONS.length - 1}
                className="flex items-center gap-2 border border-white/[0.06] bg-[#111111] px-4 py-2 text-xs text-zinc-500 hover:text-zinc-200 hover:border-white/[0.12] transition disabled:opacity-25"
                style={{ borderRadius: '4px' }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mx-auto max-w-7xl px-4 mt-16">
          <div className="border border-gold/15 bg-gold/[0.03] p-8 text-center">
            <span className="font-script text-gold text-xl block mb-2">Customise Your Feast</span>
            <h2 className="font-serif text-2xl font-bold text-white tracking-widest uppercase mb-3">
              Build Your Event Menu
            </h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-lg mx-auto">
              Mix and match from any section. Our team will craft the perfect spread for your event size and budget.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/booking"
                className="font-serif tracking-[0.14em] uppercase text-xs px-7 py-3 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150 shadow-[0_0_16px_rgba(201,168,76,0.2)]"
                style={{ borderRadius: '2px' }}
              >
                Book & Discuss Menu
              </Link>
              <a
                href="tel:+9779860117006"
                className="font-serif tracking-[0.14em] uppercase text-xs px-7 py-3 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150"
                style={{ borderRadius: '2px' }}
              >
                📞 {BUSINESS_PHONE}
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
