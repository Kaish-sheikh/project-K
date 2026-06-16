// =========================================
// EternalVow — Sample Wedding Data
// =========================================

export const coupleData = {
  partner1: {
    firstName: 'Sophia',
    lastName: 'Anderson',
    photo: null,
    bio: 'A passionate architect who believes every space tells a story. When she\'s not designing dream homes, you\'ll find her painting watercolors or hiking mountain trails.',
  },
  partner2: {
    firstName: 'James',
    lastName: 'Mitchell',
    photo: null,
    bio: 'A software engineer with a love for music and cooking. He proposed during a sunset sail off the coast of Santorini — the same place they had their first vacation together.',
  },
  hashtag: '#SophiaAndJamesForever',
  avatars: {
    bride: {
      skinTone: '#D4A574',
      hairStyle: 'wavy',
      hairColor: '#3B2314',
      outfitColor: '#FFFFFF',
      outfitStyle: 'western',
      height: 'average',
      accessory: 'veil',
    },
    groom: {
      skinTone: '#C19A6B',
      hairStyle: 'short',
      hairColor: '#1C1008',
      outfitColor: '#1A1A2E',
      outfitStyle: 'western',
      height: 'tall',
      accessory: 'bowtie',
    },
    showOnWebsite: true,
  },
  story: [
    {
      date: 'June 2020',
      title: 'How We Met',
      description: 'We met at a friend\'s rooftop dinner party in Brooklyn. James accidentally spilled his drink on Sophia\'s sketchbook, and the rest is history.',
      icon: 'heart',
    },
    {
      date: 'December 2021',
      title: 'First Trip Together',
      description: 'Our first trip to Santorini, Greece. We watched the sunset from Oia and knew this was the beginning of something extraordinary.',
      icon: 'plane',
    },
    {
      date: 'March 2023',
      title: 'Moving In Together',
      description: 'We adopted our golden retriever, Luna, and moved into our first apartment together in Manhattan.',
      icon: 'home',
    },
    {
      date: 'September 2025',
      title: 'The Proposal',
      description: 'James surprised Sophia with a sunset sail back in Santorini — right where it all began. She said yes before he even finished asking.',
      icon: 'sparkles',
    },
  ],
};

export const weddingDetails = {
  date: '2026-10-17T16:00:00',
  gallery: [],
  venue: {
    ceremony: {
      name: 'The Grand Botanical Gardens',
      address: '245 Garden Avenue, Charleston, SC 29401',
      time: '4:00 PM',
      description: 'Join us under the ancient oak canopy for an intimate ceremony surrounded by nature\'s beauty.',
      mapUrl: 'https://maps.google.com',
      photos: [],
    },
    reception: {
      name: 'The Atelier Ballroom',
      address: '180 Heritage Lane, Charleston, SC 29401',
      time: '6:30 PM',
      description: 'Dinner, dancing, and celebration in a stunning Art Deco ballroom with floor-to-ceiling windows.',
      mapUrl: 'https://maps.google.com',
      photos: [],
    },
  },
  dressCode: 'Black Tie Optional',
};

export const events = [
  {
    id: 1,
    name: 'Welcome Dinner',
    date: 'Friday, October 16',
    time: '7:00 PM',
    location: 'The Oyster House',
    address: '52 Market Street, Charleston, SC',
    description: 'Kick off the wedding weekend with a relaxed Southern dinner by the waterfront.',
    icon: 'utensils',
  },
  {
    id: 2,
    name: 'Wedding Ceremony',
    date: 'Saturday, October 17',
    time: '4:00 PM',
    location: 'The Grand Botanical Gardens',
    address: '245 Garden Avenue, Charleston, SC',
    description: 'Watch us say "I do" beneath the ancient oaks. Please arrive 30 minutes early.',
    icon: 'heart',
  },
  {
    id: 3,
    name: 'Cocktail Hour',
    date: 'Saturday, October 17',
    time: '5:30 PM',
    location: 'The Atelier Terrace',
    address: '180 Heritage Lane, Charleston, SC',
    description: 'Enjoy craft cocktails and hors d\'oeuvres on the terrace as the sun sets.',
    icon: 'wine',
  },
  {
    id: 4,
    name: 'Reception & Dinner',
    date: 'Saturday, October 17',
    time: '6:30 PM',
    location: 'The Atelier Ballroom',
    address: '180 Heritage Lane, Charleston, SC',
    description: 'Dinner, toasts, and dancing the night away.',
    icon: 'music',
  },
  {
    id: 5,
    name: 'Farewell Brunch',
    date: 'Sunday, October 18',
    time: '10:00 AM',
    location: 'The Palmetto Inn',
    address: '88 Bay Street, Charleston, SC',
    description: 'Join us for a relaxed farewell brunch before heading home.',
    icon: 'coffee',
  },
];

