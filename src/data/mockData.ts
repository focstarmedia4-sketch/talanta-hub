/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FreelancerProfile, Job, Conversation } from '../types';

export const initialFreelancers: FreelancerProfile[] = [
  {
    id: 'f1',
    username: 'alex_video',
    fullName: 'Alex Rivera',
    title: 'Cinematic Videographer & Director',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    coverUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200',
    bio: 'I help brands tell powerful stories through high-end cinematic visuals. Specializing in commercial advertising, high-octane event recaps, and sleek product videography. Armed with 4K RED cameras, professional stabilizers, and a passion for matching perfect soundscapes with moving imagery.',
    location: 'Los Angeles, CA',
    hourlyRate: 95,
    category: 'videography',
    skills: ['Cinematography', 'Color Grading', 'Adobe Premiere Pro', 'DaVinci Resolve', 'Drone Piloting', 'Directing'],
    theme: 'cyber',
    layoutOrder: ['hero', 'categories', 'gallery', 'analytics', 'reviews', 'contact'],
    subscribedCategories: ['videography', 'photography'],
    notificationCount: 2,
    unreadMessagesCount: 1,
    email: 'alex.rivera@cinemaflow.co',
    phone: '+254 712 111111',
    whatsapp: '+254712111111',
    categorySections: [
      {
        category: 'videography',
        title: 'Commercial Reels & Promos',
        customThumbnail: 'https://images.unsplash.com/photo-1579165466541-74e2beb67a3a?auto=format&fit=crop&q=80&w=600',
        description: 'Cinematic brand promotional videos designed to engage and convert.',
        visible: true
      },
      {
        category: 'photography',
        title: 'Behind the Scenes & Stills',
        customThumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600',
        description: 'High-contrast production stills and lifestyle action photography.',
        visible: true
      },
      {
        category: 'design',
        title: 'Motion Graphics & Storyboards',
        customThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
        description: 'VFX storyboarding, stylized typography transitions, and logo animations.',
        visible: false
      },
      {
        category: 'illustration',
        title: 'Concept Art & Styleframes',
        customThumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600',
        description: 'Hand-drawn mood guides and color script styleframes for digital videos.',
        visible: false
      }
    ],
    portfolio: [
      {
        id: 'p1_1',
        title: 'Ethereal - Urban Streetwear Campaign',
        description: 'A neon-infused cinematic spot for a streetwear label showcasing nocturnal cityscapes and high-contrast motion tracking.',
        category: 'videography',
        imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=600',
        likes: 142,
        views: 1205,
        date: '2026-05-12'
      },
      {
        id: 'p1_2',
        title: 'Origins - Artisanal Coffee Roasters',
        description: 'A slow-paced, warm, documentary-style commercial focused on micro-expression portraiture and organic sensory details.',
        category: 'videography',
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
        likes: 89,
        views: 650,
        date: '2026-06-01'
      },
      {
        id: 'p1_3',
        title: 'Velocity - Performance EV Launch',
        description: 'Sleek automotive commercial using 3D camera sweeps, custom sound design, and sharp color grading to convey speed.',
        category: 'videography',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
        likes: 210,
        views: 1840,
        date: '2026-06-20'
      },
      {
        id: 'p1_4',
        title: 'Nocturnal Whispers - Production Stills',
        description: 'Behind-the-scenes photographic documentation of late night filming sessions in downtown rain.',
        category: 'photography',
        imageUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&q=80&w=600',
        likes: 64,
        views: 310,
        date: '2026-06-15'
      }
    ],
    reviews: [
      {
        id: 'r1_1',
        authorName: 'Sarah Jenkins',
        authorRole: 'Marketing Director, Volt Apparel',
        rating: 5,
        comment: 'Alex took our raw ideas and crafted an absolutely breathtaking promotional video. The attention to color grading and sound design is top-tier. He made our brand look premium and futuristic. Recommended unconditionally!',
        date: '2026-05-20'
      },
      {
        id: 'r1_2',
        authorName: 'David Mercer',
        authorRole: 'Founder, Origin Beans',
        rating: 5,
        comment: 'He was incredibly professional on set, extremely collaborative, and delivered the coffee promo ahead of schedule. The slow-motion macro shots are sheer perfection.',
        date: '2026-06-05'
      }
    ],
    analytics: {
      totalViews: 3240,
      totalInquiries: 48,
      conversionRate: 1.48,
      viewsHistory: [
        { label: 'Mon', count: 120 },
        { label: 'Tue', count: 180 },
        { label: 'Wed', count: 150 },
        { label: 'Thu', count: 210 },
        { label: 'Fri', count: 320 },
        { label: 'Sat', count: 280 },
        { label: 'Sun', count: 240 }
      ],
      reachByCategory: [
        { category: 'videography', percentage: 75 },
        { category: 'photography', percentage: 20 },
        { category: 'design', percentage: 5 },
        { category: 'illustration', percentage: 0 }
      ]
    }
  },
  {
    id: 'f2',
    username: 'elena_photo',
    fullName: 'Elena Rostova',
    title: 'Fine Art & Editorial Photographer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    coverUrl: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&q=80&w=1200',
    bio: 'Capturing the quiet, raw, beautiful moments of human existence. I shoot fashion editorials, minimalist landscapes, and emotional fine art portraits. Rooted in natural light and authentic, soft-grain film aesthetics.',
    location: 'Brooklyn, NY',
    hourlyRate: 110,
    category: 'photography',
    skills: ['Analog Film', 'Editorial Portraits', 'Lightroom Classic', 'Studio Lighting', 'Art Direction', 'Curation'],
    theme: 'warm',
    layoutOrder: ['hero', 'categories', 'gallery', 'analytics', 'reviews', 'contact'],
    subscribedCategories: ['photography', 'illustration'],
    notificationCount: 1,
    unreadMessagesCount: 0,
    email: 'elena@rostovastudios.com',
    phone: '+254 712 222222',
    whatsapp: '+254712222222',
    categorySections: [
      {
        category: 'photography',
        title: 'Editorial & Portrature',
        customThumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
        description: 'Vogue-inspired portraits with soft tones, natural shadows, and vintage charm.',
        visible: true
      },
      {
        category: 'illustration',
        title: 'Analog Textures & Collages',
        customThumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=600',
        description: 'Experimental mixed-media photography combined with abstract paint layers.',
        visible: true
      },
      {
        category: 'videography',
        title: 'Super-8 Dream Logs',
        customThumbnail: 'https://images.unsplash.com/photo-1542204172-e7052809a86e?auto=format&fit=crop&q=80&w=600',
        description: 'Grainy film shorts capturing nostalgic summer vibes and travel diaries.',
        visible: false
      },
      {
        category: 'design',
        title: 'Editorial Layout & Book Covers',
        customThumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
        description: 'Design compositions incorporating photography for book sleeves and magazines.',
        visible: false
      }
    ],
    portfolio: [
      {
        id: 'p2_1',
        title: 'Silence of the Sun - Saharan Textures',
        description: 'A landscape-fashion series exploring sand dunes, flowing ivory silks, and high-noon shadows.',
        category: 'photography',
        imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600',
        likes: 340,
        views: 2900,
        date: '2026-04-02'
      },
      {
        id: 'p2_2',
        title: 'Submerged Reflections - Cyanotype Portrals',
        description: 'A striking portrait series captured through physical cyanotype exposure on cotton paper with natural seawater.',
        category: 'photography',
        imageUrl: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=600',
        likes: 198,
        views: 1420,
        date: '2026-05-18'
      },
      {
        id: 'p2_3',
        title: 'Warm Nostalgia - Paris Spring',
        description: 'Candid lifestyle photographs shot on Kodachrome 35mm film around the streets of Montmartre.',
        category: 'photography',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600',
        likes: 275,
        views: 1950,
        date: '2026-06-10'
      },
      {
        id: 'p2_4',
        title: 'Abstract Botany - Collages',
        description: 'Botanical leaf outlines overlayed on physical film emulsions to create retro-inspired floral layouts.',
        category: 'illustration',
        imageUrl: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&q=80&w=600',
        likes: 112,
        views: 890,
        date: '2026-06-25'
      }
    ],
    reviews: [
      {
        id: 'r2_1',
        authorName: 'Marc Jacobs',
        authorRole: 'Creative Director, Atelier NYC',
        rating: 5,
        comment: 'Elena has an exquisite eye for light and raw human vulnerability. Her editorial photos of our new winter catalog look like cinematic fine art pieces. Simply incredible.',
        date: '2026-04-25'
      },
      {
        id: 'r2_2',
        authorName: 'Julia Vance',
        authorRole: 'Editor, Linen Magazine',
        rating: 4,
        comment: 'Her natural film aesthetics provided the perfect editorial mood for our cover feature. She curated a stunning collection of layout-friendly images.',
        date: '2026-05-30'
      }
    ],
    analytics: {
      totalViews: 5860,
      totalInquiries: 94,
      conversionRate: 1.6,
      viewsHistory: [
        { label: 'Mon', count: 320 },
        { label: 'Tue', count: 410 },
        { label: 'Wed', count: 380 },
        { label: 'Thu', count: 450 },
        { label: 'Fri', count: 510 },
        { label: 'Sat', count: 680 },
        { label: 'Sun', count: 590 }
      ],
      reachByCategory: [
        { category: 'photography', percentage: 85 },
        { category: 'illustration', percentage: 12 },
        { category: 'videography', percentage: 3 },
        { category: 'design', percentage: 0 }
      ]
    }
  },
  {
    id: 'f3',
    username: 'kenji_design',
    fullName: 'Kenji Sato',
    title: 'Minimalist Brand & Typography Designer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    coverUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200',
    bio: 'Reducing complexity to find the absolute essence. I design clean brand visual systems, bold custom typefaces, and geometric layout architectures. Infused with Swiss typography guidelines and mid-century modern shapes.',
    location: 'Portland, OR',
    hourlyRate: 85,
    category: 'design',
    skills: ['Brand Identity', 'Swiss Typography', 'Figma', 'Adobe Illustrator', 'Packaging', 'Grid Systems'],
    theme: 'slate',
    layoutOrder: ['hero', 'categories', 'gallery', 'analytics', 'reviews', 'contact'],
    subscribedCategories: ['design', 'illustration'],
    notificationCount: 0,
    unreadMessagesCount: 0,
    email: 'kenji@sato-design.com',
    phone: '+254 712 333333',
    whatsapp: '+254712333333',
    categorySections: [
      {
        category: 'design',
        title: 'Brand Systems & Type',
        customThumbnail: 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&q=80&w=600',
        description: 'Complete cohesive visual structures, customized font glyphs, and responsive logos.',
        visible: true
      },
      {
        category: 'illustration',
        title: 'Geometric Vector Landscapes',
        customThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
        description: 'Architectural line drawings, structural shapes, and vector posters.',
        visible: true
      },
      {
        category: 'videography',
        title: 'Animated Brand Guidelines',
        customThumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
        description: 'Interactive and kinetic motion guidelines demonstrating brand flex.',
        visible: false
      },
      {
        category: 'photography',
        title: 'Architectural Framing',
        customThumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
        description: 'Symmetrical high-angle architectural photography documenting structural geometries.',
        visible: false
      }
    ],
    portfolio: [
      {
        id: 'p3_1',
        title: 'Kanso - Eco-Skincare Identity',
        description: 'A completely sustainable visual system featuring zero-waste embossed packaging and customized humanist typography.',
        category: 'design',
        imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600',
        likes: 184,
        views: 1100,
        date: '2026-03-10'
      },
      {
        id: 'p3_2',
        title: 'Symmetry - Architecture Biannual',
        description: 'Editorial grid system and typographical layout for a 120-page quarterly design architecture publication.',
        category: 'design',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
        likes: 156,
        views: 940,
        date: '2026-04-18'
      },
      {
        id: 'p3_3',
        title: 'Neo-Bauhaus Custom Typeface',
        description: 'A display typeface with circular geometries, modular stencils, and highly geometric weight distributions.',
        category: 'design',
        imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600',
        likes: 220,
        views: 1530,
        date: '2026-05-02'
      },
      {
        id: 'p3_4',
        title: 'Monolithic Dreams - Vector Print',
        description: 'High-contrast monochrome vector landscape print focusing on vertical brutalist pillars.',
        category: 'illustration',
        imageUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600',
        likes: 95,
        views: 450,
        date: '2026-05-29'
      }
    ],
    reviews: [
      {
        id: 'r3_1',
        authorName: 'Yuki Takahashi',
        authorRole: 'Product Lead, Kanso Organic',
        rating: 5,
        comment: 'Kenji captured our minimalist core perfectly. Our brand guidelines are beautiful, clean, and extremely easy for our internal engineering teams to utilize.',
        date: '2026-03-22'
      },
      {
        id: 'r3_2',
        authorName: 'Lars Thorsen',
        authorRole: 'Publisher, Nordic Press',
        rating: 5,
        comment: 'Outstanding attention to layout margins, typesetting, and print tolerances. The magazine layout feels beautifully balanced and timeless.',
        date: '2026-05-01'
      }
    ],
    analytics: {
      totalViews: 2540,
      totalInquiries: 32,
      conversionRate: 1.25,
      viewsHistory: [
        { label: 'Mon', count: 90 },
        { label: 'Tue', count: 110 },
        { label: 'Wed', count: 140 },
        { label: 'Thu', count: 130 },
        { label: 'Fri', count: 180 },
        { label: 'Sat', count: 140 },
        { label: 'Sun', count: 120 }
      ],
      reachByCategory: [
        { category: 'design', percentage: 80 },
        { category: 'illustration', percentage: 15 },
        { category: 'photography', percentage: 5 },
        { category: 'videography', percentage: 0 }
      ]
    }
  },
  {
    id: 'f4',
    username: 'maya_art',
    fullName: 'Maya Lin',
    title: 'Editorial Illustrator & Visual Artist',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    coverUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200',
    bio: 'Splashing raw stories with vibrant ink and whimsical curves! I craft detailed digital and hand-painted illustrations for magazines, children\'s books, packaging labels, and immersive mural spaces. My style is playful, narrative-driven, and highly memorable.',
    location: 'Austin, TX',
    hourlyRate: 75,
    category: 'illustration',
    skills: ['Procreate', 'Digital Ink', 'Children\'s Book Art', 'Mural Design', 'Pattern Design', 'Color Scripting'],
    theme: 'brutalist',
    layoutOrder: ['hero', 'categories', 'gallery', 'analytics', 'reviews', 'contact'],
    subscribedCategories: ['illustration', 'design'],
    notificationCount: 1,
    unreadMessagesCount: 0,
    email: 'maya@lin-illustration.com',
    phone: '+254 712 444444',
    whatsapp: '+254712444444',
    categorySections: [
      {
        category: 'illustration',
        title: 'Editorial & Book Art',
        customThumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600',
        description: 'Vivid narrative scenes exploring diverse characters, soft plants, and quirky animals.',
        visible: true
      },
      {
        category: 'design',
        title: 'Playful Packaging Labels',
        customThumbnail: 'https://images.unsplash.com/photo-1515260268569-9271009adfdb?auto=format&fit=crop&q=80&w=600',
        description: 'Illustrative label systems, wrapping papers, and whimsical craft box branding.',
        visible: true
      },
      {
        category: 'photography',
        title: 'Reference Doodles',
        customThumbnail: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600',
        description: 'Sketches drawn over photography capturing silly moods and urban walks.',
        visible: false
      },
      {
        category: 'videography',
        title: 'Frame-by-Frame Loops',
        customThumbnail: 'https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?auto=format&fit=crop&q=80&w=600',
        description: 'Hand-drawn cell-animated GIFs with organic textures and fluid morphs.',
        visible: false
      }
    ],
    portfolio: [
      {
        id: 'p4_1',
        title: 'The Secret Life of Roots - Editorial',
        description: 'A whimsical cross-section illustration of woodland ecosystems showing tiny fairy cities beneath trees.',
        category: 'illustration',
        imageUrl: 'https://images.unsplash.com/photo-1501472312651-726afd116ff1?auto=format&fit=crop&q=80&w=600',
        likes: 412,
        views: 3100,
        date: '2026-02-15'
      },
      {
        id: 'p4_2',
        title: 'Botanical Harmony - Craft Kombucha',
        description: 'Custom organic label illustrations for a premium botanical tea line featuring hibiscus and wild jasmine drawings.',
        category: 'illustration',
        imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',
        likes: 290,
        views: 2200,
        date: '2026-05-20'
      },
      {
        id: 'p4_3',
        title: 'Cosmic Voyager - Children\'s Cover',
        description: 'Book cover illustration showing a young girl navigating an origami spacecraft through a watercolor galaxy.',
        category: 'illustration',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
        likes: 380,
        views: 2750,
        date: '2026-06-08'
      },
      {
        id: 'p4_4',
        title: 'Abstract Botanical Seamless Pattern',
        description: 'Repeated pattern designs capturing playful foliage and retro sun motifs for textile wraps.',
        category: 'design',
        imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600',
        likes: 195,
        views: 1120,
        date: '2026-06-22'
      }
    ],
    reviews: [
      {
        id: 'r4_1',
        authorName: 'Benjamin Shaw',
        authorRole: 'Art Editor, Chronicle Books',
        rating: 5,
        comment: 'Maya\'s illustrations are bursting with soul and visual wit! She responded beautifully to our manuscript critique and created a world that kids instantly fall in love with.',
        date: '2026-03-01'
      },
      {
        id: 'r4_2',
        authorName: 'Carla Ruiz',
        authorRole: 'CEO, Roots Brewing Co.',
        rating: 5,
        comment: 'The Kombucha labels she drew have turned our bottle into a collectible artwork. Customers regularly comment on how stunning the illustration is. A dream to work with!',
        date: '2026-05-28'
      }
    ],
    analytics: {
      totalViews: 4180,
      totalInquiries: 65,
      conversionRate: 1.55,
      viewsHistory: [
        { label: 'Mon', count: 210 },
        { label: 'Tue', count: 260 },
        { label: 'Wed', count: 290 },
        { label: 'Thu', count: 240 },
        { label: 'Fri', count: 310 },
        { label: 'Sat', count: 480 },
        { label: 'Sun', count: 420 }
      ],
      reachByCategory: [
        { category: 'illustration', percentage: 88 },
        { category: 'design', percentage: 10 },
        { category: 'photography', percentage: 2 },
        { category: 'videography', percentage: 0 }
      ]
    }
  }
];

