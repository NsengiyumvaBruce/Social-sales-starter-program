import type { ContentIdeaSlot, LeadRecord, LessonId, LessonMeta, QuizData } from '../types/course';

export const COURSE_AUTHOR = {
  name: 'Nsengiyumva Bruce',
  affiliation: 'Student at BYU-Pathway Worldwide',
  company: 'Bruce Digital 360, Kigali, Rwanda',
  credentials: 'Google certificates in Ad Manager, Shopping Ads and Ads Display',
  email: 'brucericch91@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nsengiyumva-bruce-abab3a386',
};

export const LESSONS: LessonMeta[] = [
  {
    id: 'start',
    number: '0',
    shortTitle: 'Start here',
    fullTitle: 'Start here',
    duration: '3 min',
    summary: 'How this 7-lesson course works and your 30-day goal.',
  },
  {
    id: 'lesson-1',
    number: '1',
    shortTitle: 'Customer & offer',
    fullTitle: 'Know your customer and your offer',
    duration: '10 min',
    summary: 'Pick one clear customer, craft a one-sentence offer, and choose your first platform.',
  },
  {
    id: 'lesson-2',
    number: '2',
    shortTitle: 'Profiles that sell',
    fullTitle: 'Set up profiles that sell',
    duration: '10 min',
    summary: 'Answer what you sell, who it is for, and how to order in five seconds.',
  },
  {
    id: 'lesson-3',
    number: '3',
    shortTitle: 'What to post',
    fullTitle: 'Decide what to post',
    duration: '12 min',
    summary: 'Build a steady weekly rhythm with five post types and 12 starter ideas.',
  },
  {
    id: 'lesson-4',
    number: '4',
    shortTitle: 'Attention to sales',
    fullTitle: 'Turn attention into sales',
    duration: '12 min',
    summary: 'Reply to comments, guide conversations in DMs, collect proof, and track leads.',
  },
  {
    id: 'lesson-5',
    number: '5',
    shortTitle: 'Your first paid ad',
    fullTitle: 'Your first paid ad',
    duration: '12 min',
    summary: 'Amplify your strongest organic post with a disciplined 7-day Meta ad test.',
  },
  {
    id: 'lesson-6',
    number: '6',
    shortTitle: 'Measure & improve',
    fullTitle: 'Measure and improve',
    duration: '10 min',
    summary: 'Track four numbers once a week and run a 20-minute review against your own baseline.',
  },
  {
    id: 'lesson-7',
    number: '7',
    shortTitle: 'Your 30-day plan',
    fullTitle: 'Your 30-day plan',
    duration: '8 min',
    summary: 'Put all seven lessons into action week by week with a concrete start date.',
  },
];

export const LESSON_IDS: LessonId[] = LESSONS.map((l) => l.id);

export const QUIZZES: Partial<Record<LessonId, QuizData>> = {
  'lesson-1': {
    question: 'Which offer sentence is strongest?',
    explain:
      'It names who you help, the result they get and what you sell. The other two could describe any business.',
    options: [
      { label: 'We sell good quality products for everyone.' },
      {
        label: 'I help busy parents in Kigali get fresh lunch boxes delivered before noon.',
        isCorrect: true,
      },
      { label: 'Best prices. Follow us for more!' },
    ],
  },
  'lesson-2': {
    question: 'Which bio is best?',
    explain:
      'It says what you sell, where, how fast and how to order. The other bios give a customer nothing to act on.',
    options: [
      { label: 'Welcome to my page.' },
      { label: 'Follow for follow.' },
      {
        label: 'Tailor in Nairobi. Shirts made in 7 days. Tap to chat on WhatsApp.',
        isCorrect: true,
      },
    ],
  },
  'lesson-3': {
    question:
      'A friend stops posting for two weeks to make one perfect video. What is the better approach?',
    explain:
      "Buffer's data shows that posting regularly, even once or twice a week, beats going silent. Waiting for perfect usually means not posting.",
    options: [
      { label: 'Wait until the video is perfect.' },
      {
        label: 'Post simple things once or twice a week while you work on the video.',
        isCorrect: true,
      },
      { label: 'Post ten times in one day, then stop.' },
    ],
  },
  'lesson-4': {
    question: 'Someone comments "Price?" on your post. What is the best reply?',
    explain:
      'A public answer with the price shows you are open and saves the customer a step. Asking for their location moves the sale into a private chat.',
    options: [
      { label: 'Check your inbox.' },
      {
        label:
          'The price is [price] and delivery takes 2 days. Message me your location and I will confirm.',
        isCorrect: true,
      },
      { label: 'Do not reply. They will ask again.' },
    ],
  },
  'lesson-5': {
    question: 'Your ad has run for one day with no sales. What should you do?',
    explain:
      'Day-one results are often misleading. Give the ad three to seven days, then decide what to change.',
    options: [
      { label: 'Delete it and quit ads.' },
      { label: 'Triple the budget.' },
      {
        label: 'Wait three to seven days, then judge the results.',
        isCorrect: true,
      },
    ],
  },
  'lesson-6': {
    question:
      "Your Instagram engagement rate is 3% and a friend's TikTok rate is 6%. What should you do?",
    explain:
      'Platforms and accounts differ. Your own past results tell you whether you are improving.',
    options: [
      { label: 'Move everything to TikTok.' },
      {
        label: 'Compare your Instagram rate with your own Instagram results from earlier weeks.',
        isCorrect: true,
      },
      { label: "Copy your friend's posts exactly." },
    ],
  },
};

