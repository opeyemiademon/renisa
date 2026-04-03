/**
 * Fallback demo data for all public pages.
 * Used when the backend has no data yet, so the UI looks rich during development/preview.
 * All images are from Unsplash (free to use).
 */

// ─── EXECUTIVES ───────────────────────────────────────────────────────────────
export const SAMPLE_EXECUTIVES = [
  {
    id: 'x1',
    name: 'Chief Emmanuel Adeyemi',
    position: 'President',
    tenure: '2022 – Present',
    sport: 'Football',
    bio: 'Chief Emmanuel Adeyemi is a retired Super Eagles legend with over 15 years of international football experience. He represented Nigeria in two Africa Cup of Nations tournaments and was instrumental in shaping youth football development in Lagos State before taking on leadership roles in retired sports administration.',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80&auto=format&fit=crop&crop=face',
    socialLinks: [{ platform: 'twitter', url: '#' }, { platform: 'linkedin', url: '#' }],
  },
  {
    id: 'x2',
    name: 'Dr. Amaka Okafor',
    position: 'Vice President',
    tenure: '2022 – Present',
    sport: 'Athletics',
    bio: 'Dr. Amaka Okafor is a three-time national athletics champion and a Commonwealth Games bronze medalist in the 400m hurdles. She holds a doctorate in Sports Science from the University of Lagos and has dedicated her post-athletic career to sports research and advocacy for female athletes.',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=80&auto=format&fit=crop&crop=face',
    socialLinks: [{ platform: 'twitter', url: '#' }, { platform: 'facebook', url: '#' }],
  },
  {
    id: 'x3',
    name: 'Barr. Chukwuemeka Nwosu',
    position: 'Secretary General',
    tenure: '2022 – Present',
    sport: 'Boxing',
    bio: 'Barrister Chukwuemeka Nwosu was a celebrated middleweight boxer who won gold at the All-Africa Games in 1999. After retiring from the sport, he obtained his law degree and has since championed the legal rights of retired athletes, ensuring they receive deserved welfare benefits and recognition.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80&auto=format&fit=crop&crop=face',
    socialLinks: [{ platform: 'linkedin', url: '#' }],
  },
  {
    id: 'x4',
    name: 'Mrs. Fatima Bello',
    position: 'Treasurer',
    tenure: '2022 – Present',
    sport: 'Table Tennis',
    bio: 'Mrs. Fatima Bello is a former national table tennis champion who represented Nigeria at the World Table Tennis Championships on four occasions. She brings 20 years of financial management experience to RENISA, having worked in banking before taking on her current role in sports administration.',
    photo: 'https://images.unsplash.com/photo-1551717704-3f7bfc166498?w=500&q=80&auto=format&fit=crop&crop=face',
    socialLinks: [{ platform: 'twitter', url: '#' }],
  },
  {
    id: 'x5',
    name: 'Engr. Biodun Afolabi',
    position: 'Public Relations Officer',
    tenure: '2022 – Present',
    sport: 'Tennis',
    bio: 'Engr. Biodun Afolabi is a retired professional tennis player who competed at the Davis Cup level for Nigeria throughout the 1990s. A chartered civil engineer by profession, he has leveraged his media relations skills to build awareness for RENISA across Nigerian media outlets.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80&auto=format&fit=crop&crop=face',
    socialLinks: [{ platform: 'twitter', url: '#' }, { platform: 'linkedin', url: '#' }],
  },
  {
    id: 'x6',
    name: 'Prof. Ngozi Adichie-Eze',
    position: 'Welfare Officer',
    tenure: '2022 – Present',
    sport: 'Swimming',
    bio: 'Professor Ngozi Adichie-Eze is a pioneer of competitive swimming in Nigeria and a two-time All-Africa Games participant. She is a professor of Physical Education at Nnamdi Azikiwe University and has authored several books on sports welfare in West Africa.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80&auto=format&fit=crop&crop=face',
    socialLinks: [{ platform: 'twitter', url: '#' }, { platform: 'facebook', url: '#' }],
  },
  {
    id: 'x7',
    name: 'Dr. Kayode Olawale',
    position: 'Legal Adviser',
    tenure: '2022 – Present',
    sport: 'Cricket',
    bio: 'Dr. Kayode Olawale was a prominent figure in Nigerian cricket, captaining the national team for five years in the 2000s. He later obtained his doctorate in Sports Law from the University of Ibadan and now provides crucial legal guidance to RENISA on regulatory and governance matters.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80&auto=format&fit=crop&crop=face',
    socialLinks: [{ platform: 'linkedin', url: '#' }],
  },
  {
    id: 'x8',
    name: 'Alhaji Sule Musa',
    position: 'Financial Secretary',
    tenure: '2022 – Present',
    sport: 'Weightlifting',
    bio: 'Alhaji Sule Musa is a former Nigerian weightlifting champion who set national records in the super-heavyweight category in the 1990s. He has a background in accounting and brings meticulous financial discipline to RENISA\'s operations as Financial Secretary.',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80&auto=format&fit=crop&crop=face',
    socialLinks: [{ platform: 'twitter', url: '#' }, { platform: 'facebook', url: '#' }],
  },
]