export const weddingParty = [
  {
    name: 'Emily Chen',
    role: 'Maid of Honor',
    relation: 'Best Friend since college',
    side: 'bride',
  },
  {
    name: 'David Mitchell',
    role: 'Best Man',
    relation: 'Brother of the Groom',
    side: 'groom',
  },
  {
    name: 'Olivia Santos',
    role: 'Bridesmaid',
    relation: 'Childhood Friend',
    side: 'bride',
  },
  {
    name: 'Michael Park',
    role: 'Groomsman',
    relation: 'College Roommate',
    side: 'groom',
  },
  {
    name: 'Isabella Wright',
    role: 'Bridesmaid',
    relation: 'Sister of the Bride',
    side: 'bride',
  },
  {
    name: 'Chris Anderson',
    role: 'Groomsman',
    relation: 'Work Colleague',
    side: 'groom',
  },
];

export const guestList = [
  { id: 1, name: 'Sarah & Thomas Chen', email: 'sarah@email.com', rsvp: 'attending', meal: 'fish', guests: 2, message: 'So excited for you both!' },
  { id: 2, name: 'Robert Williams', email: 'rob@email.com', rsvp: 'attending', meal: 'beef', guests: 1, message: 'Wouldn\'t miss it!' },
  { id: 3, name: 'Maria & Carlos Garcia', email: 'maria@email.com', rsvp: 'attending', meal: 'vegetarian', guests: 2, message: 'Love you guys!' },
  { id: 4, name: 'Jennifer Lee', email: 'jen@email.com', rsvp: 'declined', meal: null, guests: 0, message: 'So sorry, will be traveling.' },
  { id: 5, name: 'Andrew & Priya Patel', email: 'andrew@email.com', rsvp: 'attending', meal: 'chicken', guests: 2, message: 'Can\'t wait to celebrate!' },
  { id: 6, name: 'Kate Morrison', email: 'kate@email.com', rsvp: 'pending', meal: null, guests: 1, message: '' },
  { id: 7, name: 'Daniel & Lisa Kim', email: 'daniel@email.com', rsvp: 'attending', meal: 'fish', guests: 2, message: 'We are thrilled!' },
  { id: 8, name: 'Emma Thompson', email: 'emma@email.com', rsvp: 'pending', meal: null, guests: 1, message: '' },
  { id: 9, name: 'Ryan & Amy Foster', email: 'ryan@email.com', rsvp: 'attending', meal: 'beef', guests: 2, message: 'Congratulations!' },
  { id: 10, name: 'Sophie Laurent', email: 'sophie@email.com', rsvp: 'declined', meal: null, guests: 0, message: 'Will be in Paris. Sending love!' },
  { id: 11, name: 'Marcus & Julie Brown', email: 'marcus@email.com', rsvp: 'attending', meal: 'vegetarian', guests: 2, message: 'Over the moon for you!' },
  { id: 12, name: 'Natalie Rivera', email: 'natalie@email.com', rsvp: 'pending', meal: null, guests: 1, message: '' },
];

export const faqItems = [
  {
    question: 'What is the dress code?',
    answer: 'Black Tie Optional. We want you to feel elegant and comfortable. Think cocktail dresses or suits — but no need for a tuxedo unless you want to!',
  },
  {
    question: 'Can I bring a plus one?',
    answer: 'Due to venue capacity, we\'ve reserved seating specifically for each guest. Please check your invitation to confirm if a plus one is included.',
  },
  {
    question: 'Is the venue wheelchair accessible?',
    answer: 'Yes! Both the ceremony and reception venues are fully wheelchair accessible. Please let us know if you have any specific accessibility needs.',
  },
  {
    question: 'Will there be parking available?',
    answer: 'Complimentary valet parking is available at both venues. There is also a parking garage within a 2-minute walk.',
  },
  {
    question: 'Are children welcome?',
    answer: 'While we love your little ones, this will be an adults-only celebration. We hope this gives you a great excuse for a date night!',
  },
  {
    question: 'What if I have dietary restrictions?',
    answer: 'Please let us know on your RSVP form! Our caterer can accommodate vegetarian, vegan, gluten-free, and allergy-specific meals.',
  },
];

