import { useState } from 'react';
import { SEOHead } from '@/components/shared/SEOHead';
import { Link } from 'react-router-dom';

// ── Complete menu extracted from the physical Shree Ganesh order pad ──
const MENU: Record<string, { name: string; tag?: string }[]> = {
  'Fast Food': [
    { name: 'Juice' },
    { name: 'Pizza & Cake' },
    { name: 'Masala Omelette' },
    { name: 'Cheese Bread Butter Egg Jam' },
    { name: 'Usine Aloo Bhuja' },
    { name: 'Aloo Jeera' },
    { name: 'Cut Bread Shot' },
    { name: 'Pakoda' },
    { name: 'Cabbage' },
    { name: 'Scrambled Egg' },
    { name: 'Kerao Masala' },
    { name: 'Kerao & Aloo Masala' },
  ],
  'Snacks': [
    { name: 'French Fries' },
    { name: 'Taas Finger' },
    { name: 'Veg Tempura', tag: 'Veg' },
    { name: 'Aloo Chilli' },
    { name: 'Badam Sadeko' },
    { name: 'Papod' },
    { name: 'Prawn Cracker' },
    { name: 'Paneer Chilli', tag: 'Veg' },
    { name: 'Mushroom Pakoda', tag: 'Veg' },
    { name: 'Momo — Veg / Chicken / Buff' },
    { name: 'Stick — Veg / Peas / Paneer / Fruit' },
    { name: 'Wonton — Veg / Buff / Chicken' },
  ],
  'Noodle Items': [
    { name: 'Masala Khana' },
    { name: 'Veg Pulao', tag: 'Veg' },
    { name: 'Noodle Roll' },
  ],
  'Mutton Items': [
    { name: 'Sekuwa' },
    { name: 'Tawa' },
    { name: 'Mutton (Bhutan)' },
    { name: 'Fokso Fry' },
  ],
  'Chicken Items': [
    { name: 'Chilli' },
    { name: 'Sekuwa' },
    { name: 'Sausage' },
    { name: 'Drum Stick' },
    { name: 'Tandoori' },
    { name: 'Vi Vi Ku' },
    { name: 'Fried' },
    { name: 'Meat Ball' },
    { name: 'Sardiyu' },
    { name: 'Haku Chhoyela' },
  ],
  'Fish Items': [
    { name: 'Tikka' },
    { name: 'Finger' },
    { name: 'Fry' },
  ],
  'Buff Items': [
    { name: 'Chilli' },
    { name: 'Sekuwa' },
    { name: 'Vi Vi Ku' },
    { name: 'Tawa' },
    { name: 'Sarjeu' },
    { name: 'Haku — Masu / Mana' },
    { name: 'Chhoyela' },
    { name: 'Sekuwa' },
    { name: 'Bhat Ball' },
  ],
  'Pork Items': [
    { name: 'Chilli' },
    { name: 'Sekuwa' },
    { name: 'Vi Vi Ku' },
    { name: 'Sekuwa' },
    { name: 'Pork Sainis' },
  ],
  'Main Course': [
    { name: 'Butter Pulao', tag: 'Veg' },
    { name: 'Kashmiri Pulao', tag: 'Veg' },
    { name: 'Jeera Pulao', tag: 'Veg' },
    { name: 'Biryani Pulao' },
    { name: 'Noodles' },
    { name: 'Plain Naan / Butter Naan', tag: 'Veg' },
    { name: 'Rumali Roti', tag: 'Veg' },
    { name: 'Veg Chowmein', tag: 'Veg' },
    { name: 'Rotisserie' },
    { name: 'Matri' },
  ],
  'Nepali Parikaar': [
    { name: 'Mutton Masala' },
    { name: 'Butter Tari' },
    { name: 'Chicken Tari' },
    { name: 'Chicken Fry' },
    { name: 'Chicken Kari' },
    { name: 'Chicken Butter Masala' },
    { name: 'Chicken Tandoori' },
    { name: 'Veg Fry', tag: 'Veg' },
    { name: 'Veg Mixed Veg', tag: 'Veg' },
    { name: 'Makha Fried' },
    { name: 'Buk Tari' },
    { name: 'Buk Kari' },
    { name: 'Ameli Tawa' },
    { name: 'Pork Kari' },
  ],
  'Bhej Kari (Veg Curry)': [
    { name: 'Navratan Kari', tag: 'Veg' },
    { name: 'Palak Paneer', tag: 'Veg' },
    { name: 'Aloo Cauliflower Fry', tag: 'Veg' },
    { name: 'Matar Paneer', tag: 'Veg' },
    { name: 'Mix Bhej Kari', tag: 'Veg' },
    { name: 'Kachher Fry', tag: 'Veg' },
    { name: 'Parbal Korma', tag: 'Veg' },
    { name: 'Parbal Fry', tag: 'Veg' },
    { name: 'Matar Kofta', tag: 'Veg' },
    { name: 'Matar Paneer Khyau Kari', tag: 'Veg' },
    { name: 'Pokala Saag', tag: 'Veg' },
    { name: 'Thai Saag', tag: 'Veg' },
    { name: 'Rayon Saag', tag: 'Veg' },
    { name: 'Chaura, Palugi, Rayo', tag: 'Veg' },
  ],
  'Daal': [
    { name: 'Rajma Dal', tag: 'Veg' },
    { name: 'Fry Dal', tag: 'Veg' },
    { name: 'Mix Dal', tag: 'Veg' },
    { name: 'Dal Makhani', tag: 'Veg' },
    { name: 'Matar Masala', tag: 'Veg' },
  ],
  'Achar (Pickle)': [
    { name: 'Mix Achar Nepali', tag: 'Veg' },
    { name: 'Aloo Achar', tag: 'Veg' },
    { name: 'Gundruk Sadeki', tag: 'Veg' },
    { name: 'Lapsi Julibho & Nimilo', tag: 'Veg' },
    { name: 'Golbheda Achar — Golbheda Dhau / Golbheda Tofu / Golbheda Matar / Golbheda Paneer', tag: 'Veg' },
  ],
  'Salad': [
    { name: 'Hariyou Salad', tag: 'Veg' },
    { name: 'Russian Salad', tag: 'Veg' },
  ],
  'Ice Cream Items': [
    { name: 'Pani Puri', tag: 'Veg' },
    { name: 'Bhel' },
    { name: 'Sev' },
    { name: 'Bhel — Nao Bhej / Cold Dinkha' },
  ],
  'Dessert': [
    { name: 'Gajar ko Halwa', tag: 'Veg' },
    { name: 'Rasbari', tag: 'Veg' },
    { name: 'Lalmohon', tag: 'Veg' },
    { name: 'Juju Dhau', tag: 'Veg' },
    { name: 'Barfi', tag: 'Veg' },
    { name: 'Mitho Dahi', tag: 'Veg' },
    { name: 'French Foot' },
  ],
};