// ─── EVENTS ───────────────────────────────────────────────────────────────────
export const SAMPLE_EVENTS = [
  {
    id: 'e1', slug: 'renisa-annual-awards-night-2025', eventType: 'event', status: 'published',
    eventDate: '2025-07-18', venue: 'Eko Hotel & Suites, Lagos',
    title: 'RENISA Annual Awards Night 2025',
    excerpt: 'A grand evening celebrating our sports legends with awards, speeches and cultural performances.',
    content: 'The RENISA Annual Awards Night 2025 is set to be the most prestigious gathering of retired Nigerian sports heroes. This glittering ceremony will honour athletes who gave their best for the green-and-white flag, with special recognition for lifetime achievement awardees and emerging sports ambassadors.',
    coverImage: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'e2', slug: 'veterans-sports-day-lagos-2025', eventType: 'event', status: 'published',
    eventDate: '2025-08-22', venue: 'National Stadium, Surulere, Lagos',
    title: 'Veterans Sports Day — Lagos 2025',
    excerpt: 'Retired athletes across disciplines come together for camaraderie, light sports and networking.',
    content: 'The Veterans Sports Day brings together RENISA members from across Nigeria for a day of fun, light sports competitions, networking and storytelling. Events include friendly football matches, relay races, chess tournaments, and a veterans swimming gala.',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'e3', slug: 'renisa-leadership-summit-2025', eventType: 'announcement', status: 'published',
    eventDate: '2025-09-10', venue: 'Transcorp Hilton, Abuja',
    title: 'RENISA National Leadership Summit',
    excerpt: 'A two-day summit bringing together RENISA leadership, members and stakeholders to chart the future.',
    content: 'The RENISA National Leadership Summit will address key issues affecting retired athletes in Nigeria, including pension reforms, healthcare access, and recognition policies. Distinguished guests include Ministry of Sports officials and Olympic gold medallists.',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'e4', slug: 'sports-welfare-workshop-2025', eventType: 'news', status: 'published',
    eventDate: '2025-06-05', venue: 'Online (Zoom)',
    title: 'Sports Welfare & Pension Rights Workshop',
    excerpt: 'A virtual workshop educating retired athletes on accessing government welfare schemes and pension rights.',
    content: 'RENISA in collaboration with the Sports Ministry is organizing a comprehensive online workshop on welfare entitlements for retired athletes. Participants will learn about government pension programmes, healthcare access points, and legal rights.',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'e5', slug: 'football-legends-reunion-2025', eventType: 'event', status: 'published',
    eventDate: '2025-10-15', venue: 'MKO Abiola Stadium, Abuja',
    title: 'Football Legends Reunion Match 2025',
    excerpt: 'Nigeria\'s greatest football legends reunite on the pitch for a once-in-a-lifetime exhibition match.',
    content: 'Watch the legendary Super Eagles veterans relive their glorious days as they face off in a special exhibition match. This annual tradition has become one of RENISA\'s most loved events, drawing thousands of fans and media attention.',
    coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'e6', slug: 'renisa-boxing-heritage-night', eventType: 'news', status: 'published',
    eventDate: '2025-05-20', venue: 'Lagos Continental Hotel',
    title: 'RENISA Boxing Heritage Night',
    excerpt: 'Celebrating Nigeria\'s boxing immortals — a tribute to Dick Tiger, Hogan Bassey and their successors.',
    content: 'Nigeria\'s rich boxing heritage is celebrated at this special tribute event. The evening will feature documentary screenings, panel discussions with former champions, and a special induction of two new members into the RENISA Boxing Hall of Fame.',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&auto=format&fit=crop',
  },
]