export const initialJobs: Job[] = [
  {
    id: 'j1',
    title: 'Sleek 30-Second Promotional Brand Film',
    clientName: 'Sarah Jenkins',
    clientCompany: 'Volt Apparel',
    category: 'videography',
    budgetRange: 'KSh 150,000 - KSh 250,000',
    location: 'Remote / Los Angeles, CA',
    description: 'Looking for a videographer to shoot and edit a high-impact, kinetic 30-second promo for our sustainable streetwear launch. Style needs to be fast-paced, high-contrast, utilizing interesting urban night shots and heavy color grading. Creative direction will be provided, but need your artistry to make it pop!',
    postedDate: '2026-06-28',
    applicantsCount: 4,
    clientEmail: 's.jenkins@voltapparel.com',
    clientPhone: '+254 712 999111',
    clientWhatsapp: '+254712999111',
    startDate: '2026-07-10',
    deliveryDeadline: '2026-07-25',
    status: 'open',
    unlockCount: 3,
    unlockPriceKsh: 50
  },
  {
    id: 'j2',
    title: 'High-Fashion Editorial Cover Shoot',
    clientName: 'Marc Jacobs',
    clientCompany: 'Atelier NYC',
    category: 'photography',
    budgetRange: 'KSh 300,000 - KSh 450,000',
    location: 'Brooklyn, NY Studio',
    description: 'Seeking a fine-art editorial photographer for an indoor/outdoor studio modeling shoot for our Autumn Linen Collection cover. Needs a soft, analog, natural light feel with warm grain textures. Must have experience guiding models and working closely with wardrobe stylists.',
    postedDate: '2026-06-29',
    applicantsCount: 2,
    clientEmail: 'm.jacobs@ateliernyc.com',
    clientPhone: '+254 712 999222',
    clientWhatsapp: '+254712999222',
    startDate: '2026-07-15',
    deliveryDeadline: '2026-08-01',
    status: 'closed',
    unlockCount: 20,
    unlockPriceKsh: 50
  },
  {
    id: 'j3',
    title: 'SaaS App Brand Strategy & Visual Identity',
    clientName: 'Gavin Vance',
    clientCompany: 'ApexFlow Tech',
    category: 'design',
    budgetRange: 'KSh 400,000 - KSh 600,000',
    location: 'Remote',
    description: 'We are rebranding our enterprise workflow software and need a modern, minimalist visual system designed from scratch. Deliverables include a responsive logo mark, customized typography style guide, 8-page brand manual, vector icons, and layout guidance for our engineering team. Only minimal, sleek styles, please!',
    postedDate: '2026-06-30',
    applicantsCount: 1,
    clientEmail: 'g.vance@apexflow.tech',
    clientPhone: '+254 712 999333',
    clientWhatsapp: '+254712999333',
    startDate: '2026-07-05',
    deliveryDeadline: '2026-07-31',
    status: 'open',
    unlockCount: 15,
    unlockPriceKsh: 50
  },
  {
    id: 'j4',
    title: 'Whimsical Illustrations for Children\'s Book',
    clientName: 'Claire Dupon',
    clientCompany: 'MagicTree Publishing',
    category: 'illustration',
    budgetRange: 'KSh 200,000 - KSh 350,000',
    location: 'Remote',
    description: 'Looking for a children\'s book illustrator to create 14 custom double-page spreads + a colorful cover illustration. The book features two adventurous squirrels navigating a hidden mystical forest. Needs a warm, narrative-driven aesthetic with cute character details.',
    postedDate: '2026-06-25',
    applicantsCount: 8,
    clientEmail: 'c.dupon@magictree.com',
    clientPhone: '+254 712 999444',
    clientWhatsapp: '+254712999444',
    startDate: '2026-08-01',
    deliveryDeadline: '2026-09-15',
    status: 'open',
    unlockCount: 0,
    unlockPriceKsh: 50
  }
];

