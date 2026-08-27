import img1Webp from '@/assets/imagesandvedioes/1.webp';
import img2Webp from '@/assets/imagesandvedioes/2.webp';
import img2Png from '@/assets/imagesandvedioes/2.png';
import img3Png from '@/assets/imagesandvedioes/3.png';
import img4Png from '@/assets/imagesandvedioes/4.png';
import img48Png from '@/assets/imagesandvedioes/48.png';
import img5Jpg from '@/assets/imagesandvedioes/5.jpg';
import img6Jpg from '@/assets/imagesandvedioes/6.jpg';
import img7Jpg from '@/assets/imagesandvedioes/7.jpg';
import type { GalleryImage } from '@/types';

export const LOCAL_PHOTOS: GalleryImage[] = [
  {
    _id: 'local-1',
    imageUrl: img1Webp,
    category: 'venue',
    title: 'Banquet Hall Interior',
    altText: 'Shree Ganesh Party Venue banquet hall interior in Bhaktapur',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'local-2',
    imageUrl: img2Webp,
    category: 'venue',
    title: 'Hall Setup & Lighting',
    altText: 'Shree Ganesh Party Venue hall setup for events in Suryabinayak, Bhaktapur',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'local-3',
    imageUrl: img2Png,
    category: 'decoration',
    title: 'Floral & Stage Decoration',
    altText: 'Event decoration setup at Shree Ganesh Party Venue, Bhaktapur',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'local-4',
    imageUrl: img3Png,
    category: 'wedding',
    title: 'Wedding Ceremony Mandap',
    altText: 'Wedding ceremony setup at Shree Ganesh Party Venue near Suryabinayak Ganesh Mandir',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'local-5',
    imageUrl: img4Png,
    category: 'reception',
    title: 'Grand Reception Dining',
    altText: 'Reception event at Shree Ganesh Party Venue banquet hall, Bhaktapur',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'local-6',
    imageUrl: img48Png,
    category: 'venue',
    title: 'Event Hall Arrangement',
    altText: 'Spacious celebration hall arrangement at Shree Ganesh Party Venue',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'local-7',
    imageUrl: img5Jpg,
    category: 'catering',
    title: 'Multi-Cuisine Buffet',
    altText: 'Catering food buffet at Shree Ganesh Party Venue and Catering Service, Bhaktapur',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'local-8',
    imageUrl: img6Jpg,
    category: 'catering',
    title: 'Nepali & Newari Feast',
    altText: 'Nepali and Newari food catering at Shree Ganesh Party Venue in Bhaktapur',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'local-9',
    imageUrl: img7Jpg,
    category: 'venue',
    title: 'Venue Exterior & Entrance',
    altText: 'Shree Ganesh Party Venue exterior and entrance in Suryabinayak, Bhaktapur',
    featured: true,
    createdAt: new Date().toISOString(),
  },
];
