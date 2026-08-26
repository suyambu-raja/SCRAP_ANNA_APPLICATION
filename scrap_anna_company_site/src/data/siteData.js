export const siteConfig = {
  name: "Scrap Anna",
  tagline: "Connect • Collect • Recycle",
  shortDesc: "A trusted digital scrap network launching first in Chennai, Tamil Nadu, connecting households, merchants, and industries for transparent recycling and fair prices.",
  contact: {
    phone: "+91 73389 95341",
    email: "scrap.anna.shop@gmail.com",
    address: "Chennai, Tamil Nadu, India"
  },
  socials: {
    linkedin: "https://linkedin.com/company/scrap-anna",
    twitter: "https://twitter.com/scrapanna",
    facebook: "https://facebook.com/scrapanna",
    instagram: "https://instagram.com/scrapanna"
  }
};

export const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "For Households", path: "/households" },
  { name: "For Merchants", path: "/merchants" },
  { name: "For Industries", path: "/industries" },
  { name: "For Aggregators", path: "/aggregators" },
  { name: "Market Prices", path: "/market-prices" },
  { name: "FAQ", path: "/faq" },
  { name: "Contact Us", path: "/contact" },
];

export const audienceCards = [
  {
    id: "households",
    title: "For Households",
    badge: "Convenient Doorstep Pickup",
    description: "Sell your household scrap easily, request doorstep pickups, and connect with nearby verified merchants at fair rates.",
    iconName: "Home",
    link: "/households",
    highlights: ["Doorstep digital weighing", "Instant OTP verification", "Zero hassle disposal"]
  },
  {
    id: "merchants",
    title: "For Merchants",
    badge: "Verified Local Demand",
    description: "Get steady high-quality scrap pickup leads, manage daily routes, and grow your local scrap collection business efficiently.",
    iconName: "Store",
    link: "/merchants",
    highlights: ["Pre-verified pickup leads", "Digital transaction billing", "Route optimization"]
  },
  {
    id: "industries",
    title: "For Industries",
    badge: "Bulk Commercial Disposal",
    description: "Dispose of manufacturing & factory scrap with verified commercial recyclers, complete digital manifest records, and compliance.",
    iconName: "Factory",
    link: "/industries",
    highlights: ["Bulk lots & scheduled biddings", "GST compliant receipts", "Audit-ready disposal logs"]
  },
  {
    id: "aggregators",
    title: "For Aggregators",
    badge: "Consolidated Supply",
    description: "Partner with us to aggregate merchant volumes, fulfill large industrial recycling mill contracts, and unlock scale economies.",
    iconName: "Network",
    link: "/aggregators",
    highlights: ["Volume consolidation", "Direct mill & smelter access", "End-to-end supply visibility"]
  }
];

export const howItWorksSteps = [
  {
    number: "01",
    title: "Post Scrap",
    description: "Specify scrap type, estimated weight, upload photos, and pinpoint your pickup location.",
    iconName: "FilePlus2"
  },
  {
    number: "02",
    title: "Get Connected",
    description: "Nearby verified merchants receive your request and confirm availability with transparent rates.",
    iconName: "Users"
  },
  {
    number: "03",
    title: "Pickup Scheduled",
    description: "Choose a convenient time slot and accept the merchant partner for your pickup.",
    iconName: "CalendarClock"
  },
  {
    number: "04",
    title: "Scrap Collected",
    description: "Merchant arrives with certified digital weighing scales and performs on-site verification.",
    iconName: "Scale"
  },
  {
    number: "05",
    title: "Digital Bill & Payment",
    description: "Receive an instant digital receipt and direct payment confirmation with transparent records.",
    iconName: "FileCheck"
  }
];

export const trustFeatures = [
  {
    title: "Verified Partners",
    description: "All merchants and commercial partners undergo identity, business documentation, and background verification.",
    iconName: "ShieldCheck"
  },
  {
    title: "Pickup Verification",
    description: "Location check-in and secure OTP-based completion ensure every collection is authenticated.",
    iconName: "MapPin"
  },
  {
    title: "Digital Billing",
    description: "Itemized digital receipts with verified weights eliminate ambiguities and manual tampering.",
    iconName: "Receipt"
  },
  {
    title: "Transparent Transactions",
    description: "Every step is logged digitally to ensure clear pricing, accountability, and traceability.",
    iconName: "FileText"
  },
  {
    title: "Fraud Protection",
    description: "Proactive fraud alerts, anomaly detection, and dedicated dispute mediation ensure complete peace of mind.",
    iconName: "ShieldAlert"
  },
  {
    title: "Dedicated Support",
    description: "Our support team is always ready to help you resolve issues, answer queries, and ensure a smooth experience.",
    iconName: "Headphones"
  }
];