export const initialConversations: Conversation[] = [
  {
    id: 'c1',
    freelancerId: 'f1',
    freelancerName: 'Alex Rivera',
    freelancerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    clientName: 'Sarah Jenkins',
    lastMessageText: 'The draft editing looks gorgeous! Can we tweak the sound effect in the transition at 0:15?',
    lastMessageTime: '12:15 PM',
    unread: true,
    messages: [
      {
        id: 'm1_1',
        senderId: 'client',
        senderName: 'Sarah Jenkins',
        content: 'Hi Alex, we saw your portfolio and are absolutely blown away by your Urban Streetwear Campaign. We want to shoot something similar for our upcoming winter launch.',
        timestamp: '2026-06-29 10:30 AM'
      },
      {
        id: 'm1_2',
        senderId: 'f1',
        senderName: 'Alex Rivera',
        content: 'Hi Sarah! Thank you so much. I had an absolute blast shooting that campaign. I\'d love to hear more about your winter launch and the kind of vibe you\'re looking for.',
        timestamp: '2026-06-29 11:05 AM'
      },
      {
        id: 'm1_3',
        senderId: 'client',
        senderName: 'Sarah Jenkins',
        content: 'The draft editing looks gorgeous! Can we tweak the sound effect in the transition at 0:15?',
        timestamp: '2026-06-30 12:15 PM'
      }
    ]
  },
  {
    id: 'c2',
    freelancerId: 'f2',
    freelancerName: 'Elena Rostova',
    freelancerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    clientName: 'Marc Jacobs',
    lastMessageText: 'Sounds like a great plan. Let\'s lock in the studio booking for next Tuesday.',
    lastMessageTime: 'Yesterday',
    unread: false,
    messages: [
      {
        id: 'm2_1',
        senderId: 'client',
        senderName: 'Marc Jacobs',
        content: 'Hey Elena, do you have availability for an editorial shoot next week? We need that authentic film grain feeling.',
        timestamp: '2026-06-28 02:40 PM'
      },
      {
        id: 'm2_2',
        senderId: 'f2',
        senderName: 'Elena Rostova',
        content: 'Absolutely Marc! I shoot almost exclusively on 120mm medium format. I have next Tuesday and Friday completely free.',
        timestamp: '2026-06-28 03:15 PM'
      },
      {
        id: 'm2_3',
        senderId: 'client',
        senderName: 'Marc Jacobs',
        content: 'Sounds like a great plan. Let\'s lock in the studio booking for next Tuesday.',
        timestamp: '2026-06-29 09:20 AM'
      }
    ]
  }
];