const TABS = Object.keys(MENU);

const TAG_COLORS: Record<string, string> = {
  Veg: 'text-green-400 border-green-400/30 bg-green-400/5',
};

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const items = MENU[activeTab] ?? [];

  return (
    <>
      <SEOHead
        title="Our Menu — Shree Ganesh Party Venue"
        description="Complete catering menu at Shree Ganesh Party Venue: Nepali, Newari, Mutton, Chicken, Buff, Veg curries, Snacks, Desserts and more."
        canonicalUrl="https://shreeganeshsharma.com/menu"
      />

      <div className="bg-[#0a0a0a] pt-28 pb-20 px-4">
        <div className="mx-auto max-w-6xl">

          {/* Section header */}
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-script text-gold text-2xl leading-none">Taste the Tradition</span>
              <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">
              Our Menu
            </h1>
            <p className="mt-4 font-sans text-base italic text-zinc-400 max-w-xl mx-auto">
              Authentic flavours crafted with love — from traditional Nepali feasts to international cuisines.
              All items available for in-venue events and off-site catering.
            </p>
          </div>

          {/* Category tab bar — scrollable on mobile */}
          <div className="overflow-x-auto pb-1 mb-8 -mx-4 px-4">
            <div className="flex gap-px border border-gold/10 min-w-max">
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`font-serif text-[10px] sm:text-xs tracking-[0.12em] uppercase px-4 py-3 whitespace-nowrap transition-all duration-150 ${
                    activeTab === tab
                      ? 'bg-gold text-zinc-950 font-semibold'
                      : 'bg-[rgba(255,255,255,0.02)] text-zinc-400 hover:text-white hover:bg-[rgba(201,168,76,0.05)]'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Items grid */}
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 border border-gold/10">
            {items.map((item, i) => (
              <div key={i}
                className="flex items-center justify-between px-5 py-4 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(201,168,76,0.04)] transition-colors duration-150">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-gold/40 font-serif text-xs shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-sans text-sm text-zinc-200 leading-snug">{item.name}</span>
                </div>
                {item.tag && (
                  <span className={`ml-3 shrink-0 text-[10px] font-sans font-semibold tracking-widest uppercase border px-1.5 py-0.5 ${TAG_COLORS[item.tag]}`}>
                    {item.tag}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Item count */}
          <p className="mt-4 text-xs font-sans text-zinc-600 text-right">
            {items.length} items in {activeTab}
          </p>

          {/* CTA */}
          <div className="mt-14 border border-gold/15 bg-[rgba(201,168,76,0.03)] p-8 text-center">
            <span className="font-script text-gold text-xl block mb-2">Customise Your Feast</span>
            <h2 className="font-serif text-2xl font-bold text-white tracking-widest uppercase mb-3">
              Build Your Event Menu
            </h2>
            <p className="font-sans text-zinc-400 text-base mb-6 max-w-lg mx-auto">
              Mix and match from any category. Our team will work with you to create the perfect spread for your event size and budget.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/booking"
                className="font-serif tracking-[0.14em] uppercase text-xs px-7 py-3 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150 shadow-[0_0_16px_rgba(201,168,76,0.2)]"
                style={{ borderRadius: '2px' }}>
                Book & Discuss Menu
              </Link>
              <a href="tel:+9779851337076"
                className="font-serif tracking-[0.14em] uppercase text-xs px-7 py-3 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150"
                style={{ borderRadius: '2px' }}>
                📞 Call Us Directly
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