export const comparisonData = {
  traditional: [
    "Uncertain merchant availability & irregular rounds",
    "Manual uncalibrated scales and weight discrepancy",
    "Zero receipt or transaction history",
    "Arbitrary, non-transparent fluctuating prices",
    "Difficult for bulk or industrial scrap coordination"
  ],
  scrapAnna: [
    "On-demand pickup scheduling with verified nearby merchants",
    "Certified digital weighing scales with instant verification",
    "Instant digital receipts with clear line-item weights",
    "Transparent reference market pricing and fair rates",
    "Structured digital platform connecting households, merchants, and industries"
  ]
};

export const impactStatistics = [
  {
    value: "XX+",
    label: "Households Served",
    note: "Verified residential pickups"
  },
  {
    value: "XX+",
    label: "Verified Merchants",
    note: "Active local collection partners"
  },
  {
    value: "XX+",
    label: "Industries Onboarded",
    note: "Commercial factories & warehouses"
  },
  {
    value: "XX+",
    label: "Tons Diverted",
    note: "Clean scrap redirected to recyclers"
  }
];

export const marketPricesData = [
  {
    category: "Ferrous Metals",
    items: [
      { material: "Iron / Heavy Melting Scrap (HMS)", price: "₹28 - ₹34", unit: "kg", trend: "Stable", updated: "Today" },
      { material: "Cast Iron", price: "₹30 - ₹36", unit: "kg", trend: "Up", updated: "Today" },
      { material: "Steel Turning & Borings", price: "₹24 - ₹29", unit: "kg", trend: "Stable", updated: "Today" },
      { material: "Stainless Steel (SS 304)", price: "₹110 - ₹125", unit: "kg", trend: "Up", updated: "Today" },
      { material: "Stainless Steel (SS 316)", price: "₹180 - ₹210", unit: "kg", trend: "Stable", updated: "Today" }
    ]
  },
  {
    category: "Non-Ferrous Metals",
    items: [
      { material: "Copper Scrap (Armature/Heavy Wire)", price: "₹650 - ₹720", unit: "kg", trend: "Up", updated: "Today" },
      { material: "Brass Scrap (Honey / Utensils)", price: "₹420 - ₹480", unit: "kg", trend: "Stable", updated: "Today" },
      { material: "Aluminium Scrap (Section/Extrusion)", price: "₹140 - ₹170", unit: "kg", trend: "Up", updated: "Today" },
      { material: "Aluminium Casting / Utensils", price: "₹110 - ₹135", unit: "kg", trend: "Stable", updated: "Today" },
      { material: "Lead Battery Scrap (Dry)", price: "₹85 - ₹105", unit: "kg", trend: "Stable", updated: "Today" }
    ]
  },
  {
    category: "Paper & Cardboard",
    items: [
      { material: "Old Corrugated Cardboard (OCC)", price: "₹12 - ₹15", unit: "kg", trend: "Stable", updated: "Today" },
      { material: "Newspaper (ONP)", price: "₹14 - ₹17", unit: "kg", trend: "Stable", updated: "Today" },
      { material: "Office White Records / Books", price: "₹10 - ₹14", unit: "kg", trend: "Stable", updated: "Today" },
      { material: "Mixed Scrap Paper / Magazines", price: "₹7 - ₹10", unit: "kg", trend: "Down", updated: "Today" }
    ]
  },
  {
    category: "Plastics & Polymers",
    items: [
      { material: "HDPE Bottles & Containers", price: "₹24 - ₹32", unit: "kg", trend: "Up", updated: "Today" },
      { material: "PET Bottles (Baled)", price: "₹26 - ₹34", unit: "kg", trend: "Stable", updated: "Today" },
      { material: "PP Hard Plastics / Crates", price: "₹20 - ₹28", unit: "kg", trend: "Stable", updated: "Today" },
      { material: "LDPE Film & Wraps", price: "₹18 - ₹24", unit: "kg", trend: "Down", updated: "Today" }
    ]
  },
  {
    category: "E-Waste & Appliances",
    items: [
      { material: "Computer CPU Motherboards", price: "₹180 - ₹240", unit: "piece", trend: "Up", updated: "Today" },
      { material: "Air Conditioners (Old Split/Window)", price: "₹2,200 - ₹3,500", unit: "unit", trend: "Stable", updated: "Today" },
      { material: "Washing Machines / Refrigerators", price: "₹800 - ₹1,800", unit: "unit", trend: "Stable", updated: "Today" },
      { material: "UPS / Inverter Batteries", price: "₹1,200 - ₹2,500", unit: "unit", trend: "Up", updated: "Today" }
    ]
  }
];

