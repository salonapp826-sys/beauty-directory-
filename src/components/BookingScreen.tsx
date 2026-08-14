import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab } from '../types';

// Theme styling map
export interface ThemeStyles {
  primary: string;
  primaryHover: string;
  bgLight: string;
  bgDark: string;
  cardLight: string;
  cardDark: string;
  textLight: string;
  textDark: string;
  accentLight: string;
  accentDark: string;
  borderLight: string;
  borderDark: string;
  accentColor: string;
}

export const THEME_MAP: Record<string, ThemeStyles> = {
  barber: {
    primary: 'bg-[#8c6239]',
    primaryHover: 'hover:bg-[#704d2b]',
    bgLight: 'bg-[#FAF6F0]',
    bgDark: 'bg-[#1C1713]',
    cardLight: 'bg-white border-[#E6DFD5]',
    cardDark: 'bg-[#29221C] border-[#3B3229]',
    textLight: 'text-[#3E2D20]',
    textDark: 'text-[#F2EFE9]',
    accentLight: 'bg-[#F2EFE9] text-[#8c6239]',
    accentDark: 'bg-[#3B3229] text-[#E6DFD5]',
    borderLight: 'border-[#E6DFD5]',
    borderDark: 'border-[#3B3229]',
    accentColor: '#8c6239',
  },
  hair_studio: {
    primary: 'bg-[#8e004b]',
    primaryHover: 'hover:bg-[#b90064]',
    bgLight: 'bg-[#FCF7F9]',
    bgDark: 'bg-[#1A1015]',
    cardLight: 'bg-white border-[#FDE7F3]',
    cardDark: 'bg-[#2B1B22] border-[#422934]',
    textLight: 'text-[#1c1b1b]',
    textDark: 'text-[#FCEBF3]',
    accentLight: 'bg-[#FDE7F3] text-[#8e004b]',
    accentDark: 'bg-[#422934] text-[#FDE7F3]',
    borderLight: 'border-[#F0D5E4]',
    borderDark: 'border-[#422934]',
    accentColor: '#8e004b',
  },
  beauty_spa: {
    primary: 'bg-[#155e54]',
    primaryHover: 'hover:bg-[#0f463e]',
    bgLight: 'bg-[#F4F9F8]',
    bgDark: 'bg-[#0E1514]',
    cardLight: 'bg-white border-[#D5ECE8]',
    cardDark: 'bg-[#182321] border-[#253633]',
    textLight: 'text-[#1E302D]',
    textDark: 'text-[#EAF5F3]',
    accentLight: 'bg-[#E1F3F0] text-[#155e54]',
    accentDark: 'bg-[#253633] text-[#A6DDD3]',
    borderLight: 'border-[#CCE8E3]',
    borderDark: 'border-[#253633]',
    accentColor: '#155e54',
  },
  family: {
    primary: 'bg-[#d97706]',
    primaryHover: 'hover:bg-[#b45309]',
    bgLight: 'bg-[#FFFDF9]',
    bgDark: 'bg-[#1C1A16]',
    cardLight: 'bg-white border-[#FEF3C7]',
    cardDark: 'bg-[#2B2720] border-[#3D372E]',
    textLight: 'text-[#451A03]',
    textDark: 'text-[#FEF3C7]',
    accentLight: 'bg-[#FEF3C7] text-[#d97706]',
    accentDark: 'bg-[#3D372E] text-[#FDE68A]',
    borderLight: 'border-[#F59E0B]/20',
    borderDark: 'border-[#3D372E]',
    accentColor: '#d97706',
  },
  nail_lash: {
    primary: 'bg-[#db2777]',
    primaryHover: 'hover:bg-[#be185d]',
    bgLight: 'bg-[#FFF8FA]',
    bgDark: 'bg-[#1C1216]',
    cardLight: 'bg-white border-[#FCE7F3]',
    cardDark: 'bg-[#2C1C23] border-[#442835]',
    textLight: 'text-[#501331]',
    textDark: 'text-[#FCE7F3]',
    accentLight: 'bg-[#FCE7F3] text-[#db2777]',
    accentDark: 'bg-[#442835] text-[#FCE7F3]',
    borderLight: 'border-[#F9A8D4]/20',
    borderDark: 'border-[#442835]',
    accentColor: '#db2777',
  }
};

export interface SalonStylist {
  id: string;
  name: string;
  nameHi: string;
  role: string;
  roleHi: string;
  rating: number;
  avatar: string;
}

export interface SalonService {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  category: string;
  categoryHi: string;
  price: number;
  duration: number;
  activeOffer?: {
    code: string;
    discountPercent: number;
    description: string;
    descriptionHi: string;
  };
  image: string;
  icon: string;
  theme: 'barber' | 'hair_studio' | 'beauty_spa' | 'family' | 'nail_lash';
  availableStaff: string[];
}