// ─── GALLERY ──────────────────────────────────────────────────────────────────
export const SAMPLE_GALLERY = [
  { id: 'g1', imageUrl: 'https://images.unsplash.com/photo-1546519638405-a2b03ac5f4bf?w=800&q=80&auto=format&fit=crop', title: 'Basketball Tournament Finals', albumName: 'Annual Games 2024', year: 2024, description: 'Veterans basketball tournament finals at the National Stadium.' },
  { id: 'g2', imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80&auto=format&fit=crop', title: 'Athletics Championship', albumName: 'Athletics Meet 2024', year: 2024, description: 'Retired athletics champions in action at the RENISA athletics meet.' },
  { id: 'g3', imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80&auto=format&fit=crop', title: 'Football Exhibition Match', albumName: 'Football Legends 2024', year: 2024, description: 'The annual football legends exhibition match drew thousands of fans.' },
  { id: 'g4', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80&auto=format&fit=crop', title: 'National Stadium Anniversary', albumName: 'Special Events 2024', year: 2024, description: 'RENISA celebrated the National Stadium\'s anniversary with a special ceremony.' },
  { id: 'g5', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop', title: 'Boxing Veterans Gala', albumName: 'Awards Night 2024', year: 2024, description: 'Boxing legends were honoured at the annual gala dinner.' },
  { id: 'g6', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80&auto=format&fit=crop', title: 'Football Legends Day', albumName: 'Football Legends 2024', year: 2024, description: 'Former Super Eagles players reunited for a day of celebration.' },
  { id: 'g7', imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80&auto=format&fit=crop', title: 'Awards Night 2024', albumName: 'Awards Night 2024', year: 2024, description: 'RENISA Annual Awards Night recognizing the best among our legends.' },
  { id: 'g8', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop', title: 'Leadership Summit', albumName: 'Special Events 2024', year: 2024, description: 'National leadership summit bringing together RENISA officers across states.' },
  { id: 'g9', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80&auto=format&fit=crop', title: 'Welfare Workshop', albumName: 'Workshops 2024', year: 2024, description: 'Welfare and pension rights workshop for retired athletes.' },
  { id: 'g10', imageUrl: 'https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?w=800&q=80&auto=format&fit=crop', title: 'Swimming Gala', albumName: 'Annual Games 2024', year: 2024, description: 'Retired swimming champions competed in the annual veterans gala.' },
  { id: 'g11', imageUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&q=80&auto=format&fit=crop', title: 'Table Tennis Championship', albumName: 'Annual Games 2024', year: 2024, description: 'Intense table tennis matches at the RENISA games.' },
  { id: 'g12', imageUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&q=80&auto=format&fit=crop', title: 'General Assembly 2024', albumName: 'Special Events 2024', year: 2024, description: 'Members gathered at the annual general assembly to elect new officers.' },
]

// ─── AWARDS ───────────────────────────────────────────────────────────────────
export const SAMPLE_AWARDS = [
  {
    id: 'a1', title: 'Lifetime Achievement Award', recipientName: 'Sunday Oliseh', year: 2024,
    category: { id: 'c1', name: 'Football' }, totalVotes: 148, votingEnabled: false,
    description: 'Awarded for an unparalleled career that spanned three decades and took Nigerian football to new heights.',
    recipientPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'a2', title: 'Excellence in Athletics', recipientName: 'Chioma Ajunwa', year: 2024,
    category: { id: 'c2', name: 'Athletics' }, totalVotes: 203, votingEnabled: false,
    description: 'For Olympic gold medal achievement and decades of inspiring young female athletes across Nigeria.',
    recipientPhoto: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'a3', title: 'Legend of the Year', recipientName: 'Nwankwo Kanu', year: 2024,
    category: { id: 'c3', name: 'Football' }, totalVotes: 315, votingEnabled: false,
    description: 'Recognizing a true Nigerian sports icon whose legacy transcends football and touches hearts worldwide.',
    recipientPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'a4', title: 'Trailblazer Award', recipientName: 'Dick Tiger Jr.', year: 2024,
    category: { id: 'c4', name: 'Boxing' }, totalVotes: 89, votingEnabled: false,
    description: 'Following in the footsteps of his legendary father, this award celebrates a new generation of boxing excellence.',
    recipientPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'a5', title: 'Community Impact Award', recipientName: 'Fatima Yusuf', year: 2024,
    category: { id: 'c5', name: 'Community' }, totalVotes: 67, votingEnabled: true,
    description: 'Honoring a retired athlete who has given back to her community through sports mentorship programs.',
    recipientPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'a6', title: 'Sports Ambassador Award', recipientName: 'Emeka Ezeugo', year: 2023,
    category: { id: 'c6', name: 'Basketball' }, totalVotes: 142, votingEnabled: false,
    description: 'For outstanding contribution to promoting basketball development at the grassroots level in Nigeria.',
    recipientPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&crop=face',
  },
]

// ─── ALUMNI / MEMBERS ─────────────────────────────────────────────────────────
export const SAMPLE_NEW_MEMBERS = [
  { id: 'm1', firstName: 'Tunde', lastName: 'Adeyinka', sport: 'Athletics', state: 'Lagos', memberNumber: 'RNS-2025-001', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&crop=face' },
  { id: 'm2', firstName: 'Grace', lastName: 'Okonkwo', sport: 'Swimming', state: 'Anambra', memberNumber: 'RNS-2025-002', profilePicture: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80&auto=format&fit=crop&crop=face' },
  { id: 'm3', firstName: 'Ibrahim', lastName: 'Musa', sport: 'Football', state: 'Kano', memberNumber: 'RNS-2025-003', profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&auto=format&fit=crop&crop=face' },
  { id: 'm4', firstName: 'Ngozi', lastName: 'Eze', sport: 'Tennis', state: 'Enugu', memberNumber: 'RNS-2025-004', profilePicture: 'https://images.unsplash.com/photo-1551717704-3f7bfc166498?w=200&q=80&auto=format&fit=crop&crop=face' },
  { id: 'm5', firstName: 'Seun', lastName: 'Balogun', sport: 'Boxing', state: 'Ogun', memberNumber: 'RNS-2025-005', profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&auto=format&fit=crop&crop=face' },
  { id: 'm6', firstName: 'Aisha', lastName: 'Abdullahi', sport: 'Table Tennis', state: 'Katsina', memberNumber: 'RNS-2025-006', profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop&crop=face' },
]

export const SAMPLE_ALUMNI = [
  { id: 'al1', firstName: 'Rashidi', lastName: 'Yekini', sport: 'Football', state: 'Oyo', memberNumber: 'RNS-0001', profilePicture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80&auto=format&fit=crop&crop=face' },
  { id: 'al2', firstName: 'Hilda', lastName: 'Anozie', sport: 'Athletics', state: 'Lagos', memberNumber: 'RNS-0002', profilePicture: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&q=80&auto=format&fit=crop&crop=face' },
  { id: 'al3', firstName: 'Emeka', lastName: 'Ezeugo', sport: 'Basketball', state: 'Imo', memberNumber: 'RNS-0003', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop&crop=face' },
  { id: 'al4', firstName: 'Fatima', lastName: 'Bolaji', sport: 'Tennis', state: 'Abuja', memberNumber: 'RNS-0004', profilePicture: 'https://images.unsplash.com/photo-1551717704-3f7bfc166498?w=300&q=80&auto=format&fit=crop&crop=face' },
  { id: 'al5', firstName: 'Olumide', lastName: 'Oyedeji', sport: 'Basketball', state: 'Ogun', memberNumber: 'RNS-0005', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop&crop=face' },
  { id: 'al6', firstName: 'Beatrice', lastName: 'Uche', sport: 'Swimming', state: 'Rivers', memberNumber: 'RNS-0006', profilePicture: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80&auto=format&fit=crop&crop=face' },
  { id: 'al7', firstName: 'Sani', lastName: 'Abacha Jr.', sport: 'Boxing', state: 'Kano', memberNumber: 'RNS-0007', profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80&auto=format&fit=crop&crop=face' },
  { id: 'al8', firstName: 'Ngozi', lastName: 'Adeyemi', sport: 'Volleyball', state: 'Anambra', memberNumber: 'RNS-0008', profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&auto=format&fit=crop&crop=face' },
  { id: 'al9', firstName: 'Tunde', lastName: 'Kelani', sport: 'Table Tennis', state: 'Ekiti', memberNumber: 'RNS-0009', profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80&auto=format&fit=crop&crop=face' },
  { id: 'al10', firstName: 'Akon', lastName: 'Eyong', sport: 'Football', state: 'Cross River', memberNumber: 'RNS-0010', profilePicture: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&q=80&auto=format&fit=crop&crop=face' },
  { id: 'al11', firstName: 'Aminu', lastName: 'Sango', sport: 'Athletics', state: 'Sokoto', memberNumber: 'RNS-0011', profilePicture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80&auto=format&fit=crop&crop=face' },
  { id: 'al12', firstName: 'Chidinma', lastName: 'Obi', sport: 'Gymnastics', state: 'Edo', memberNumber: 'RNS-0012', profilePicture: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&q=80&auto=format&fit=crop&crop=face' },
]

// ─── BOARD OF TRUSTEES ────────────────────────────────────────────────────────
export const SAMPLE_BOT = [
  { id: 'b1', name: 'Col. (Rtd) Patrick Osagie', position: 'Chairman, Board of Trustees', profilePicture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Edo', tenureStart: '2018-01-15', slug: 'col-rtd-patrick-osagie' },
  { id: 'b2', name: 'Sen. (Rtd) Hajiya Zainab Garba', position: 'Vice Chairman, Board of Trustees', profilePicture: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Sokoto', tenureStart: '2018-01-15', slug: 'hajiya-zainab-garba' },
  { id: 'b3', name: 'Chief Emeka Iloputaife', position: 'Trustee', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Anambra', tenureStart: '2018-01-15', slug: 'chief-emeka-iloputaife' },
  { id: 'b4', name: 'Dr. (Mrs.) Funke Adesanya', position: 'Trustee', profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Lagos', tenureStart: '2020-03-01', slug: 'dr-funke-adesanya' },
  { id: 'b5', name: 'Alhaji Umar Faruk Shuaibu', position: 'Trustee', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Kano', tenureStart: '2020-03-01', slug: 'alhaji-umar-faruk-shuaibu' },
  { id: 'b6', name: 'Engr. Adaeze Okafor-Nwosu', position: 'Secretary, Board of Trustees', profilePicture: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Imo', tenureStart: '2018-01-15', slug: 'engr-adaeze-okafor-nwosu' },
  { id: 'b7', name: 'Prof. Babatunde Olawale', position: 'Trustee', profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Oyo', tenureStart: '2022-06-01', slug: 'prof-babatunde-olawale' },
  { id: 'b8', name: 'Mrs. Christiana Obi-Eze', position: 'Trustee', profilePicture: 'https://images.unsplash.com/photo-1551717704-3f7bfc166498?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Rivers', tenureStart: '2022-06-01', slug: 'mrs-christiana-obi-eze' },
]

// ─── STATE EXECUTIVES ─────────────────────────────────────────────────────────
export const SAMPLE_STATE_EXECUTIVES = [
  { id: 'se1', name: 'Alhaji Musa Danjuma', position: 'State Chairman', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Kano', tenureStart: '2022-01-01', slug: 'alhaji-musa-danjuma' },
  { id: 'se2', name: 'Mrs. Ngozi Enwezor', position: 'State Chairman', profilePicture: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Anambra', tenureStart: '2022-01-01', slug: 'mrs-ngozi-enwezor' },
  { id: 'se3', name: 'Chief Biodun Alade', position: 'State Chairman', profilePicture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Lagos', tenureStart: '2022-01-01', slug: 'chief-biodun-alade' },
  { id: 'se4', name: 'Dr. Aminu Shehu', position: 'State Chairman', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Kaduna', tenureStart: '2022-01-01', slug: 'dr-aminu-shehu' },
  { id: 'se5', name: 'Barr. Efetobo Agas', position: 'State Chairman', profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Delta', tenureStart: '2022-01-01', slug: 'barr-efetobo-agas' },
  { id: 'se6', name: 'Mrs. Aisha Umar', position: 'State Chairman', profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Sokoto', tenureStart: '2022-01-01', slug: 'mrs-aisha-umar' },
  { id: 'se7', name: 'Mr. Emeka Akpan', position: 'State Chairman', profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Akwa Ibom', tenureStart: '2022-01-01', slug: 'mr-emeka-akpan' },
  { id: 'se8', name: 'Chief Festus Okafor', position: 'State Chairman', profilePicture: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Enugu', tenureStart: '2022-01-01', slug: 'chief-festus-okafor' },
  { id: 'se9', name: 'Dr. Halima Yusuf', position: 'State Chairman', profilePicture: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Katsina', tenureStart: '2022-01-01', slug: 'dr-halima-yusuf' },
  { id: 'se10', name: 'Mr. Segun Adeyemi', position: 'State Chairman', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Ogun', tenureStart: '2022-01-01', slug: 'mr-segun-adeyemi' },
  { id: 'se11', name: 'Mrs. Grace Nwosu', position: 'State Chairman', profilePicture: 'https://images.unsplash.com/photo-1551717704-3f7bfc166498?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Rivers', tenureStart: '2022-01-01', slug: 'mrs-grace-nwosu' },
  { id: 'se12', name: 'Alhaji Ibrahim Bello', position: 'State Chairman', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop&crop=face', state: 'Borno', tenureStart: '2022-01-01', slug: 'alhaji-ibrahim-bello' },
]

// ─── DIRECTORATE ──────────────────────────────────────────────────────────────
export const SAMPLE_DIRECTORATE = [
  { id: 'dir1', name: 'Mr. Chukwudi Obi', position: 'Director of Operations', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop&crop=face', state: undefined, tenureStart: '2022-01-15', slug: 'chukwudi-obi' },
  { id: 'dir2', name: 'Mrs. Toyin Akinpelu', position: 'Director of Finance', profilePicture: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80&auto=format&fit=crop&crop=face', state: undefined, tenureStart: '2022-01-15', slug: 'toyin-akinpelu' },
  { id: 'dir3', name: 'Dr. Felix Amara', position: 'Director of Welfare', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop&crop=face', state: undefined, tenureStart: '2022-01-15', slug: 'felix-amara' },
  { id: 'dir4', name: 'Ms. Adaora Igwe', position: 'Director of Communications', profilePicture: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&q=80&auto=format&fit=crop&crop=face', state: undefined, tenureStart: '2022-01-15', slug: 'adaora-igwe' },
  { id: 'dir5', name: 'Mr. Bashir Maikano', position: 'Director of Sports Development', profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80&auto=format&fit=crop&crop=face', state: undefined, tenureStart: '2022-01-15', slug: 'bashir-maikano' },
  { id: 'dir6', name: 'Mrs. Comfort Ekpo', position: 'Director of Membership Services', profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&auto=format&fit=crop&crop=face', state: undefined, tenureStart: '2022-01-15', slug: 'comfort-ekpo' },
  { id: 'dir7', name: 'Mr. Kunle Fajimi', position: 'Director of Events & Programmes', profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80&auto=format&fit=crop&crop=face', state: undefined, tenureStart: '2022-01-15', slug: 'kunle-fajimi' },
  { id: 'dir8', name: 'Dr. Patience Ogundipe', position: 'Director of Legal Affairs', profilePicture: 'https://images.unsplash.com/photo-1551717704-3f7bfc166498?w=300&q=80&auto=format&fit=crop&crop=face', state: undefined, tenureStart: '2023-03-01', slug: 'patience-ogundipe' },
]

// ─── DONATION TYPES ───────────────────────────────────────────────────────────
export const SAMPLE_DONATION_TYPES = [
  {
    id: 'd1',
    name: 'General Fund',
    description: 'Support RENISA\'s day-to-day operations, events, and welfare programmes for retired athletes across Nigeria.',
    donationMode: 'monetary',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'd2',
    name: 'Sports Equipment Drive',
    description: 'Donate sports equipment — balls, kits, training gear — to help underprivileged retired athletes and their communities.',
    donationMode: 'physical',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'd3',
    name: 'Healthcare Support Fund',
    description: 'Contribute to the medical and healthcare fund that assists retired athletes facing health challenges and disabilities.',
    donationMode: 'monetary',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'd4',
    name: 'Awards Night Sponsorship',
    description: 'Sponsor RENISA\'s annual awards night and gala dinner, helping us celebrate Nigeria\'s greatest sports legends in style.',
    donationMode: 'monetary',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'd5',
    name: 'Books & Education Materials',
    description: 'Donate books, laptops, stationery, and educational resources to support the children of retired athletes.',
    donationMode: 'physical',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'd6',
    name: 'Welfare Emergency Relief',
    description: 'Emergency relief donations for retired athletes facing sudden financial hardship, homelessness, or family crises.',
    donationMode: 'monetary',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

// ─── ADMIN: MEMBER LIST (full format for admin table) ─────────────────────────
export const SAMPLE_ADMIN_MEMBERS = [
  { id: 'am1', firstName: 'Tunde', lastName: 'Adeyinka', email: 'tunde.adeyinka@example.com', phone: '08012345678', sport: 'Athletics', state: 'Lagos', memberNumber: 'RNS-2025-001', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&crop=face', createdAt: '2025-01-10T10:00:00.000Z' },
  { id: 'am2', firstName: 'Grace', lastName: 'Okonkwo', email: 'grace.okonkwo@example.com', phone: '08023456789', sport: 'Swimming', state: 'Anambra', memberNumber: 'RNS-2025-002', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80&auto=format&fit=crop&crop=face', createdAt: '2025-01-15T10:00:00.000Z' },
  { id: 'am3', firstName: 'Ibrahim', lastName: 'Musa', email: 'ibrahim.musa@example.com', phone: '08034567890', sport: 'Football', state: 'Kano', memberNumber: 'RNS-2025-003', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&auto=format&fit=crop&crop=face', createdAt: '2025-01-20T10:00:00.000Z' },
  { id: 'am4', firstName: 'Ngozi', lastName: 'Eze', email: 'ngozi.eze@example.com', phone: '08045678901', sport: 'Tennis', state: 'Enugu', memberNumber: 'RNS-2025-004', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1551717704-3f7bfc166498?w=200&q=80&auto=format&fit=crop&crop=face', createdAt: '2025-02-01T10:00:00.000Z' },
  { id: 'am5', firstName: 'Seun', lastName: 'Balogun', email: 'seun.balogun@example.com', phone: '08056789012', sport: 'Boxing', state: 'Ogun', memberNumber: 'RNS-2025-005', status: 'suspended', profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&auto=format&fit=crop&crop=face', createdAt: '2025-02-05T10:00:00.000Z' },
  { id: 'am6', firstName: 'Aisha', lastName: 'Abdullahi', email: 'aisha.abdullahi@example.com', phone: '08067890123', sport: 'Table Tennis', state: 'Katsina', memberNumber: 'RNS-2025-006', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop&crop=face', createdAt: '2025-02-10T10:00:00.000Z' },
  { id: 'am7', firstName: 'Emeka', lastName: 'Okafor', email: 'emeka.okafor@example.com', phone: '08078901234', sport: 'Basketball', state: 'Imo', memberNumber: 'RNS-2025-007', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80&auto=format&fit=crop&crop=face', createdAt: '2025-02-15T10:00:00.000Z' },
  { id: 'am8', firstName: 'Fatima', lastName: 'Bello', email: 'fatima.bello@example.com', phone: '08089012345', sport: 'Volleyball', state: 'Abuja', memberNumber: 'RNS-2025-008', status: 'inactive', profilePicture: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&q=80&auto=format&fit=crop&crop=face', createdAt: '2025-03-01T10:00:00.000Z' },
  { id: 'am9', firstName: 'Kunle', lastName: 'Fajimi', email: 'kunle.fajimi@example.com', phone: '08090123456', sport: 'Cricket', state: 'Oyo', memberNumber: 'RNS-2024-089', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop&crop=face', createdAt: '2024-11-10T10:00:00.000Z' },
  { id: 'am10', firstName: 'Chinwe', lastName: 'Nwosu', email: 'chinwe.nwosu@example.com', phone: '08001234567', sport: 'Gymnastics', state: 'Rivers', memberNumber: 'RNS-2024-090', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&q=80&auto=format&fit=crop&crop=face', createdAt: '2024-11-20T10:00:00.000Z' },
]

// ─── ADMIN: PAYMENTS ──────────────────────────────────────────────────────────
export const SAMPLE_PAYMENTS = [
  { id: 'p1', member: { firstName: 'Tunde', lastName: 'Adeyinka', memberNumber: 'RNS-2025-001' }, paymentType: { name: 'Annual Dues' }, amount: 15000, year: 2025, status: 'successful', reference: 'TRF-20250110-001', createdAt: '2025-01-10T10:00:00.000Z' },
  { id: 'p2', member: { firstName: 'Grace', lastName: 'Okonkwo', memberNumber: 'RNS-2025-002' }, paymentType: { name: 'Registration Fee' }, amount: 25000, year: 2025, status: 'successful', reference: 'TRF-20250115-002', createdAt: '2025-01-15T10:00:00.000Z' },
  { id: 'p3', member: { firstName: 'Ibrahim', lastName: 'Musa', memberNumber: 'RNS-2025-003' }, paymentType: { name: 'Annual Dues' }, amount: 15000, year: 2025, status: 'pending', reference: null, createdAt: '2025-01-20T10:00:00.000Z' },
  { id: 'p4', member: { firstName: 'Ngozi', lastName: 'Eze', memberNumber: 'RNS-2025-004' }, paymentType: { name: 'Awards Gala Ticket' }, amount: 50000, year: 2025, status: 'successful', reference: 'TRF-20250201-004', createdAt: '2025-02-01T10:00:00.000Z' },
  { id: 'p5', member: { firstName: 'Seun', lastName: 'Balogun', memberNumber: 'RNS-2025-005' }, paymentType: { name: 'Annual Dues' }, amount: 15000, year: 2024, status: 'failed', reference: 'TRF-20250205-005', createdAt: '2025-02-05T10:00:00.000Z' },
  { id: 'p6', member: { firstName: 'Aisha', lastName: 'Abdullahi', memberNumber: 'RNS-2025-006' }, paymentType: { name: 'Annual Dues' }, amount: 15000, year: 2025, status: 'successful', reference: 'TRF-20250210-006', createdAt: '2025-02-10T10:00:00.000Z' },
  { id: 'p7', member: { firstName: 'Emeka', lastName: 'Okafor', memberNumber: 'RNS-2025-007' }, paymentType: { name: 'Sports Fund Levy' }, amount: 10000, year: 2025, status: 'successful', reference: 'TRF-20250215-007', createdAt: '2025-02-15T10:00:00.000Z' },
  { id: 'p8', member: { firstName: 'Fatima', lastName: 'Bello', memberNumber: 'RNS-2025-008' }, paymentType: { name: 'Registration Fee' }, amount: 25000, year: 2025, status: 'successful', reference: 'TRF-20250301-008', createdAt: '2025-03-01T10:00:00.000Z' },
]

// ─── ADMIN: ELECTIONS ─────────────────────────────────────────────────────────
export const SAMPLE_ELECTIONS = [
  { id: 'el1', title: 'National Executives Election 2025', year: 2025, status: 'active', startDate: '2025-06-01T00:00:00.000Z', endDate: '2025-06-30T23:59:59.000Z', positions: [{ id: 'pos1', name: 'President' }, { id: 'pos2', name: 'Vice President' }, { id: 'pos3', name: 'Secretary General' }] },
  { id: 'el2', title: 'Board of Trustees Election 2024', year: 2024, status: 'completed', startDate: '2024-03-01T00:00:00.000Z', endDate: '2024-03-31T23:59:59.000Z', positions: [{ id: 'pos4', name: 'Chairman' }, { id: 'pos5', name: 'Vice Chairman' }] },
  { id: 'el3', title: 'State Chapter Elections — Lagos 2025', year: 2025, status: 'draft', startDate: '2025-09-01T00:00:00.000Z', endDate: '2025-09-15T23:59:59.000Z', positions: [{ id: 'pos6', name: 'State Chairman' }] },
]

// ─── ADMIN: DONATIONS ─────────────────────────────────────────────────────────
export const SAMPLE_ADMIN_DONATIONS = [
  { id: 'dn1', donorName: 'Chief Biodun Alade', donorEmail: 'biodun@example.com', donationType: { name: 'General Fund' }, amount: 500000, status: 'successful', isAcknowledged: true, createdAt: '2025-01-05T10:00:00.000Z' },
  { id: 'dn2', donorName: 'Mrs. Ngozi Enwezor', donorEmail: 'ngozi@example.com', donationType: { name: 'Healthcare Support Fund' }, amount: 250000, status: 'successful', isAcknowledged: false, createdAt: '2025-01-12T10:00:00.000Z' },
  { id: 'dn3', donorName: 'Alhaji Musa Danjuma', donorEmail: 'musa@example.com', donationType: { name: 'Awards Night Sponsorship' }, amount: 1000000, status: 'successful', isAcknowledged: true, createdAt: '2025-02-01T10:00:00.000Z' },
  { id: 'dn4', donorName: 'Anonymous', donorEmail: '', donationType: { name: 'Welfare Emergency Relief' }, amount: 100000, status: 'pending', isAcknowledged: false, createdAt: '2025-02-15T10:00:00.000Z' },
  { id: 'dn5', donorName: 'Dr. Amaka Okafor', donorEmail: 'amaka@example.com', donationType: { name: 'General Fund' }, amount: 150000, status: 'successful', isAcknowledged: false, createdAt: '2025-03-01T10:00:00.000Z' },
]

export const SAMPLE_ADMIN_PHYSICAL_DONATIONS = [
  { id: 'ph1', donorName: 'Engr. Biodun Afolabi', donorPhone: '08012345678', donationType: { name: 'Sports Equipment Drive' }, itemDescription: '12 footballs, 4 sets of jerseys, 2 boxing gloves', status: 'successful', isAcknowledged: true, createdAt: '2025-01-20T10:00:00.000Z' },
  { id: 'ph2', donorName: 'Prof. Ngozi Adichie-Eze', donorPhone: '08023456789', donationType: { name: 'Books & Education Materials' }, itemDescription: '50 sports science textbooks, 10 laptops', status: 'successful', isAcknowledged: false, createdAt: '2025-02-10T10:00:00.000Z' },
  { id: 'ph3', donorName: 'Alhaji Sule Musa', donorPhone: '08034567890', donationType: { name: 'Sports Equipment Drive' }, itemDescription: 'Weightlifting equipment set — 200kg total', status: 'pending', isAcknowledged: false, createdAt: '2025-03-05T10:00:00.000Z' },
]

// ─── ADMIN: DASHBOARD STATS ───────────────────────────────────────────────────
export const SAMPLE_DASHBOARD_STATS = {
  totalMembers: 547,
  activeMembers: 423,
  totalPaymentsThisYear: 8750000,
  activeElections: 1,
  upcomingEvents: 3,
  totalDonations: 2450000,
  memberGrowth: [
    { month: 'Jan', count: 22 },
    { month: 'Feb', count: 18 },
    { month: 'Mar', count: 35 },
    { month: 'Apr', count: 28 },
    { month: 'May', count: 41 },
    { month: 'Jun', count: 30 },
    { month: 'Jul', count: 38 },
    { month: 'Aug', count: 52 },
    { month: 'Sep', count: 45 },
    { month: 'Oct', count: 60 },
    { month: 'Nov', count: 48 },
    { month: 'Dec', count: 55 },
  ],
  paymentTypeDistribution: [
    { name: 'Annual Dues', total: 4250000 },
    { name: 'Registration', total: 1850000 },
    { name: 'Awards Gala', total: 1200000 },
    { name: 'Sports Fund', total: 850000 },
    { name: 'Others', total: 600000 },
  ],
  recentMembers: [
    { id: 'am1', firstName: 'Tunde', lastName: 'Adeyinka', sport: 'Athletics', memberNumber: 'RNS-2025-001', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&crop=face' },
    { id: 'am2', firstName: 'Grace', lastName: 'Okonkwo', sport: 'Swimming', memberNumber: 'RNS-2025-002', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80&auto=format&fit=crop&crop=face' },
    { id: 'am3', firstName: 'Ibrahim', lastName: 'Musa', sport: 'Football', memberNumber: 'RNS-2025-003', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&auto=format&fit=crop&crop=face' },
    { id: 'am4', firstName: 'Ngozi', lastName: 'Eze', sport: 'Tennis', memberNumber: 'RNS-2025-004', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1551717704-3f7bfc166498?w=200&q=80&auto=format&fit=crop&crop=face' },
    { id: 'am5', firstName: 'Seun', lastName: 'Balogun', sport: 'Boxing', memberNumber: 'RNS-2025-005', status: 'suspended', profilePicture: null },
    { id: 'am6', firstName: 'Aisha', lastName: 'Abdullahi', sport: 'Table Tennis', memberNumber: 'RNS-2025-006', status: 'active', profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop&crop=face' },
    { id: 'am7', firstName: 'Emeka', lastName: 'Okafor', sport: 'Basketball', memberNumber: 'RNS-2025-007', status: 'active', profilePicture: null },
    { id: 'am8', firstName: 'Fatima', lastName: 'Bello', sport: 'Volleyball', memberNumber: 'RNS-2025-008', status: 'inactive', profilePicture: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&q=80&auto=format&fit=crop&crop=face' },
  ],
  recentPayments: [
    { id: 'p1', member: { firstName: 'Tunde', lastName: 'Adeyinka', memberNumber: 'RNS-2025-001' }, paymentType: { name: 'Annual Dues' }, amount: 15000, status: 'successful' },
    { id: 'p2', member: { firstName: 'Grace', lastName: 'Okonkwo', memberNumber: 'RNS-2025-002' }, paymentType: { name: 'Registration Fee' }, amount: 25000, status: 'successful' },
    { id: 'p3', member: { firstName: 'Ibrahim', lastName: 'Musa', memberNumber: 'RNS-2025-003' }, paymentType: { name: 'Annual Dues' }, amount: 15000, status: 'pending' },
    { id: 'p4', member: { firstName: 'Ngozi', lastName: 'Eze', memberNumber: 'RNS-2025-004' }, paymentType: { name: 'Awards Gala Ticket' }, amount: 50000, status: 'successful' },
    { id: 'p5', member: { firstName: 'Aisha', lastName: 'Abdullahi', memberNumber: 'RNS-2025-006' }, paymentType: { name: 'Annual Dues' }, amount: 15000, status: 'successful' },
    { id: 'p6', member: { firstName: 'Emeka', lastName: 'Okafor', memberNumber: 'RNS-2025-007' }, paymentType: { name: 'Sports Fund Levy' }, amount: 10000, status: 'successful' },
  ],
}

// ─── ADMIN: LEADERSHIP (admin card format) ────────────────────────────────────
export const SAMPLE_ADMIN_LEADERSHIP: Record<string, any[]> = {
  'board-of-trustees': [
    { id: 'b1', name: 'Col. (Rtd) Patrick Osagie', title: 'Chairman, Board of Trustees', state: 'Edo', isActive: true, photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'col-rtd-patrick-osagie' },
    { id: 'b2', name: 'Hajiya Zainab Garba', title: 'Vice Chairman', state: 'Sokoto', isActive: true, photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'hajiya-zainab-garba' },
    { id: 'b3', name: 'Chief Emeka Iloputaife', title: 'Trustee', state: 'Anambra', isActive: true, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'chief-emeka-iloputaife' },
    { id: 'b4', name: 'Dr. Funke Adesanya', title: 'Trustee', state: 'Lagos', isActive: true, photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'dr-funke-adesanya' },
    { id: 'b5', name: 'Alhaji Umar Faruk Shuaibu', title: 'Trustee', state: 'Kano', isActive: true, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'alhaji-umar-faruk-shuaibu' },
    { id: 'b6', name: 'Engr. Adaeze Okafor-Nwosu', title: 'Secretary', state: 'Imo', isActive: true, photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'engr-adaeze-okafor-nwosu' },
  ],
  'national-executives': [
    { id: 'x1', name: 'Chief Emmanuel Adeyemi', title: 'President', state: 'Lagos', isActive: true, photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'chief-emmanuel-adeyemi' },
    { id: 'x2', name: 'Dr. Amaka Okafor', title: 'Vice President', state: 'Anambra', isActive: true, photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'dr-amaka-okafor' },
    { id: 'x3', name: 'Barr. Chukwuemeka Nwosu', title: 'Secretary General', state: 'Enugu', isActive: true, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'barr-chukwuemeka-nwosu' },
    { id: 'x4', name: 'Mrs. Fatima Bello', title: 'Treasurer', state: 'Abuja', isActive: true, photo: 'https://images.unsplash.com/photo-1551717704-3f7bfc166498?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'mrs-fatima-bello' },
  ],
  'state-executives': [
    { id: 'se1', name: 'Alhaji Musa Danjuma', title: 'State Chairman', state: 'Kano', isActive: true, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'alhaji-musa-danjuma' },
    { id: 'se2', name: 'Mrs. Ngozi Enwezor', title: 'State Chairman', state: 'Anambra', isActive: true, photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'mrs-ngozi-enwezor' },
    { id: 'se3', name: 'Chief Biodun Alade', title: 'State Chairman', state: 'Lagos', isActive: true, photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'chief-biodun-alade' },
    { id: 'se4', name: 'Dr. Aminu Shehu', title: 'State Chairman', state: 'Kaduna', isActive: true, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'dr-aminu-shehu' },
    { id: 'se5', name: 'Barr. Efetobo Agas', title: 'State Chairman', state: 'Delta', isActive: true, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'barr-efetobo-agas' },
    { id: 'se6', name: 'Mrs. Aisha Umar', title: 'State Chairman', state: 'Sokoto', isActive: true, photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'mrs-aisha-umar' },
  ],
  'directorate': [
    { id: 'dir1', name: 'Mr. Chukwudi Obi', title: 'Director of Operations', state: null, isActive: true, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'chukwudi-obi' },
    { id: 'dir2', name: 'Mrs. Toyin Akinpelu', title: 'Director of Finance', state: null, isActive: true, photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'toyin-akinpelu' },
    { id: 'dir3', name: 'Dr. Felix Amara', title: 'Director of Welfare', state: null, isActive: true, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'felix-amara' },
    { id: 'dir4', name: 'Ms. Adaora Igwe', title: 'Director of Communications', state: null, isActive: true, photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'adaora-igwe' },
    { id: 'dir5', name: 'Mr. Bashir Maikano', title: 'Director of Sports Development', state: null, isActive: true, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80&auto=format&fit=crop&crop=face', slug: 'bashir-maikano' },
  ],
}

// ─── MEMBER PORTAL: DEMO DATA ─────────────────────────────────────────────────
export const SAMPLE_MEMBER = {
  id: 'demo-member-1',
  firstName: 'Emeka',
  lastName: 'Okonkwo',
  middleName: 'Chukwudi',
  email: 'emeka.okonkwo@example.com',
  phone: '08012345678',
  memberNumber: 'RNS-2025-042',
  sport: 'Athletics',
  state: 'Lagos',
  stateOfOrigin: 'Anambra',
  city: 'Ikeja',
  lga: 'Ikeja',
  address: '15 Awolowo Road, Ikeja, Lagos',
  gender: 'male',
  dateOfBirth: '1975-06-15',
  status: 'active',
  profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&crop=face',
}

export const SAMPLE_MEMBER_PAYMENTS = [
  { id: 'mp1', paymentType: { name: 'Annual Dues' }, amount: 15000, year: 2026, method: 'card', status: 'completed', createdAt: '2026-01-10T10:00:00.000Z' },
  { id: 'mp2', paymentType: { name: 'Awards Gala Ticket' }, amount: 50000, year: 2025, method: 'transfer', status: 'completed', createdAt: '2025-11-05T10:00:00.000Z' },
  { id: 'mp3', paymentType: { name: 'Annual Dues' }, amount: 15000, year: 2025, method: 'card', status: 'completed', createdAt: '2025-01-08T10:00:00.000Z' },
  { id: 'mp4', paymentType: { name: 'Sports Fund Levy' }, amount: 10000, year: 2025, method: 'card', status: 'completed', createdAt: '2025-03-20T10:00:00.000Z' },
  { id: 'mp5', paymentType: { name: 'Annual Dues' }, amount: 15000, year: 2024, method: 'transfer', status: 'completed', createdAt: '2024-01-15T10:00:00.000Z' },
  { id: 'mp6', paymentType: { name: 'Conference Fee' }, amount: 25000, year: 2024, method: 'card', status: 'pending', createdAt: '2024-09-10T10:00:00.000Z' },
]

export const SAMPLE_MEMBER_ELECTIONS = [
  { id: 'me1', title: 'National Executive Elections 2026', description: 'Vote for the next set of national executives to lead RENISA for the 2026–2029 term.', year: 2026, status: 'active', startDate: '2026-03-01T00:00:00.000Z', endDate: '2026-04-30T23:59:59.000Z', positions: [{ id: 'mpos1', name: 'President' }, { id: 'mpos2', name: 'Vice President' }, { id: 'mpos3', name: 'Secretary General' }, { id: 'mpos4', name: 'Treasurer' }] },
  { id: 'me2', title: 'State Chapter Elections — Southwest 2026', description: 'Elections for the Southwest zonal chapter executive positions.', year: 2026, status: 'upcoming', startDate: '2026-05-01T00:00:00.000Z', endDate: '2026-05-31T23:59:59.000Z', positions: [{ id: 'mpos5', name: 'Zonal Chairman' }, { id: 'mpos6', name: 'Zonal Secretary' }] },
  { id: 'me3', title: 'Board of Trustees Election 2024', description: 'Election for board of trustees positions for 2024–2028.', year: 2024, status: 'results_declared', startDate: '2024-03-01T00:00:00.000Z', endDate: '2024-03-31T23:59:59.000Z', positions: [{ id: 'mpos7', name: 'Chairman BOT' }, { id: 'mpos8', name: 'Vice Chairman BOT' }] },
]

export const SAMPLE_MEMBER_AWARDS = [
  { id: 'maw1', title: 'Athlete of the Year 2025', recipientName: 'Multiple Nominees', recipientPhoto: null, category: { name: 'Performance' }, year: 2025, description: 'Recognizing the most outstanding athletic performance in 2025 across all sports categories.', votingEnabled: true, votingEndDate: '2026-04-30T23:59:59.000Z', totalVotes: 342 },
  { id: 'maw2', title: 'Coach of the Year 2025', recipientName: 'Community Vote', recipientPhoto: null, category: { name: 'Coaching Excellence' }, year: 2025, description: 'Vote for the coach who had the most impact on Nigerian sports development in 2025.', votingEnabled: true, votingEndDate: '2026-04-30T23:59:59.000Z', totalVotes: 218 },
  { id: 'maw3', title: 'Lifetime Achievement Award 2025', recipientName: 'Col. (Rtd) Patrick Osagie', recipientPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80&auto=format&fit=crop&crop=face', category: { name: 'Legacy' }, year: 2025, description: 'Honoring decades of service to Nigerian sports. Vote to show your support.', votingEnabled: true, votingEndDate: '2026-04-30T23:59:59.000Z', totalVotes: 1024 },
]

export const SAMPLE_MEMBER_ID_CARD_SETTINGS = {
  isEnabled: true,
  onlineFee: 5000,
  physicalFee: 10000,
}

export const SAMPLE_MEMBER_ID_CARD_REQUESTS = [
  { id: 'idr1', requestType: 'online', paymentStatus: 'completed', adminStatus: 'approved', deliveryStatus: null, cardUrl: null, createdAt: '2025-10-15T10:00:00.000Z' },
]