export const PROFILE_CHECKLIST_ITEMS = [
  { key: 'p1', label: 'Same name and photo on every platform' },
  { key: 'p2', label: 'Bio with what I sell, who for, where and how to order' },
  { key: 'p3', label: 'One link that leads to ordering' },
  { key: 'p4', label: 'Contact button turned on' },
  { key: 'p5', label: 'Business account switched on' },
];

export const PLAN_WEEKS = [
  {
    week: 1,
    title: 'Week 1: Set up',
    items: [
      { key: 'w1a', label: 'Write my offer sentence' },
      { key: 'w1b', label: 'Fix my profile and switch to a business account' },
      { key: 'w1c', label: 'Write 12 post ideas' },
    ],
  },
  {
    week: 2,
    title: 'Week 2: Post and reply',
    items: [
      { key: 'w2a', label: 'Publish three posts' },
      { key: 'w2b', label: 'Reply to every comment and message' },
      { key: 'w2c', label: 'Start my lead list' },
    ],
  },
  {
    week: 3,
    title: 'Week 3: Try new formats',
    items: [
      { key: 'w3a', label: 'Publish one carousel and one short phone video' },
      { key: 'w3b', label: 'Ask three happy customers for a review' },
    ],
  },
  {
    week: 4,
    title: 'Week 4: Test an ad and review',
    items: [
      { key: 'w4a', label: 'Run a 7-day ad on my best post' },
      { key: 'w4b', label: 'Do my weekly review' },
      { key: 'w4c', label: 'Plan the next 30 days' },
    ],
  },
];

export const ALL_CHECKLIST_KEYS = [
  ...PROFILE_CHECKLIST_ITEMS.map((i) => i.key),
  ...PLAN_WEEKS.flatMap((w) => w.items.map((i) => i.key)),
];

export const DEFAULT_CONTENT_IDEAS: ContentIdeaSlot[] = [
  { id: 'w1-mon', week: 1, day: 'Mon · Teach', idea: '3 mistakes customers make when buying what I sell' },
  { id: 'w1-wed', week: 1, day: 'Wed · Show', idea: '30-second phone video showing how it is made or prepared' },
  { id: 'w1-fri', week: 1, day: 'Fri · Prove / Offer', idea: 'Customer story or review (with permission)' },
  { id: 'w2-mon', week: 2, day: 'Mon · Teach', idea: 'The #1 question customers ask me most and the clear answer' },
  { id: 'w2-wed', week: 2, day: 'Wed · Show', idea: 'Before and after transformation photo or carousel' },
  { id: 'w2-fri', week: 2, day: 'Fri · Prove / Offer', idea: 'Clear price list + how to order in 2 steps' },
  { id: 'w3-mon', week: 3, day: 'Mon · Teach', idea: 'A common myth vs. the fact about my product or service' },
  { id: 'w3-wed', week: 3, day: 'Wed · Show', idea: 'Meet the person behind the business (behind the scenes)' },
  { id: 'w3-fri', week: 3, day: 'Fri · Prove / Offer', idea: '2 customer photos showing real results' },
  { id: 'w4-mon', week: 4, day: 'Mon · Teach', idea: 'How to get the best result from using what I sell' },
  { id: 'w4-wed', week: 4, day: 'Wed · Show', idea: 'Packing or preparing today’s customer orders' },
  { id: 'w4-fri', week: 4, day: 'Fri · Prove / Offer', idea: 'Direct invitation: book or order this week' },
];

export const SAMPLE_LEADS: LeadRecord[] = [
  {
    id: 'sample-1',
    name: 'Aline U.',
    source: 'Instagram DM',
    want: 'Weekly lunch box (5 days)',
    status: 'Talking',
    followUpDate: new Date().toISOString().slice(0, 10),
  },
];

export const PLATFORM_BENCHMARKS = [
  { name: 'LinkedIn', median: 6.1, note: 'Carousels led engagement (~21.8%)' },
  { name: 'Facebook', median: 5.6, note: 'Formats performed closely together' },
  { name: 'Instagram', median: 5.5, note: 'Reels led reach; carousels led engagement (~6.9%)' },
  { name: 'TikTok', median: 4.6, note: 'Strong discovery for accounts with small followings' },
];

export const SOURCES = [
  {
    title: 'Buffer: The State of Social Media Engagement in 2026',
    detail: 'March 2026, 52 million posts from Buffer users',
    url: 'https://buffer.com/resources/state-of-social-media-engagement-2026/',
  },
  {
    title: "Buffer: How to Run Facebook Ads, 2026 Beginner's Guide",
    detail: 'Guide to Meta Ads Manager setup and budgeting',
    url: 'https://buffer.com/resources/facebook-ads-beginners-guide/',
  },
  {
    title: 'Small Business CEO: How Small Businesses Should Use Social Media in 2026',
    detail: 'Practical social media strategies for small businesses',
    url: 'https://www.smbceo.com/2026/03/16/how-small-businesses-should-use-social-media-in-2026/',
  },
];

export const SUMMARY_DISCLAIMER =
  'This is a record of self-reported progress in a self-paced learning resource. It is not an accredited qualification or an independently assessed certificate.';
export const SUMMARY_CREDIT = 'Course by Nsengiyumva Bruce, Bruce Digital 360, Kigali, Rwanda.';