export const faqData = {
  general: [
    {
      q: "What is Scrap Anna?",
      a: "Scrap Anna is an innovative digital connection platform that bridges the gap between scrap sellers (households, industries, commercial entities) and verified local scrap merchants and recycling aggregators. We bring transparency, digital billing, and fair reference pricing to the recycling ecosystem."
    },
    {
      q: "Who can use Scrap Anna?",
      a: "Anyone with scrap! We cater to individual households clearing clutter, local scrap merchants looking to grow their routes, industrial plants managing large manufacturing waste lots, and aggregators handling bulk recycling contracts."
    },
    {
      q: "Which locations are currently supported?",
      a: "We are currently operating in Chennai and expanding rapidly across major metropolitan and industrial corridors across Tamil Nadu and South India."
    }
  ],
  household: [
    {
      q: "How do I sell scrap from my house?",
      a: "Simply request a pickup through our platform by specifying your scrap category, approximate quantity, and preferred pickup date and time. A verified nearby merchant accepts your pickup request."
    },
    {
      q: "How does the doorstep pickup work?",
      a: "The merchant partner arrives at your scheduled slot equipped with certified digital weighing scales. Scrap is weighed in front of you, and upon confirmation, an instant digital receipt is generated and payment is completed."
    },
    {
      q: "How are scrap merchants selected?",
      a: "We connect you only with background-checked and identity-verified merchants operating in your immediate neighborhood to ensure safety and prompt punctuality."
    }
  ],
  merchant: [
    {
      q: "How do I become a verified Scrap Anna merchant?",
      a: "Submit an application on our Merchant Partner page with your business identification, GST/Shop establishment details (if applicable), and service radius. Our team conducts a prompt verification and onboards you to start receiving pickup leads."
    },
    {
      q: "What verification is required?",
      a: "Basic KYC, identity verification (Aadhaar/PAN), trade license/local verification, and calibration check of digital weighing equipment."
    },
    {
      q: "How are pickup leads assigned?",
      a: "Leads are routed based on geographical proximity, merchant availability, equipment capability, and performance ratings."
    }
  ],
  industry: [
    {
      q: "How can industrial facilities post scrap lots?",
      a: "Industries can post bulk scrap lots with photos, specifications, lot sizes (MT/Tons), compliance requirements, and schedule recurring or one-time pickup contracts."
    },
    {
      q: "Do you support GST billing and disposal certificates?",
      a: "Yes. All industrial transactions generate digital GST invoices, gate pass manifests, and certified recycling chain-of-custody documentation for statutory audits."
    },
    {
      q: "How are bulk buyers and merchants connected?",
      a: "Industrial lots are matched with verified commercial buyers and aggregators capable of handling bulk logistics and compliant disposal."
    }
  ],
  trust: [
    {
      q: "How does OTP and location verification work?",
      a: "Every collection requires a two-way digital handshake: the merchant confirms their location on arrival, and the pickup completes only when you verify weights and exchange a secure one-time OTP."
    },
    {
      q: "Is Scrap Anna physically collecting the scrap?",
      a: "Scrap Anna is the digital platform connecting sellers with verified independent merchant partners and commercial recyclers. Merchants perform the physical collection adhering to platform quality guidelines."
    }
  ]
};

export const teamMembers = [
  {
    name: "Leadership & Founding Team",
    role: "Operations & Strategy",
    bio: "Passionate about transforming India's circular economy with cutting-edge technology and grassroot empowerment.",
    placeholder: true
  },
  {
    name: "Engineering & Product",
    role: "Platform Architecture",
    bio: "Building robust, intuitive digital tools for transparent marketplace discovery and frictionless logistics.",
    placeholder: true
  },
  {
    name: "Merchant Relations",
    role: "Partner Network & Growth",
    bio: "Empowering thousands of local scrap entrepreneurs with fair income opportunities and digital access.",
    placeholder: true
  }
];