export const SALON_STYLISTS: SalonStylist[] = [
  { id: 'st-1', name: 'Amit Kumar', nameHi: 'अमित कुमार', role: 'Master Barber', roleHi: 'मास्टर नाई', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-2', name: 'Rohan Sharma', nameHi: 'रोहन शर्मा', role: 'Kid Specialist', roleHi: 'चाइल्ड स्पेशलिस्ट', rating: 4.8, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-3', name: 'Vikram Singh', nameHi: 'विक्रम सिंह', role: 'Senior Stylist', roleHi: 'सीनियर स्टाइलिस्ट', rating: 4.7, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-4', name: 'Priya Patel', nameHi: 'प्रिया पटेल', role: 'Senior Color Director', roleHi: 'सीनियर कलर डायरेक्टर', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-5', name: 'Sneha Reddy', nameHi: 'स्नेहा रेड्डी', role: 'Master Hair Artist', roleHi: 'मास्टर हेयर आर्टिस्ट', rating: 4.8, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-6', name: 'Arjun Mehta', nameHi: 'अर्जुन मेहता', role: 'Keratin Expert', roleHi: 'केराटिन एक्सपर्ट', rating: 4.75, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-7', name: 'Neha Gupta', nameHi: 'नेहा गुप्ता', role: 'Senior Cosmetologist', roleHi: 'सीनियर कॉस्मेटोलॉजिस्ट', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-8', name: 'Aisha Khan', nameHi: 'आयशा खान', role: 'Spa Therapist', roleHi: 'स्पा थेरेपिस्ट', rating: 4.8, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-9', name: 'Ravi Verma', nameHi: 'रवि वर्मा', role: 'Massage Specialist', roleHi: 'मसाज स्पेशलिस्ट', rating: 4.8, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-10', name: 'Divya Sen', nameHi: 'दिव्या सेन', role: 'Master Nail Artist', roleHi: 'मास्टर नेल आर्टिस्ट', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-11', name: 'Kiran Joshi', nameHi: 'किरण जोशी', role: 'Lash Expert', roleHi: 'लैश एक्सपर्ट', rating: 4.8, avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=200' }
];

export const SALON_SERVICES: SalonService[] = [
  // BARBER SERVICES
  {
    id: 'b-1',
    name: 'Classic Beard Sculpt & Hot Towel',
    nameHi: 'क्लासिक दाढ़ी स्टाइलिंग और गर्म तौलिया',
    description: 'Precision razor beard shaping with hydrating organic balm massage and a deeply relaxing hot towel facial therapy.',
    descriptionHi: 'मॉइस्चराइजिंग बाम मालिश और आरामदायक गर्म तौलिया फेशियल थेरेपी के साथ सटीक दाढ़ी शेपिंग।',
    category: 'Beard Grooming',
    categoryHi: 'दाढ़ी संवारना',
    price: 450,
    duration: 30,
    activeOffer: { code: 'BARBER15', discountPercent: 15, description: '15% Off on Beard Spa', descriptionHi: 'दाढ़ी स्पा पर 15% की छूट' },
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600',
    icon: 'content_cut',
    theme: 'barber',
    availableStaff: ['st-1', 'st-2']
  },
  {
    id: 'b-2',
    name: 'Royal Gentleman Cut & Wash',
    nameHi: 'रॉयल जेंटलमैन हेयरकट और वॉश',
    description: 'Personalized style consultation, custom shear cut, invigorating tea tree shampoo scalp scrub, and pomade styling.',
    descriptionHi: 'व्यक्तिगत स्टाइल कंसल्टेशन, कस्टम हेयरकट, ताज़ा टी ट्री शैम्पू स्कैल्प स्क्रब और पोमेड हेयर स्टाइलिंग।',
    category: 'Haircuts',
    categoryHi: 'बाल काटना',
    price: 650,
    duration: 45,
    activeOffer: { code: 'GENT40', discountPercent: 10, description: '₹65 Flat Discount Applied', descriptionHi: '₹65 सीधे डिस्काउंट कोड' },
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600',
    icon: 'brush',
    theme: 'barber',
    availableStaff: ['st-1', 'st-3']
  },
  {
    id: 'b-3',
    name: 'Premium Charcoal Detan Beard Spa',
    nameHi: 'प्रीमियम चारकोल डिटैन दाढ़ी स्पा',
    description: 'Rejuvenating active charcoal scrub for detanning skin beneath beard, followed by essential oil conditioning.',
    descriptionHi: 'दाढ़ी के नीचे की त्वचा के लिए रीजुवेनेटिंग एक्टिव चारकोल स्क्रब और तेलों से कंडीशनिंग।',
    category: 'Beard Grooming',
    categoryHi: 'दाढ़ी संवारना',
    price: 800,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&q=80&w=600',
    icon: 'medical_services',
    theme: 'barber',
    availableStaff: ['st-2', 'st-3']
  },

  // HAIR STUDIO SERVICES
  {
    id: 'h-1',
    name: 'Luxury Balayage Painting',
    nameHi: 'लक्जरी बलेयाज पेंटिंग',
    description: 'Hand-painted dimensional highlights customized to contour your face shape, incorporating root shadow for natural regrowth.',
    descriptionHi: 'प्राकृतिक बालों के विकास के लिए रूट शैडो के साथ चेहरे के आकार के अनुसार हाथ से की जाने वाली लक्जरी बलेयाज हाइलाइट्स।',
    category: 'Hair Coloring',
    categoryHi: 'बालों का रंग',
    price: 4200,
    duration: 150,
    activeOffer: { code: 'COLOR20', discountPercent: 20, description: '20% Off Premium Balayage', descriptionHi: 'प्रीमियम बलेयाज पर 20% की छूट' },
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600',
    icon: 'palette',
    theme: 'hair_studio',
    availableStaff: ['st-4', 'st-5']
  },
  {
    id: 'h-2',
    name: 'Advanced Keratin Infusion Therapy',
    nameHi: 'एडवांस्ड केराटिन इन्फ्यूजन थेरेपी',
    description: 'Deep reconstructive smoothing treatment utilizing premium active keratin to eliminate frizz and add intense mirror shine for 12+ weeks.',
    descriptionHi: 'फ्रिज़ को दूर करने और 12+ हफ्तों तक शानदार मिरर चमक जोड़ने के लिए प्रीमियम सक्रिय केराटिन का उपयोग करके डीप हेयर ट्रीटमेंट।',
    category: 'Treatments',
    categoryHi: 'बालों का उपचार',
    price: 5500,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    icon: 'auto_awesome',
    theme: 'hair_studio',
    availableStaff: ['st-4', 'st-6']
  },
  {
    id: 'h-3',
    name: 'Vedic Organic Scalp Rejuvenation',
    nameHi: 'वैदिक ऑर्गेनिक स्कैल्प नवीनीकरण',
    description: 'Deep therapeutic herbal wash, rosemary oil hair-follicle steam activation, and relaxation acupressure massage.',
    descriptionHi: 'आयुर्वेदिक हर्बल हेयर वॉश, रोजमेरी ऑयल फॉलिकल स्टीम और डीप रिलैक्सिंग एक्यूप्रेशर सिर की मालिश।',
    category: 'Treatments',
    categoryHi: 'बालों का उपचार',
    price: 1800,
    duration: 60,
    activeOffer: { code: 'VEDIC15', discountPercent: 15, description: '15% Off Scalp Wellness', descriptionHi: 'स्कैल्प वेलनेस पर 15% की छूट' },
    image: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=600',
    icon: 'spa',
    theme: 'hair_studio',
    availableStaff: ['st-5', 'st-6']
  },

  // BEAUTY / SPA SERVICES
  {
    id: 's-1',
    name: 'Hydra Facial Luxe Glow',
    nameHi: 'हाइड्रा फेशियल लक्स ग्लो',
    description: 'Multi-stage skin resurfacing with active vortex extractions, medical-grade moisture infusion, and antioxidant nourishment for supreme glass skin glow.',
    descriptionHi: 'उत्कृष्ट ग्लास स्किन ग्लो के लिए डीप वोर्टेक्स एक्सट्रैक्शन, हाइड्रेशन और एंटीऑक्सीडेंट पोषण के साथ मल्टी-स्टेज स्किन ट्रीटमेंट।',
    category: 'Facial Care',
    categoryHi: 'चेहरे की देखभाल',
    price: 2900,
    duration: 60,
    activeOffer: { code: 'SPA15', discountPercent: 15, description: '15% Off Ultimate Facial Spa', descriptionHi: 'फेशियल स्पा पर 15% की छूट' },
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600',
    icon: 'face',
    theme: 'beauty_spa',
    availableStaff: ['st-7', 'st-8']
  },
  {
    id: 's-2',
    name: 'Aromatherapy Deep Tissue Massage',
    nameHi: 'अरोमाथेरेपी डीप टिश्यू मसाज',
    description: 'Full-body relaxation therapeutic massage focusing on releasing muscular knots using custom organic lavender, eucalyptus, and chamomile oils.',
    descriptionHi: 'ऑर्गेनिक लैवेंडर, नीलगिरी और कैमोमाइल तेलों का उपयोग करके मांसपेशियों के दर्द और तनाव को दूर करने वाला पूरे शरीर का मसाज थेरेपी।',
    category: 'Body Spa',
    categoryHi: 'बॉडी स्पा',
    price: 3500,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600',
    icon: 'self_improvement',
    theme: 'beauty_spa',
    availableStaff: ['st-8', 'st-9']
  },

  // FAMILY SERVICES
  {
    id: 'f-1',
    name: 'Mom & Me Princess Hair Spa',
    nameHi: 'मॉम एंड मी प्रिंसेस हेयर स्पा',
    description: 'Coordinated mother-daughter style packages including gentle hydrating scalp massages, nourishing treatments, and customized blow-dries.',
    descriptionHi: 'माताओं और बेटियों के लिए विशेष रूप से समन्वित कोमल हाइड्रेटिंग स्कैल्प मसाज, हेयर नरिशिंग स्पा और स्टाइलिश ब्लो-ड्राई पैकेज।',
    category: 'Combo Packages',
    categoryHi: 'कॉम्बो पैकेज',
    price: 1800,
    duration: 75,
    activeOffer: { code: 'FAMILY25', discountPercent: 25, description: '25% Off Mother-Child Combo', descriptionHi: 'मदर-चाइल्ड कॉम्बो पर 25% की छूट' },
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600',
    icon: 'groups',
    theme: 'family',
    availableStaff: ['st-3', 'st-5']
  },
  {
    id: 'f-2',
    name: 'Kids Playful Styling & Hair Trim',
    nameHi: 'बच्चों का चंचल हेयर ट्रिम और स्टाइलिंग',
    description: 'Fun, trauma-free styling session on customized race-car styling chairs while watching cartoons, followed by a gentle, clean scissors trim.',
    descriptionHi: 'विशेष रूप से डिजाइन रेस-कार कुर्सियों पर कार्टून देखते हुए बच्चों का बिना किसी डर के मनोरंजक हेयर स्टाइलिंग और जेंटल हेयर कट।',
    category: 'Kids Styling',
    categoryHi: 'बच्चों की स्टाइलिंग',
    price: 350,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600',
    icon: 'child_care',
    theme: 'family',
    availableStaff: ['st-2', 'st-3']
  },

  // NAIL / LASH SERVICES
  {
    id: 'n-1',
    name: 'Gel Nail Sculpting & 3D Metallic Art',
    nameHi: 'जेल नेल स्कल्प्टिंग और 3D मैटेलिक आर्ट',
    description: 'Premium acrylic or builder gel nail extensions customized with hand-painted futuristic chrome detail lines and floral 3D hard-gel overlays.',
    descriptionHi: 'हाथ से बने भविष्यवादी क्रोम लाइन्स और फ्लोरल 3D हार्ड-जेल कलाकृतियों के साथ प्रीमियम जेल नेल एक्सटेंशन।',
    category: 'Nail Extensions',
    categoryHi: 'नेल एक्सटेंशन',
    price: 2400,
    duration: 90,
    activeOffer: { code: 'NAILART', discountPercent: 10, description: '10% Off Metallic Nail Sculpting', descriptionHi: 'मैटेलिक नेल स्टाइलिंग पर 10% की छूट' },
    image: 'https://images.unsplash.com/photo-1604654894610-df4906b11514?auto=format&fit=crop&q=80&w=600',
    icon: 'back_hand',
    theme: 'nail_lash',
    availableStaff: ['st-10', 'st-11']
  },
  {
    id: 'n-2',
    name: 'Volume Premium Silk Lash Extensions',
    nameHi: 'वॉल्यूम प्रीमियम सिल्क लैश एक्सटेंशन',
    description: 'Russian volume layering of ultra-lightweight, skin-safe faux silk lash extensions, customized for natural eyes lift and luxury density.',
    descriptionHi: 'प्राकृतिक लिफ्ट और घनी लक्जरी पलकों के लिए स्किन-सुरक्षित अल्ट्रा-लाइटवेट रशियन वॉल्यूम सिल्क पलकें।',
    category: 'Lash Styling',
    categoryHi: 'पलकें संवारना',
    price: 3200,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a541b?auto=format&fit=crop&q=80&w=600',
    icon: 'visibility',
    theme: 'nail_lash',
    availableStaff: ['st-11']
  }
];

interface BookingScreenProps {
  onBackToHome?: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export function BookingScreen({ onBackToHome, setActiveTab }: BookingScreenProps) {
  // Theme & Settings
  const [selectedTheme, setSelectedTheme] = useState<'barber' | 'hair_studio' | 'beauty_spa' | 'family' | 'nail_lash'>('hair_studio');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isHindi, setIsHindi] = useState<boolean>(false);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  // Modal Service Detail Detail
  const [selectedService, setSelectedService] = useState<SalonService | null>(null);

  // Booking Flow States
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [bookingStylistId, setBookingStylistId] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('Riya Sharma');
  const [clientPhone, setClientPhone] = useState<string>('+91 98765 43210');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [generatedBookingId, setGeneratedBookingId] = useState<string>('');

  const activeStyles = THEME_MAP[selectedTheme];

  // Auto-loading trigger on theme change for beautiful delay simulations
  const handleThemeChange = (themeKey: 'barber' | 'hair_studio' | 'beauty_spa' | 'family' | 'nail_lash') => {
    setIsLoading(true);
    setSelectedTheme(themeKey);
    setSelectedCategory('All');
    setSelectedService(null);
    setIsBookingMode(false);
    setSearchQuery('');
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const simulateError = () => {
    setErrorState('Network error: Code 503. Failed to fetch available slots from India North-1 server.');
  };

  const resetError = () => {
    setErrorState(null);
    handleThemeChange(selectedTheme);
  };

  // Get filtered services
  const themeServices = SALON_SERVICES.filter(service => service.theme === selectedTheme);
  const uniqueCategories = ['All', ...Array.from(new Set(themeServices.map(s => s.category)))];

  const filteredServices = themeServices.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const sQuery = searchQuery.toLowerCase().trim();
    if (!sQuery) return matchesCategory;

    const matchesName = service.name.toLowerCase().includes(sQuery) || service.nameHi.toLowerCase().includes(sQuery);
    const matchesDesc = service.description.toLowerCase().includes(sQuery) || service.descriptionHi.toLowerCase().includes(sQuery);
    const matchesCat = service.category.toLowerCase().includes(sQuery) || service.categoryHi.toLowerCase().includes(sQuery);

    return matchesCategory && (matchesName || matchesDesc || matchesCat);
  });

  // Booking start
  const handleBookNow = (service: SalonService) => {
    setSelectedService(service);
    setIsBookingMode(true);
    setBookingStep(1);
    // Auto-select first available staff
    if (service.availableStaff && service.availableStaff.length > 0) {
      setBookingStylistId(service.availableStaff[0]);
    } else {
      setBookingStylistId('');
    }
    // Auto-select tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }));
    setBookingTime('11:00 AM');
  };

  const handleConfirmBooking = () => {
    setGeneratedBookingId(`NEX-BOOK-${Math.floor(100000 + Math.random() * 900000)}`);
    setBookingStep(5);
  };

  // Hindi Translations dictionary
  const dict = {
    title: isHindi ? 'नेक्सोरा लक्जरी सैलून बुकिंग' : 'Nexora Luxury Salon Booking',
    subtitle: isHindi ? 'भारत के सर्वश्रेष्ठ कारीगरों से प्रीमियम सेवाएँ बुक करें' : 'Book premium high-touch services from India\'s finest artists',
    themeSelection: isHindi ? 'थीम वातावरण' : 'Theme Environment',
    searchPlaceholder: isHindi ? 'सैलून सेवाओं की खोज करें...' : 'Search for luxurious treatments...',
    categoryAll: isHindi ? 'सभी' : 'All',
    durationLabel: isHindi ? 'अवधि' : 'Duration',
    mins: isHindi ? 'मिनट' : 'mins',
    priceLabel: isHindi ? 'कीमत / शुरुआती' : 'Price / Starting from',
    rupee: '₹',
    discountApplied: isHindi ? 'छूट लागू' : 'Discount Applied',
    bookCta: isHindi ? 'अभी बुक करें' : 'Book Appointment',
    loadingMsg: isHindi ? 'उपलब्ध सेवाओं को लोड किया जा रहा है...' : 'Syncing available slots and premium treatments...',
    errorMsg: isHindi ? 'त्रुटि उत्पन्न हुई!' : 'Unexpected error occurred!',
    errorButton: isHindi ? 'पुनः प्रयास करें' : 'Reset Connection',
    emptyTitle: isHindi ? 'कोई सेवा नहीं मिली' : 'No premium services match',
    emptyDesc: isHindi ? 'कृपया अपनी खोज शब्द बदलें या अन्य श्रेणी चुनें।' : 'Try refining your filters or looking under a different theme.',
    closeModal: isHindi ? 'बंद करें' : 'Close Details',
    detailsHeader: isHindi ? 'सेवा का विवरण' : 'Service Details',
    stylistsHeader: isHindi ? 'उपलब्ध कलाकार / स्टाइलिस्ट' : 'Featured Stylist Experts',
    activeOfferHeader: isHindi ? 'सक्रिय विशेष छूट' : 'Active Exclusive Offer',
    stepStylist: isHindi ? '1. स्टाइलिस्ट चुनें' : '1. Select Stylist',
    stepTime: isHindi ? '2. तिथि व समय' : '2. Date & Time',
    stepContact: isHindi ? '3. ग्राहक जानकारी' : '3. Client Details',
    stepConfirm: isHindi ? '4. सारांश देखें' : '4. Confirm Appointment',
    stepSuccess: isHindi ? '5. बुकिंग सफल' : '5. Ticket Generated',
    confirmCta: isHindi ? 'बुकिंग पक्की करें' : 'Confirm Luxury Booking',
    successTitle: isHindi ? 'अपॉइंटमेंट बुक हो गया!' : 'Luxury Session Confirmed!',
    successSubtitle: isHindi ? 'आपका स्लॉट ब्लॉक कर दिया गया है। विवरण नीचे देखें।' : 'Your stylist has locked your slot. Your printable ticket has been generated.',
    bookingIdLabel: isHindi ? 'बुकिंग नंबर' : 'Booking ID',
    clientLabel: isHindi ? 'ग्राहक का नाम' : 'Client Name',
    phoneLabel: isHindi ? 'फ़ोन नंबर' : 'Phone Number',
    notesLabel: isHindi ? 'विशेष निर्देश / नोट' : 'Special Notes / Allergy Alerts',
    notesPlaceholder: isHindi ? 'त्वचा संवेदनशीलता या स्टाइलिस्ट के लिए नोट...' : 'Add any color formulation codes, allergies or setup requests...',
    returnCta: isHindi ? 'अन्य सेवाएँ देखें' : 'Return to Services Catalog',
    originalPriceLabel: isHindi ? 'मूल मूल्य' : 'Original Rate',
    discountLabel: isHindi ? 'बचत' : 'Discount Saving',
    netPayable: isHindi ? 'भुगतान मूल्य' : 'Net Amount Payable',
    backCta: isHindi ? 'वापस जाएं' : 'Back',
    nextStepCta: isHindi ? 'अगला चरण' : 'Next Step',
    simulateErrorLabel: isHindi ? 'सर्वर त्रुटि सिम्युलेट करें' : 'Simulate API Error State',
    themeLabelBarber: isHindi ? 'जेंट्स बार्बर' : 'Barber Co.',
    themeLabelHair: isHindi ? 'हेयर स्टूडियो' : 'Hair Studio',
    themeLabelSpa: isHindi ? 'ब्यूटी / स्पा' : 'Beauty/Spa',
    themeLabelFamily: isHindi ? 'फैमिली पैक' : 'Family Groom',
    themeLabelNails: isHindi ? 'नेल / लैश' : 'Nail/Lash',
    stylistRating: isHindi ? 'रेटिंग' : 'Rating',
  };

  const getStylist = (id: string) => SALON_STYLISTS.find(s => s.id === id);

  return (
    <div className={`min-h-screen py-6 px-4 md:px-8 transition-colors duration-300 ${isDarkMode ? activeStyles.bgDark + ' text-gray-100' : activeStyles.bgLight + ' text-gray-900'}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* TOP COMPACT BRAND HEADER & CONTROL TABS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 dark:bg-black/30 backdrop-blur-md p-4 rounded-3xl border border-stone-200/50 dark:border-stone-800/50">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('home')}
              className="w-10 h-10 rounded-full bg-white dark:bg-stone-800 shadow-xs border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:scale-105 transition-all"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 dark:from-white dark:via-stone-100 dark:to-stone-300 bg-clip-text text-transparent flex items-center gap-1.5">
                <span>{dict.title}</span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-[#8e004b] text-white px-2 py-0.5 rounded-full">Phase 12.6</span>
              </h1>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">{dict.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Simulation Controls */}
            <button
              onClick={simulateError}
              className="px-2.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 text-[10px] font-extrabold transition-all"
              title="Test the robust error recovery UI flow"
            >
              <span className="material-symbols-outlined text-[11px] mr-1 align-middle">report</span>
              {dict.simulateErrorLabel}
            </button>

            {/* Language Switcher */}
            <div className="bg-white dark:bg-stone-800 rounded-xl p-0.5 border border-stone-200 dark:border-stone-700 flex items-center shadow-2xs">
              <button
                onClick={() => setIsHindi(false)}
                className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all ${!isHindi ? 'bg-[#8e004b] text-white' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700'}`}
              >
                EN
              </button>
              <button
                onClick={() => setIsHindi(true)}
                className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all ${isHindi ? 'bg-[#8e004b] text-white' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700'}`}
              >
                हिंदी
              </button>
            </div>

            {/* Local Dark Mode Switcher */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 flex items-center justify-center shadow-2xs transition-colors"
              title="Toggle Dark Mode local view"
            >
              <span className="material-symbols-outlined text-sm">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
        </div>

        {/* 5 THEMES CONTROLLERS */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-3 border border-stone-200/60 dark:border-stone-800/80 shadow-xs">
          <p className="text-[10px] font-black uppercase text-stone-400 dark:text-stone-500 tracking-widest px-3 mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[11px]">style</span>
            <span>{dict.themeSelection}</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'barber', icon: 'content_cut', label: dict.themeLabelBarber, color: 'border-amber-700 text-amber-700 bg-amber-500/5' },
              { id: 'hair_studio', icon: 'palette', label: dict.themeLabelHair, color: 'border-pink-700 text-pink-700 bg-pink-500/5' },
              { id: 'beauty_spa', icon: 'spa', label: dict.themeLabelSpa, color: 'border-teal-700 text-teal-700 bg-teal-500/5' },
              { id: 'family', icon: 'groups', label: dict.themeLabelFamily, color: 'border-orange-700 text-orange-700 bg-orange-500/5' },
              { id: 'nail_lash', icon: 'back_hand', label: dict.themeLabelNails, color: 'border-[#db2777] text-[#db2777] bg-pink-500/5' },
            ].map((themeOpt) => {
              const isSelected = selectedTheme === themeOpt.id;
              const localStyles = THEME_MAP[themeOpt.id];
              return (
                <button
                  key={themeOpt.id}
                  onClick={() => handleThemeChange(themeOpt.id as any)}
                  className={`px-4 py-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center border-2 ${
                    isSelected
                      ? localStyles.primary + ' text-white border-transparent shadow-md scale-102'
                      : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200/50 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{themeOpt.icon}</span>
                  <span className="text-xs font-bold leading-none">{themeOpt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ERROR STATE VIEW */}
        {errorState ? (
          <div className="bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900 rounded-3xl p-8 text-center space-y-4 shadow-sm animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl font-bold">wifi_off</span>
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h2 className="text-lg font-extrabold text-rose-800 dark:text-rose-400">{dict.errorMsg}</h2>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/70 leading-relaxed font-semibold">{errorState}</p>
            </div>
            <button
              onClick={resetError}
              className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-md hover:bg-rose-500 active:scale-95 transition-all"
            >
              {dict.errorButton}
            </button>
          </div>
        ) : isLoading ? (
          /* SKELETON LOADING STATE */
          <div className="space-y-6">
            <div className="h-10 bg-white/40 dark:bg-stone-800/50 border border-stone-200/40 dark:border-stone-800 p-2 rounded-2xl flex gap-2 animate-pulse">
              <div className="w-20 bg-stone-200 dark:bg-stone-700 rounded-lg h-full" />
              <div className="w-20 bg-stone-200 dark:bg-stone-700 rounded-lg h-full" />
              <div className="w-20 bg-stone-200 dark:bg-stone-700 rounded-lg h-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(n => (
                <div key={n} className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 flex gap-4 animate-pulse">
                  <div className="w-24 h-24 bg-stone-200 dark:bg-stone-700 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded-md w-3/4" />
                    <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded-md w-1/2" />
                    <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded-md w-1/4 mt-4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-stone-400 font-semibold">{dict.loadingMsg}</div>
          </div>
        ) : (
          /* MAIN CONTENT AREA */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* SERVICE LIST COLUMN (col-span-7) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Category selector & Search bar */}
              <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200/60 dark:border-stone-800/80 shadow-2xs space-y-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-stone-400 dark:text-stone-500 text-lg">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={dict.searchPlaceholder}
                    className="w-full bg-stone-50 dark:bg-stone-800 text-xs text-stone-800 dark:text-stone-100 rounded-2xl pl-10 pr-4 py-2.5 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>

                {/* Sub-category chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
                  {uniqueCategories.map((cat) => {
                    const isCatSelected = selectedCategory === cat;
                    const translatedCat = cat === 'All' ? dict.categoryAll : (isHindi ? themeServices.find(s => s.category === cat)?.categoryHi || cat : cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all border ${
                          isCatSelected
                            ? activeStyles.primary + ' text-white border-transparent shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200/60 dark:border-stone-800 hover:border-stone-300'
                        }`}
                      >
                        {translatedCat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LIST CARDS */}
              {filteredServices.length === 0 ? (
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 text-center border border-stone-200/60 dark:border-stone-800 space-y-3 shadow-2xs">
                  <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 flex items-center justify-center mx-auto border border-stone-200/50 dark:border-stone-700">
                    <span className="material-symbols-outlined text-xl">block</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-stone-700 dark:text-stone-300 uppercase tracking-wider">{dict.emptyTitle}</h3>
                    <p className="text-[11px] text-stone-400 dark:text-stone-500 max-w-xs mx-auto mt-1 font-semibold">{dict.emptyDesc}</p>
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold hover:bg-stone-50 dark:hover:bg-stone-800"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredServices.map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    const finalPrice = service.activeOffer 
                      ? Math.round(service.price * (1 - service.activeOffer.discountPercent / 100))
                      : service.price;

                    return (
                      <div
                        key={service.id}
                        onClick={() => {
                          setSelectedService(service);
                          setIsBookingMode(false); // clear active booking flow state to show details
                        }}
                        className={`p-3.5 rounded-3xl border-2 transition-all cursor-pointer flex gap-4 ${
                          isDarkMode ? activeStyles.cardDark : activeStyles.cardLight
                        } ${isSelected ? 'ring-2 ring-stone-400 dark:ring-stone-600 scale-[1.01] shadow-sm' : 'hover:scale-[1.005] hover:shadow-2xs'}`}
                      >
                        {/* Cover Image */}
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 relative bg-stone-100 dark:bg-stone-800 border border-stone-200/50 dark:border-stone-800">
                          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                          <div className="absolute top-1.5 left-1.5 bg-black/65 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[9px]">{service.icon}</span>
                          </div>
                        </div>

                        {/* Text details */}
                        <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md leading-none ${isDarkMode ? activeStyles.accentDark : activeStyles.accentLight}`}>
                                {isHindi ? service.categoryHi : service.category}
                              </span>
                              {service.activeOffer && (
                                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[8px] font-black px-1.5 py-0.5 rounded-md leading-none flex items-center gap-0.5">
                                  <span className="material-symbols-outlined text-[8px]">percent</span>
                                  <span>{service.activeOffer.code}</span>
                                </span>
                              )}
                            </div>
                            <h3 className="text-xs font-black line-clamp-1 leading-snug tracking-tight text-stone-900 dark:text-stone-100">
                              {isHindi ? service.nameHi : service.name}
                            </h3>
                            <p className="text-[10px] text-stone-400 dark:text-stone-500 line-clamp-2 mt-0.5 leading-normal">
                              {isHindi ? service.descriptionHi : service.description}
                            </p>
                          </div>

                          <div className="flex items-end justify-between mt-2 pt-2 border-t border-stone-100/30">
                            <div className="flex items-center gap-1 text-[10px] text-stone-400 dark:text-stone-500 font-bold">
                              <span className="material-symbols-outlined text-[10px]">schedule</span>
                              <span>{service.duration} {dict.mins}</span>
                            </div>
                            <div className="text-right">
                              {service.activeOffer && (
                                <span className="text-[9px] line-through text-stone-400 font-medium mr-1.5">
                                  {dict.rupee}{service.price}
                                </span>
                              )}
                              <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-[#8e004b]'}`}>
                                {dict.rupee}{finalPrice}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SERVICE DETAIL AND BOOKING SCREEN COLUMN (col-span-5) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              
              {!selectedService ? (
                /* EMPTY SELECTION INTRO BOARD */
                <div className={`p-8 rounded-3xl text-center border-2 border-dashed ${isDarkMode ? 'bg-[#29221C]/20 border-stone-800 text-stone-400' : 'bg-white border-stone-300 text-stone-500'} space-y-4`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${isDarkMode ? 'bg-stone-800' : 'bg-stone-100'}`}>
                    <span className="material-symbols-outlined text-2xl">spa</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight">{isHindi ? 'विवरण देखने के लिए सेवा चुनें' : 'Select a Treatment to Begin'}</h3>
                    <p className="text-[11px] text-stone-400 dark:text-stone-500 max-w-xs mx-auto mt-1 leading-relaxed font-semibold">
                      {isHindi 
                        ? 'शानदार सेवाओं के विवरण, मूल्य, अवधि, उपलब्ध स्टाइलिस्ट और डिस्काउंट देखने के लिए बाईं ओर से किसी भी सेवा पर क्लिक करें।' 
                        : 'Explore premium customized durations, direct backbar pricing, star stylist details, and seasonal coupons by tapping a treatment.'}
                    </p>
                  </div>
                </div>
              ) : !isBookingMode ? (
                /* THE SERVICE DETAIL VIEW / MODAL (Light/Dark compatible, Theme isolated) */
                <div className={`p-5 rounded-3xl border-2 space-y-4 shadow-sm animate-fade-in ${isDarkMode ? activeStyles.cardDark : activeStyles.cardLight}`}>
                  
                  {/* Modal Header Title */}
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100/30">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">info</span>
                      <span>{dict.detailsHeader}</span>
                    </span>
                    <button
                      onClick={() => setSelectedService(null)}
                      className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                      title={dict.closeModal}
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>

                  {/* Service Image banner */}
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/50 dark:border-stone-800 shadow-2xs">
                    <img src={selectedService.image} alt={selectedService.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className="bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px]">timer</span>
                        <span>{selectedService.duration} {dict.mins}</span>
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Names */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full leading-none ${
                        isDarkMode ? activeStyles.accentDark : activeStyles.accentLight
                      }`}>
                        {isHindi ? selectedService.categoryHi : selectedService.category}
                      </span>
                      <span className="text-stone-300 dark:text-stone-700 text-xs">•</span>
                      <span className="text-[9px] text-stone-400 dark:text-stone-500 font-extrabold uppercase tracking-wider">
                        {isHindi ? 'प्रीमियम उपचार' : 'Premium Treatment'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-base font-black leading-tight tracking-tight text-stone-950 dark:text-white">
                        {isHindi ? selectedService.nameHi : selectedService.name}
                      </h2>
                      <div className="text-right shrink-0">
                        {selectedService.activeOffer && (
                          <div className="text-[10px] line-through text-stone-400 dark:text-stone-500 leading-none">
                            {dict.rupee}{selectedService.price}
                          </div>
                        )}
                        <div className={`text-base font-extrabold leading-none mt-0.5 ${isDarkMode ? 'text-[#F9A8D4]' : 'text-[#8e004b]'}`}>
                          {dict.rupee}{
                            selectedService.activeOffer 
                              ? Math.round(selectedService.price * (1 - selectedService.activeOffer.discountPercent / 100))
                              : selectedService.price
                          }
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-semibold">
                      {isHindi ? selectedService.descriptionHi : selectedService.description}
                    </p>
                  </div>

                  {/* Active offers section */}
                  {selectedService.activeOffer && (
                    <div className="bg-emerald-500/10 dark:bg-emerald-950/20 border-2 border-emerald-500/30 dark:border-emerald-900 p-3 rounded-2xl flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-base mt-0.5">local_activity</span>
                      <div>
                        <div className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                          <span>{dict.activeOfferHeader}</span>
                          <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md">{selectedService.activeOffer.code}</span>
                        </div>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400/80 font-bold mt-0.5">
                          {isHindi ? selectedService.activeOffer.descriptionHi : selectedService.activeOffer.description} ({selectedService.activeOffer.discountPercent}% OFF)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Stylists configuration */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-stone-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">badge</span>
                      <span>{dict.stylistsHeader}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedService.availableStaff.map((staffId) => {
                        const stylist = getStylist(staffId);
                        if (!stylist) return null;
                        return (
                          <div 
                            key={stylist.id} 
                            className="bg-stone-50 dark:bg-stone-800 border border-stone-200/50 dark:border-stone-700 p-1.5 pr-3 rounded-2xl flex items-center gap-2.5 text-left shrink-0 shadow-2xs"
                          >
                            <img src={stylist.avatar} alt={stylist.name} className="w-7 h-7 rounded-full object-cover border border-[#8e004b]/30" />
                            <div>
                              <div className="text-[10px] font-black text-stone-900 dark:text-white leading-none">
                                {isHindi ? stylist.nameHi : stylist.name}
                              </div>
                              <div className="text-[8px] text-stone-400 dark:text-stone-500 font-bold mt-0.5">
                                {isHindi ? stylist.roleHi : stylist.role} • {stylist.rating}★
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Similar Services Carousel for improved Discovery */}
                  {(() => {
                    const similar = SALON_SERVICES.filter(
                      (s) => s.theme === selectedTheme && s.category === selectedService.category && s.id !== selectedService.id
                    );
                    const displaySimilar = similar.length > 0
                      ? similar
                      : SALON_SERVICES.filter((s) => s.theme === selectedTheme && s.id !== selectedService.id);

                    if (displaySimilar.length === 0) return null;

                    return (
                      <div className="space-y-2 pt-3 border-t border-stone-200/40 dark:border-stone-800">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-stone-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px]">auto_awesome</span>
                            <span>{isHindi ? 'समान सेवाएँ' : 'Similar Services'}</span>
                          </h4>
                          <span className="text-[9px] text-stone-400 dark:text-stone-500 font-extrabold uppercase tracking-wider">
                            {displaySimilar.length} {isHindi ? 'उपलब्ध' : 'treatments'}
                          </span>
                        </div>
                        <div className="flex gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-800 scroll-smooth snap-x">
                          {displaySimilar.map((item) => {
                            const finalPrice = item.activeOffer 
                              ? Math.round(item.price * (1 - item.activeOffer.discountPercent / 100))
                              : item.price;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setSelectedService(item);
                                  setIsBookingMode(false);
                                }}
                                className={`flex flex-col text-left p-2 rounded-2xl border-2 w-32 snap-start transition-all shrink-0 hover:scale-[1.02] ${
                                  isDarkMode 
                                    ? 'bg-stone-900/40 border-stone-800 hover:border-stone-700 hover:bg-stone-800' 
                                    : 'bg-stone-50 border-stone-200/50 hover:border-stone-300 hover:bg-stone-100'
                                }`}
                              >
                                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-1 relative bg-stone-100 dark:bg-stone-800 border border-stone-200/20">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <h5 className="text-[10px] font-black line-clamp-1 text-stone-900 dark:text-stone-100 leading-tight">
                                  {isHindi ? item.nameHi : item.name}
                                </h5>
                                <div className="flex justify-between items-center mt-1 w-full text-[9px] font-bold">
                                  <span className="text-stone-400">{item.duration}m</span>
                                  <span className={isDarkMode ? 'text-pink-300' : 'text-[#8e004b]'}>{dict.rupee}{finalPrice}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* BOOK NOW CTA */}
                  <button
                    onClick={() => handleBookNow(selectedService)}
                    className={`w-full py-3 rounded-2xl text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 active:scale-98 transition-all ${activeStyles.primary} ${activeStyles.primaryHover}`}
                  >
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    <span>{dict.bookCta}</span>
                  </button>

                </div>
              ) : (
                /* THE STEP-BY-STEP BOOKING FLOW */
                <div className={`p-5 rounded-3xl border-2 space-y-4 shadow-sm animate-fade-in ${isDarkMode ? activeStyles.cardDark : activeStyles.cardLight}`}>
                  
                  {/* Booking locked progress summary */}
                  <div className="flex justify-between items-center bg-stone-100 dark:bg-stone-800/80 p-2.5 rounded-2xl border border-stone-200/30">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-stone-400 text-sm shrink-0">bookmark_added</span>
                      <div className="min-w-0">
                        <span className="text-[8px] uppercase font-black text-[#8e004b] tracking-wider block leading-none">
                          {isHindi ? selectedService.categoryHi : selectedService.category}
                        </span>
                        <h4 className="text-[11px] font-black text-stone-900 dark:text-stone-100 truncate leading-tight">
                          {isHindi ? selectedService.nameHi : selectedService.name}
                        </h4>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsBookingMode(false)}
                      className="text-[9px] font-bold text-stone-500 hover:text-[#8e004b] uppercase px-2 py-1 bg-white dark:bg-stone-700 rounded-md shrink-0 border border-stone-200/50"
                    >
                      {dict.backCta}
                    </button>
                  </div>

                  {/* STEP TABS HEADER */}
                  <div className="flex justify-between text-center border-b border-stone-100/30 pb-2">
                    {[1, 2, 3, 4].map((stepNum) => (
                      <div 
                        key={stepNum} 
                        className={`text-[9px] font-bold flex-1 transition-all ${
                          bookingStep === stepNum 
                            ? 'text-[#8e004b] font-black border-b-2 border-[#8e004b]' 
                            : bookingStep > stepNum ? 'text-emerald-600' : 'text-stone-400'
                        }`}
                      >
                        {stepNum === 1 && dict.stepStylist.split('.')[1]}
                        {stepNum === 2 && dict.stepTime.split('.')[1]}
                        {stepNum === 3 && dict.stepContact.split('.')[1]}
                        {stepNum === 4 && dict.stepConfirm.split('.')[1]}
                      </div>
                    ))}
                  </div>

                  {/* STEP CONTENT SWITCHER */}
                  {bookingStep === 1 && (
                    /* STEP 1: CHOOSE STYLIST */
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">{dict.stepStylist}</p>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedService.availableStaff.map((staffId) => {
                          const stylist = getStylist(staffId);
                          if (!stylist) return null;
                          const isSelected = bookingStylistId === stylist.id;
                          return (
                            <button
                              key={stylist.id}
                              onClick={() => setBookingStylistId(stylist.id)}
                              className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition-all ${
                                isSelected 
                                  ? 'border-[#8e004b] bg-[#8e004b]/5 shadow-2xs' 
                                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200/50 dark:border-stone-800'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <img src={stylist.avatar} alt={stylist.name} className="w-10 h-10 rounded-full object-cover border" />
                                <div>
                                  <h4 className="text-xs font-black text-stone-950 dark:text-white leading-none">
                                    {isHindi ? stylist.nameHi : stylist.name}
                                  </h4>
                                  <p className="text-[9px] text-stone-400 dark:text-stone-500 mt-1 font-bold">
                                    {isHindi ? stylist.roleHi : stylist.role}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="bg-amber-100 dark:bg-stone-700 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-lg">
                                  {stylist.rating}★
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          disabled={!bookingStylistId}
                          onClick={() => setBookingStep(2)}
                          className={`px-4 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-1 ${
                            bookingStylistId 
                              ? activeStyles.primary + ' text-white hover:scale-102 active:scale-95 transition-all' 
                              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          <span>{dict.nextStepCta}</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {bookingStep === 2 && (
                    /* STEP 2: DATE & TIME slots */
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">{dict.stepTime}</p>
                      
                      {/* Dynamic Date Row */}
                      <div className="grid grid-cols-4 gap-2">
                        {[0, 1, 2, 3].map((offset) => {
                          const dateObj = new Date();
                          dateObj.setDate(dateObj.getDate() + offset + 1); // starting from tomorrow
                          const dayStr = dateObj.toLocaleDateString('en-IN', { weekday: 'short' });
                          const dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                          const fullDateStr = `${dayStr}, ${dateStr}`;
                          const isSelected = bookingDate === fullDateStr;

                          return (
                            <button
                              key={offset}
                              type="button"
                              onClick={() => setBookingDate(fullDateStr)}
                              className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${
                                isSelected 
                                  ? 'border-[#8e004b] bg-[#8e004b]/5 shadow-2xs' 
                                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200/50 dark:border-stone-800'
                              }`}
                            >
                              <span className="text-[9px] text-stone-400 dark:text-stone-500 font-bold uppercase">{dayStr}</span>
                              <span className="text-xs font-black text-stone-900 dark:text-white mt-0.5">{dateObj.getDate()}</span>
                              <span className="text-[8px] text-stone-400 dark:text-stone-500 font-bold uppercase">{dateObj.toLocaleDateString('en-IN', { month: 'short' })}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Hourly slots */}
                      <div className="grid grid-cols-3 gap-2 pt-1.5">
                        {['10:00 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM'].map((slot) => {
                          const isSelected = bookingTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setBookingTime(slot)}
                              className={`p-2 rounded-xl border-2 text-xs font-black transition-all text-center ${
                                isSelected 
                                  ? 'border-[#8e004b] bg-[#8e004b]/5 shadow-2xs' 
                                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200/50 dark:border-stone-800'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-2 flex justify-between">
                        <button
                          onClick={() => setBookingStep(1)}
                          className="px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-black border border-stone-200/50 dark:border-stone-700"
                        >
                          {dict.backCta}
                        </button>
                        <button
                          disabled={!bookingDate || !bookingTime}
                          onClick={() => setBookingStep(3)}
                          className={`px-4 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-1 ${
                            bookingDate && bookingTime 
                              ? activeStyles.primary + ' text-white hover:scale-102 active:scale-95 transition-all' 
                              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          <span>{dict.nextStepCta}</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {bookingStep === 3 && (
                    /* STEP 3: CUSTOMER CONTACT INFO */
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">{dict.stepContact}</p>
                      
                      <div className="space-y-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-stone-500 uppercase">{dict.clientLabel}</label>
                          <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-800 text-xs text-stone-800 dark:text-stone-100 rounded-xl px-3 py-2 border border-stone-200 dark:border-stone-700 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-stone-500 uppercase">{dict.phoneLabel}</label>
                          <input
                            type="text"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-800 text-xs text-stone-800 dark:text-stone-100 rounded-xl px-3 py-2 border border-stone-200 dark:border-stone-700 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-stone-500 uppercase">{dict.notesLabel}</label>
                          <textarea
                            rows={2}
                            value={clientNotes}
                            onChange={(e) => setClientNotes(e.target.value)}
                            placeholder={dict.notesPlaceholder}
                            className="w-full bg-stone-50 dark:bg-stone-800 text-xs text-stone-800 dark:text-stone-100 rounded-xl px-3 py-2 border border-stone-200 dark:border-stone-700 focus:outline-none resize-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between">
                        <button
                          onClick={() => setBookingStep(2)}
                          className="px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-black border border-stone-200/50 dark:border-stone-700"
                        >
                          {dict.backCta}
                        </button>
                        <button
                          disabled={!clientName.trim() || !clientPhone.trim()}
                          onClick={() => setBookingStep(4)}
                          className={`px-4 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-1 ${
                            clientName.trim() && clientPhone.trim() 
                              ? activeStyles.primary + ' text-white hover:scale-102 active:scale-95 transition-all' 
                              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          <span>{dict.nextStepCta}</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {bookingStep === 4 && (
                    /* STEP 4: CONFIRMATION SUMMARY & CALC */
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">{dict.stepConfirm}</p>
                      
                      <div className="bg-stone-50 dark:bg-stone-800/80 p-3.5 rounded-2xl border border-stone-200/50 dark:border-stone-700 space-y-2.5 text-xs">
                        <div className="flex justify-between items-center text-[10px] text-stone-400 uppercase font-black tracking-wider border-b border-stone-200/50 dark:border-stone-700 pb-1.5">
                          <span>Appointment Factsheet</span>
                          <span className="text-[#8e004b]">{selectedTheme.replace('_', ' ').toUpperCase()}</span>
                        </div>

                        {/* Date Time info */}
                        <div className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-stone-400 text-base">calendar_today</span>
                          <div>
                            <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 leading-none">Schedule Time</p>
                            <p className="font-extrabold text-stone-900 dark:text-stone-100 mt-1">{bookingDate} @ {bookingTime}</p>
                          </div>
                        </div>

                        {/* Stylist Info */}
                        <div className="flex items-start gap-2.5 border-t border-stone-150/30 pt-2.5">
                          <span className="material-symbols-outlined text-stone-400 text-base">person</span>
                          <div>
                            <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 leading-none">Selected Artist</p>
                            <p className="font-extrabold text-stone-900 dark:text-stone-100 mt-1">
                              {getStylist(bookingStylistId)?.name} ({getStylist(bookingStylistId)?.role})
                            </p>
                          </div>
                        </div>

                        {/* Client details */}
                        <div className="flex items-start gap-2.5 border-t border-stone-150/30 pt-2.5">
                          <span className="material-symbols-outlined text-stone-400 text-base">contact_phone</span>
                          <div>
                            <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 leading-none">{dict.clientLabel} & Contact</p>
                            <p className="font-extrabold text-stone-900 dark:text-stone-100 mt-1">{clientName} ({clientPhone})</p>
                          </div>
                        </div>

                        {/* Financial Ledger Calculation */}
                        <div className="border-t-2 border-dashed border-stone-250 dark:border-stone-700 pt-2.5 space-y-1.5 text-[11px] font-semibold">
                          <div className="flex justify-between text-stone-500 dark:text-stone-400">
                            <span>{dict.originalPriceLabel}</span>
                            <span>{dict.rupee}{selectedService.price}</span>
                          </div>
                          {selectedService.activeOffer && (
                            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-extrabold">
                              <span>{dict.discountLabel} ({selectedService.activeOffer.code} -{selectedService.activeOffer.discountPercent}%)</span>
                              <span>-{dict.rupee}{Math.round(selectedService.price * (selectedService.activeOffer.discountPercent / 100))}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-stone-950 dark:text-white font-black text-xs pt-1.5 border-t border-stone-250">
                            <span>{dict.netPayable}</span>
                            <span className={isDarkMode ? 'text-pink-300' : 'text-[#8e004b]'}>
                              {dict.rupee}{
                                selectedService.activeOffer 
                                  ? Math.round(selectedService.price * (1 - selectedService.activeOffer.discountPercent / 100))
                                  : selectedService.price
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between gap-3">
                        <button
                          onClick={() => setBookingStep(3)}
                          className="px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-black border border-stone-200/50 dark:border-stone-700"
                        >
                          {dict.backCta}
                        </button>
                        <button
                          onClick={handleConfirmBooking}
                          className={`flex-1 py-3 rounded-xl text-xs font-black text-white shadow-md flex items-center justify-center gap-1 active:scale-98 transition-all ${activeStyles.primary}`}
                        >
                          <span className="material-symbols-outlined text-sm">done_all</span>
                          <span>{dict.confirmCta}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {bookingStep === 5 && (
                    /* STEP 5: TICKET SUCCESS RECEIPT SCREEN */
                    <div className="space-y-4 text-center py-2 animate-fade-in">
                      
                      {/* Big Confetti Spark */}
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-950/20 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-2xs">
                        <span className="material-symbols-outlined text-3xl animate-bounce">check_circle</span>
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{dict.successTitle}</h2>
                        <p className="text-[10px] text-stone-400 dark:text-stone-500 max-w-xs mx-auto leading-normal font-semibold">
                          {dict.successSubtitle}
                        </p>
                      </div>

                      {/* Printable Ticket Receipt */}
                      <div className="bg-white dark:bg-stone-950 text-stone-900 dark:text-gray-100 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden text-left text-[11px] font-semibold divide-y divide-stone-100 dark:divide-stone-800">
                        
                        {/* Cut overlay dots */}
                        <div className="absolute top-[48px] -left-2 w-4 h-4 bg-stone-100 dark:bg-[#1C1216] rounded-full border border-stone-200 dark:border-stone-800" />
                        <div className="absolute top-[48px] -right-2 w-4 h-4 bg-stone-100 dark:bg-[#1C1216] rounded-full border border-stone-200 dark:border-stone-800" />

                        {/* Top banner */}
                        <div className="p-3 bg-stone-50 dark:bg-stone-900/60 flex justify-between items-center">
                          <span className="font-black text-[10px] tracking-wider text-stone-400 uppercase">{dict.bookingIdLabel}</span>
                          <span className="font-extrabold text-[#8e004b] dark:text-pink-300 bg-[#8e004b]/5 dark:bg-[#8e004b]/15 px-2 py-0.5 rounded-md border border-[#8e004b]/20">
                            {generatedBookingId}
                          </span>
                        </div>

                        {/* Stylist & Date */}
                        <div className="p-3 space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-stone-400">{dict.detailsHeader}</span>
                            <span className="font-black">{isHindi ? selectedService.nameHi : selectedService.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">{isHindi ? 'कलाकार' : 'Stylist'}</span>
                            <span className="font-black">{getStylist(bookingStylistId)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">{isHindi ? 'समय' : 'Schedule Slot'}</span>
                            <span className="font-black">{bookingDate} • {bookingTime}</span>
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="p-3 space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-stone-400">{isHindi ? 'ग्राहक' : 'Guest'}</span>
                            <span className="font-black">{clientName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">{isHindi ? 'सम्पर्क' : 'Contact'}</span>
                            <span className="font-black">{clientPhone}</span>
                          </div>
                        </div>

                        {/* Pricing details */}
                        <div className="p-3 bg-stone-50 dark:bg-stone-900/50 flex justify-between items-center text-xs">
                          <span className="font-black uppercase text-[10px] tracking-wider text-stone-400">{dict.netPayable}</span>
                          <span className="font-black text-[#8e004b] dark:text-pink-300">
                            {dict.rupee}{
                              selectedService.activeOffer 
                                ? Math.round(selectedService.price * (1 - selectedService.activeOffer.discountPercent / 100))
                                : selectedService.price
                            }
                          </span>
                        </div>
                      </div>

                      {/* CTA to return */}
                      <button
                        onClick={() => {
                          setIsBookingMode(false);
                          setSelectedService(null);
                        }}
                        className={`w-full py-3 rounded-2xl text-xs font-black text-white shadow-md active:scale-98 transition-all ${activeStyles.primary}`}
                      >
                        {dict.returnCta}
                      </button>

                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