export const registryItems = [
  { name: 'Honeymoon Fund', store: 'Zola', url: '#', icon: 'plane' },
  { name: 'Kitchen Essentials', store: 'Williams Sonoma', url: '#', icon: 'chefHat' },
  { name: 'Home Decor', store: 'Crate & Barrel', url: '#', icon: 'home' },
  { name: 'Experience Fund', store: 'EternalVow', url: '#', icon: 'gift' },
];

export const templateThemes = [
  {
    id: 'serenity',
    name: 'Serenity',
    tagline: 'Minimalist Modern',
    description: 'Clean lines, generous whitespace, and understated elegance. For the couple who believes less is more.',
    colors: ['#F5F0EB', '#2C3E50', '#A8B5A2', '#D4C5B9', '#E8DDD3'],
    fonts: ['Cormorant Garamond', 'Montserrat'],
    features: ['Scroll-snap navigation', 'Fade-in animations', 'Full-width photo sections'],
    category: 'Modern',
    popular: true,
  },
  {
    id: 'opulence',
    name: 'Opulence',
    tagline: 'Luxury Gold & Dark',
    description: 'Art Deco grandeur meets modern sophistication. Rich charcoal backgrounds with shimmering gold accents.',
    colors: ['#1A1A2E', '#D4AF37', '#F5F0EB', '#2C2C3E', '#C9B896'],
    fonts: ['Playfair Display', 'Raleway'],
    features: ['Gold shimmer effects', 'Glassmorphism cards', 'Cinematic hero'],
    category: 'Luxury',
    popular: true,
  },
  {
    id: 'garden',
    name: 'Garden',
    tagline: 'Romantic Botanical',
    description: 'Soft pastels, hand-painted florals, and a dreamy romantic atmosphere. Perfect for a garden or outdoor celebration.',
    colors: ['#FDF6F0', '#D4A0A0', '#8BA888', '#F2E0D0', '#C9D4C5'],
    fonts: ['Great Vibes', 'Lato'],
    features: ['Parallax botanicals', 'Watercolor accents', 'Handwritten typography'],
    category: 'Romantic',
    popular: false,
  },
  {
    id: 'desiroyal',
    name: 'Desi Royal',
    tagline: 'Indian Wedding Grandeur',
    description: 'Celebrate with mandala motifs, rich reds & golds, and dedicated sections for Mehndi, Sangeet, Haldi & more.',
    colors: ['#1A0A0A', '#C41E3A', '#D4AF37', '#800020', '#FDF5E6'],
    fonts: ['Yatra One', 'Poppins'],
    features: ['Mandala patterns', 'Indian ceremony sections', 'Gold ornamental borders'],
    category: 'Cultural',
    popular: true,
  },
];

export const testimonials = [
  {
    couple: 'Emma & Liam',
    location: 'Nashville, TN',
    quote: 'EternalVow made our wedding website feel like a luxury experience. Our guests couldn\'t stop complimenting it!',
    template: 'Serenity',
    rating: 5,
  },
  {
    couple: 'Aisha & Marcus',
    location: 'New York, NY',
    quote: 'The Opulence theme was exactly what we envisioned — elegant, bold, and completely us. The RSVP management saved us so much time.',
    template: 'Opulence',
    rating: 5,
  },
  {
    couple: 'Priya & Daniel',
    location: 'San Francisco, CA',
    quote: 'We tried three other platforms before finding EternalVow. Nothing else came close to this level of design quality.',
    template: 'Garden',
    rating: 5,
  },
  {
    couple: 'Claire & Sophie',
    location: 'Austin, TX',
    quote: 'From customization to guest management — everything was seamless. Our wedding planner even started recommending EternalVow to all her clients.',
    template: 'Serenity',
    rating: 5,
  },
];
