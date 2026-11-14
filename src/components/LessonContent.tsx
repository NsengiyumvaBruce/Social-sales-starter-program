import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LESSONS, QUIZZES } from '../data/courseData';
import { COURSE_IMAGES } from '../data/courseImages';
import type {
  ContentIdeaSlot,
  GoalDraft,
  LeadRecord,
  LessonId,
  OfferDraft,
  ProfileBioDraft,
  ReplyVariables,
  WeeklyReviewDraft,
} from '../types/course';
import { EditorialMedia } from './EditorialMedia';
import {
  BudgetCalculatorTool,
  ContentPlannerTool,
  EngagementAndReviewTool,
  GoalSetterTool,
  OfferBuilderTool,
  ProfileTools,
  RepliesAndLeadTrackerTool,
  ThirtyDayPlanTool,
} from './InteractiveTools';
import { LessonNotes } from './LessonNotes';
import {
  OfferComparisonVisual,
  PostAnatomyVisual,
  SalesChatWalkthrough,
} from './LessonVisualGuides';
import { QuizBlock } from './QuizBlock';

interface LessonContentProps {
  articleRef: React.RefObject<HTMLElement | null>;
  activeId: LessonId;
  done: LessonId[];
  onToggleDone: (id: LessonId) => void;
  onSelectLesson: (id: LessonId) => void;
  checks: Record<string, boolean>;
  onToggleCheck: (key: string, val: boolean) => void;
  notes: Record<string, string>;
  onUpdateNote: (id: LessonId, text: string) => void;
  quizzes: Record<string, number>;
  onRecordQuiz: (id: LessonId, idx: number) => void;
  onClearQuiz: (id: LessonId) => void;
  goalDraft: GoalDraft;
  onChangeGoal: (patch: Partial<GoalDraft>) => void;
  offerDraft: OfferDraft;
  onChangeOffer: (patch: Partial<OfferDraft>) => void;
  profileBioDraft: ProfileBioDraft;
  onChangeProfileBio: (patch: Partial<ProfileBioDraft>) => void;
  contentIdeas: ContentIdeaSlot[];
  onChangeIdea: (id: string, val: string) => void;
  onResetIdeas: (toDefault: boolean) => void;
  replyVariables: ReplyVariables;
  onChangeReplyVars: (patch: Partial<ReplyVariables>) => void;
  leads: LeadRecord[];
  onAddLead: (lead: Omit<LeadRecord, 'id'>) => void;
  onUpdateLeadStatus: (id: string, status: LeadRecord['status']) => void;
  onRemoveLead: (id: string) => void;
  weeklyReview: WeeklyReviewDraft;
  onChangeWeeklyReview: (patch: Partial<WeeklyReviewDraft>) => void;
  planStartDate: string;
  onChangePlanStartDate: (date: string) => void;
}

const DoNowBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-6 rounded-xl border border-[var(--sun-border)] bg-[var(--sun)] p-5 text-[var(--sun-ink)]">
    <span className="block text-xs font-bold uppercase tracking-wider mb-1.5">Do this now</span>
    <div className="text-sm sm:text-base leading-relaxed">{children}</div>
  </div>
);

const LESSON_MEDIA: Record<
  LessonId,
  { src: string; alt: string; caption: string; aspect?: '16/9' | '4/3' }
> = {
  start: {
    src: COURSE_IMAGES.heroWorkspace,
    alt: 'Entrepreneur photographing local coffee and craft goods by a sunlit window using a smartphone',
    caption: 'Start with what you already have: your phone, a real offer, and 10 minutes a day.',
    aspect: '16/9',
  },
  'lesson-1': {
    src: COURSE_IMAGES.customerOffer,
    alt: 'Shop owner listening to a customer across a wooden counter displaying woven baskets and coffee bags',
    caption: 'Speak to one clear customer so they immediately know your post is meant for them.',
    aspect: '4/3',
  },
  'lesson-2': {
    src: COURSE_IMAGES.profileSetup,
    alt: 'Business owner organizing her social media business profile and WhatsApp ordering flow on a phone',
    caption: 'A strong profile answers what you sell, who it is for, and how to order in five seconds.',
    aspect: '4/3',
  },
  'lesson-3': {
    src: COURSE_IMAGES.contentCreation,
    alt: 'Tailor arranging freshly pressed shirts and filming a short behind-the-scenes phone video by a bright window',
    caption: 'Simple behind-the-scenes videos shot on a phone often beat overly polished ads.',
    aspect: '4/3',
  },
  'lesson-4': {
    src: COURSE_IMAGES.salesConversation,
    alt: 'Business owner packing customer delivery boxes while checking messages and recording orders in a notebook',
    caption: 'Conversations close orders: reply quickly, guide the buyer, and track every inquiry.',
    aspect: '4/3',
  },
  'lesson-5': {
    src: COURSE_IMAGES.paidAds,
    alt: 'Entrepreneur comparing a product photograph on a smartphone with a simple campaign budget plan on a laptop',
    caption: 'Put paid ad budget only behind posts that already proved people respond to them.',
    aspect: '4/3',
  },
  'lesson-6': {
    src: COURSE_IMAGES.analyticsGrowth,
    alt: 'Weekly review desk with analytics charts on a tablet and a handwritten planner',
    caption: 'Check four core numbers once a week and compare against your own previous month.',
    aspect: '4/3',
  },
  'lesson-7': {
    src: COURSE_IMAGES.thirtyDayPlan,
    alt: 'Small business owner ticking off completed tasks in a 30-day planner beside wrapped delivery boxes',
    caption: 'Turn all seven lessons into a repeatable 30-day habit.',
    aspect: '4/3',
  },
};

export const LessonContent: React.FC<LessonContentProps> = ({
  articleRef,
  activeId,
  done,
  onToggleDone,
  onSelectLesson,
  checks,
  onToggleCheck,
  notes,
  onUpdateNote,
  quizzes,
  onRecordQuiz,
  onClearQuiz,
  goalDraft,
  onChangeGoal,
  offerDraft,
  onChangeOffer,
  profileBioDraft,
  onChangeProfileBio,
  contentIdeas,
  onChangeIdea,
  onResetIdeas,
  replyVariables,
  onChangeReplyVars,
  leads,
  onAddLead,
  onUpdateLeadStatus,
  onRemoveLead,
  weeklyReview,
  onChangeWeeklyReview,
  planStartDate,
  onChangePlanStartDate,
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const currentIndex = LESSONS.findIndex((l) => l.id === activeId);
  const lessonMeta = LESSONS[currentIndex] || LESSONS[0];
  const prevLesson = currentIndex > 0 ? LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;
  const isDone = done.includes(activeId);
  const quiz = QUIZZES[activeId];
  const media = LESSON_MEDIA[activeId];

  useEffect(() => {
    if (headingRef.current && document.activeElement?.tagName === 'A') {
      headingRef.current.focus({ preventScroll: true });
    }
  }, [activeId]);

  return (
    <motion.article
      key={activeId}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      ref={articleRef}
      id={activeId}
      tabIndex={-1}
      className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-9 outline-none"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--muted)] mb-2">
        <span>{lessonMeta.number === '0' ? 'Orientation' : `Lesson ${lessonMeta.number} of 7`}</span>
        <span aria-hidden="true">·</span>
        <span>{lessonMeta.duration}</span>
        {isDone && (
          <>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[var(--leaf)]">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Completed
            </span>
          </>
        )}
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl outline-none"
      >
        {lessonMeta.fullTitle}
      </h2>

      {/* Contextual Lesson Photograph (hidden when printing text-only unless desired, actually prints cleanly!) */}
      {activeId !== 'start' && (
        <div className="mt-5 grid gap-5 md:grid-cols-[1.2fr_0.8fr] items-center rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              In this lesson
            </span>
            <p className="text-sm sm:text-base font-medium text-[var(--ink)] leading-relaxed">
              {lessonMeta.summary}
            </p>
            <p className="text-xs text-[var(--muted)]">{media.caption}</p>
          </div>
          <EditorialMedia
            src={media.src}
            alt={media.alt}
            aspect={media.aspect}
            className="max-h-[220px]"
          />
        </div>
      )}

      {/* Lesson Body */}
      <div className="mt-6 space-y-4 text-[var(--ink)]">
        {activeId === 'start' && (
          <>
            <div className="max-w-[70ch] space-y-4">
              <p>
                This course is for anyone who sells something: a product, a service or your own
                skills. You do not need money for ads or a large audience. You need a phone, a real
                offer and about 10 minutes a day.
              </p>
              <h3 className="font-display text-lg font-bold pt-3">
                What you will have after the 7 lessons
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>A one-sentence offer that customers understand.</li>
                <li>Profiles that make it easy to order or message you.</li>
                <li>12 post ideas and a weekly posting rhythm.</li>
                <li>A routine that turns comments and messages into sales.</li>
                <li>A plan for your first small paid ad.</li>
                <li>A weekly check that shows what to repeat and what to stop.</li>
              </ul>
              <h3 className="font-display text-lg font-bold pt-3">How to use this course</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Do one lesson a day. Every lesson ends with one task. Finish the task before you
                  move on.
                </li>
                <li>Press Listen to hear the lesson read aloud by your device&apos;s voice.</li>
                <li>
                  Mark each lesson complete to track your progress. Your progress is saved on this
                  device and browser when storage is available.
                </li>
                <li>
                  The examples come from different countries and businesses. Adapt them to your
                  market, customers and local platform features.
                </li>
              </ul>
              <DoNowBox>
                <p>
                  Write down what you sell and one goal for the next 30 days. A good goal has a
                  number, for example: &ldquo;Get 10 new customer messages every week.&rdquo;
                </p>
              </DoNowBox>
            </div>

            {/* Visual Course Roadmap */}
            <div className="my-6 grid gap-4 sm:grid-cols-3" aria-label="Course visual roadmap">
              <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg)]">
                <EditorialMedia
                  src={COURSE_IMAGES.customerOffer}
                  alt="Shop owner talking with a customer to understand their needs"
                  aspect="4/3"
                  className="rounded-none border-0"
                />
                <div className="p-3.5">
                  <div className="font-mono-num text-xs font-bold text-[var(--accent)]">
                    LESSONS 1–2
                  </div>
                  <div className="mt-0.5 font-display text-sm font-bold text-[var(--ink)]">
                    Clarify offer &amp; profile
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Define one customer, one clear sentence, and a one-tap ordering bio.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg)]">
                <EditorialMedia
                  src={COURSE_IMAGES.productLighting}
                  alt="Shooting clean product photos with a phone beside a sunlit window"
                  aspect="4/3"
                  className="rounded-none border-0"
                />
                <div className="p-3.5">
                  <div className="font-mono-num text-xs font-bold text-[var(--accent)]">
                    LESSONS 3–4
                  </div>
                  <div className="mt-0.5 font-display text-sm font-bold text-[var(--ink)]">
                    Post &amp; close sales
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Build a steady 3-post rhythm and turn comments and DMs into paid orders.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg)]">
                <EditorialMedia
                  src={COURSE_IMAGES.thirtyDayPlan}
                  alt="Checking off 30-day goals beside packed customer orders"
                  aspect="4/3"
                  className="rounded-none border-0"
                />
                <div className="p-3.5">
                  <div className="font-mono-num text-xs font-bold text-[var(--leaf)]">
                    LESSONS 5–7
                  </div>
                  <div className="mt-0.5 font-display text-sm font-bold text-[var(--ink)]">
                    Test ads &amp; scale
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Amplify winning posts, review four numbers weekly, and lock in a 30-day plan.
                  </p>
                </div>
              </div>
            </div>

            <GoalSetterTool goalDraft={goalDraft} onChange={onChangeGoal} />
          </>
        )}

        {activeId === 'lesson-1' && (
          <>
            <div className="max-w-[70ch] space-y-4">
              <p>
                Most posts fail because they speak to everyone. When you try to reach everyone,
                nobody feels the post is meant for them. Start with one type of customer.
              </p>
              <h3 className="font-display text-lg font-bold pt-3">Describe one customer</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Who are they? Think of age, job and place.</li>
                <li>What problem do they want solved?</li>
                <li>Which app do they already open every day?</li>
              </ul>
              <h3 className="font-display text-lg font-bold pt-3">
                Write your offer in one sentence
              </h3>
              <p>Use this pattern: I help [who] get [result] with [what you sell].</p>
              <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--bg)] p-4 text-sm space-y-1.5">
                <p>
                  <strong>Example:</strong> I help small cafés get more walk-in customers with
                  eye-catching Instagram posts.
                </p>
                <p>
                  <strong>Example:</strong> I help office workers in Nairobi get tailored shirts
                  delivered in one week.
                </p>
              </div>
            </div>

            <OfferComparisonVisual />
            <OfferBuilderTool offerDraft={offerDraft} onChange={onChangeOffer} />

            <div className="max-w-[70ch] space-y-4">
              <h3 className="font-display text-lg font-bold pt-3">Choose where to start</h3>
              <p>
                Pick one or two platforms, not five. Go where your customer already spends time.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>WhatsApp and Facebook:</strong> good for local customers who like to chat
                  before they buy.
                </li>
                <li>
                  <strong>Instagram:</strong> good for products that look good in photos, such as
                  food, fashion, beauty and crafts.
                </li>
                <li>
                  <strong>TikTok:</strong> short videos that can reach people who do not follow you
                  yet.
                </li>
                <li>
                  <strong>LinkedIn:</strong> good for services, business customers and professional
                  skills.
                </li>
              </ul>
              <DoNowBox>
                <p>
                  Write your customer description and your offer sentence. Choose your first
                  platform.
                </p>
              </DoNowBox>
            </div>
          </>
        )}

        {activeId === 'lesson-2' && (
          <>
            <div className="max-w-[70ch] space-y-4">
              <p>
                When someone likes one of your posts, the next thing they do is open your profile.
                If it is unclear, they leave. A good profile answers three questions in five
                seconds: what do you sell, who is it for and how do I order?
              </p>
              <h3 className="font-display text-lg font-bold pt-3">
                The five parts of a strong profile
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Name and photo:</strong> use the same name and the same logo or face photo
                  on every platform so people recognise you.
                </li>
                <li>
                  <strong>Bio:</strong> say what you sell, who it is for, where you work and how to
                  order.
                </li>
                <li>
                  <strong>One link:</strong> send people to the place where you want them to go,
                  such as your WhatsApp chat link, your catalog or your website.
                </li>
                <li>
                  <strong>Contact button:</strong> turn on the call, message or email button so
                  ordering takes one tap.
                </li>
                <li>
                  <strong>Pinned or featured post:</strong> show your best offer or best customer
                  result at the top.
                </li>
              </ul>
              <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--bg)] p-4 text-sm">
                <strong>Example bio:</strong> Fresh lunch boxes for busy workers in Kigali. Order
                before 10:00, delivered by 12:00. Tap the link to order on WhatsApp.
              </div>
              <h3 className="font-display text-lg font-bold pt-3">Use a business account</h3>
              <p>
                On Instagram, TikTok and Facebook, switch to a business or professional account. It
                is free and shows statistics about who sees your posts. You will use those numbers
                in lesson 6.
              </p>
              <h3 className="font-display text-lg font-bold pt-3">Try WhatsApp Business</h3>
              <p>
                WhatsApp Business is a free app for small businesses. It lets you add a business
                profile, a product catalog, quick replies for common questions and labels to
                organise customers. Features differ between countries, so check WhatsApp&apos;s help
                pages for the current steps.
              </p>
            </div>
            <ProfileTools
              checks={checks}
              onToggleCheck={onToggleCheck}
              bioDraft={profileBioDraft}
              onChangeBio={onChangeProfileBio}
              offerDraft={offerDraft}
            />
          </>
        )}

        {activeId === 'lesson-3' && (
          <>
            <div className="max-w-[70ch] space-y-4">
              <p>
                Consistency beats perfection. In a 2026 study of more than 52 million posts, Buffer
                found that accounts that skipped a week grew followers below their own normal rate,
                and that posting one or two times a week was clearly better than staying silent. Two
                or three good posts a week is enough to start, if you can keep it up.
              </p>
              <h3 className="font-display text-lg font-bold pt-3">Five kinds of posts</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Show:</strong> your product or service in real use.
                </li>
                <li>
                  <strong>Teach:</strong> one useful tip your customer can use today.
                </li>
                <li>
                  <strong>Prove:</strong> customer photos, reviews and results.
                </li>
                <li>
                  <strong>Behind the scenes:</strong> how you make it and who is on your team.
                </li>
                <li>
                  <strong>Offer:</strong> a clear invitation to buy or to message you.
                </li>
              </ul>
              <p>
                A common rule of thumb is about four helpful posts for every one direct offer. It is
                a guideline, not a law, so test what works for your audience.
              </p>
              <h3 className="font-display text-lg font-bold pt-3">Pick the right format</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Carousels</strong> (several slides you swipe): in Buffer&apos;s data they
                  had the highest engagement on LinkedIn, about 21.8%, and on Instagram, about 6.9%.
                </li>
                <li>
                  <strong>Short videos:</strong> on Instagram, Reels reached more people than
                  carousels, while carousels earned more engagement. Videos shot on a phone can work
                  better than polished ones.
                </li>
                <li>
                  <strong>Photos and text:</strong> still useful, especially on Facebook, where all
                  formats performed close together.
                </li>
              </ul>
              <p className="text-sm text-[var(--muted)]">
                Buffer&apos;s data comes from posts scheduled through Buffer, so use the numbers as
                a guide, not a rule for every country.
              </p>
            </div>

            <PostAnatomyVisual />

            {/* Practical Phone Photography Visual Guide */}
            <div className="my-6 grid gap-5 md:grid-cols-[0.9fr_1.1fr] items-center rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4">
              <EditorialMedia
                src={COURSE_IMAGES.productLighting}
                alt="Hands holding a smartphone to photograph pastries and iced coffee beside a sunlit window with a white bounce card"
                aspect="4/3"
              />
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  Practical visual guide
                </span>
                <h4 className="font-display text-base font-bold text-[var(--ink)]">
                  Take clear product photos with just a window and white paper
                </h4>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  You do not need studio lights. Place your product next to a bright window for soft
                  side light, and hold a plain white sheet or foam board on the opposite side to
                  fill dark shadows. Clean your phone lens before every shot.
                </p>
              </div>
            </div>

            <div className="max-w-[70ch] space-y-4">
              <h3 className="font-display text-lg font-bold pt-3">A simple post formula</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Hook:</strong> the first line or the first seconds make people stop.
                </li>
                <li>
                  <strong>Value:</strong> give the tip, the proof or the story.
                </li>
                <li>
                  <strong>Call to action:</strong> tell people what to do next, for example
                  &ldquo;Message me to order.&rdquo;
                </li>
              </ul>
              <h3 className="font-display text-lg font-bold pt-3">A weekly rhythm to start with</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Monday: Teach.</li>
                <li>Wednesday: Show.</li>
                <li>Friday: Prove, and an Offer every second week.</li>
              </ul>
              <h3 className="font-display text-lg font-bold pt-3">Starter ideas</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>The three mistakes customers make when buying what you sell.</li>
                <li>How your product is made, in 30 seconds.</li>
                <li>A before and after.</li>
                <li>The question customers ask you most.</li>
                <li>A customer story, with their permission.</li>
                <li>Your price list and how to order.</li>
                <li>Meet the person behind the business.</li>
                <li>A myth and the fact about your product.</li>
              </ul>
              <p>
                Treat posting time as a test, not a rule. Try two different times for a month and
                keep the better one.
              </p>
              <DoNowBox>
                <p>
                  Write 12 post ideas below: three posts a week for four weeks. Then publish the
                  first one today.
                </p>
              </DoNowBox>
            </div>
            <ContentPlannerTool
              ideas={contentIdeas}
              onChangeIdea={onChangeIdea}
              onResetIdeas={onResetIdeas}
            />
          </>
        )}

        {activeId === 'lesson-4' && (
          <>
            <div className="max-w-[70ch] space-y-4">
              <p>
                Likes do not pay your bills. Conversations do. This lesson is about what you do after
                someone shows interest.
              </p>
              <h3 className="font-display text-lg font-bold pt-3">Reply to every comment</h3>
              <p>
                Buffer found that posts where the account replied to comments had higher engagement
                than the same account&apos;s other posts: about 30% higher on LinkedIn and about
                21% higher on Instagram. This shows a link, not proof that replying is the cause.
                Replying costs nothing, so try it.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Reply within a few hours when you can.</li>
                <li>Ask a question back to keep the conversation going.</li>
                <li>
                  Give the price in public when you can, and move details such as address and
                  payment to private messages.
                </li>
              </ul>
              <h3 className="font-display text-lg font-bold pt-3">A simple sales conversation</h3>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Greet the person and thank them.</li>
                <li>Ask what they need.</li>
                <li>Recommend one option, not ten.</li>
                <li>Give the price, the delivery time and how to pay.</li>
                <li>Ask for the order: &ldquo;Shall I prepare it for you today?&rdquo;</li>
                <li>Follow up after delivery and ask for a review.</li>
              </ol>
            </div>

            <SalesChatWalkthrough />

            <RepliesAndLeadTrackerTool
              replyVars={replyVariables}
              onChangeReplyVars={onChangeReplyVars}
              leads={leads}
              onAddLead={onAddLead}
              onUpdateLeadStatus={onUpdateLeadStatus}
              onRemoveLead={onRemoveLead}
            />

            <div className="max-w-[70ch] space-y-4">
              <h3 className="font-display text-lg font-bold pt-3">Collect proof</h3>
              <p>
                After each happy sale, ask for a photo or a one-sentence review, and ask permission
                before you post it. Real customer proof is the strongest post you can make.
              </p>
              <h3 className="font-display text-lg font-bold pt-3">Track your leads</h3>
              <p>
                A notebook or the mini lead tracker above is enough. Use these columns: name, where
                they came from, what they want, status (new, talking or paid) and the date to follow
                up.
              </p>
              <DoNowBox>
                <p>
                  Reply to every comment and message from the last seven days. Then add your active
                  inquiries to your lead list.
                </p>
              </DoNowBox>
            </div>
          </>
        )}

        {activeId === 'lesson-5' && (
          <>
            <div className="max-w-[70ch] space-y-4">
              <p>
                Ads can speed things up, but only after the basics work. Run an ad when you have a
                clear offer, a profile that makes ordering easy and a few posts that people
                responded to. Then put money behind the post that already did best. Paid ads amplify
                what works. They do not fix what does not.
              </p>
              <h3 className="font-display text-lg font-bold pt-3">Steps in Meta Ads Manager</h3>
              <p>This covers Facebook and Instagram ads.</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Prepare:</strong> have a Facebook Page and a payment method added.
                </li>
                <li>
                  <strong>Choose an objective.</strong> Meta offers six: Awareness, Traffic,
                  Engagement, Leads, App promotion and Sales. Many local businesses start by sending
                  people to a message chat on WhatsApp, Messenger or Instagram.
                </li>
                <li>
                  <strong>Set the audience:</strong> location, age and language first, then
                  interests. Keep it broad at the start.
                </li>
                <li>
                  <strong>Set a budget.</strong> The minimum is $1 per day per ad set. Below roughly
                  $5 a day you mostly learn direction, not firm results.
                </li>
                <li>
                  <strong>Make the ad:</strong> one clear image or short video, short text and
                  always a call-to-action button. Check image sizes so nothing is cropped.
                </li>
                <li>
                  <strong>Publish and wait.</strong> Review usually takes up to 24 hours. Wait
                  three to seven days before you judge. Day-one results are often misleading.
                </li>
              </ol>
              <p className="text-sm text-[var(--muted)]">
                Menus and names change from time to time. Check Meta&apos;s Help Center for the
                current steps. This course is not affiliated with Meta.
              </p>
            </div>

            <BudgetCalculatorTool />

            <div className="max-w-[70ch] space-y-4">
              <p>
                Cost per click varies widely by country and industry. One US-based figure quoted by
                Buffer puts the average across industries at $1.72, ranging from $0.45 for apparel
                to $3.77 for finance. Your local cost may be very different. After the first week,
                use your own Ads Manager numbers.
              </p>
              <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--bg)] p-4 text-sm">
                <strong>Budget safety:</strong> You do not need to run an ad to complete this
                course. First test your offer with organic posts and conversations. If you do
                advertise, use money you can afford to lose, confirm the current platform rules and
                billing currency, and set a strict spending limit before publishing.
              </div>
              <h3 className="font-display text-lg font-bold pt-3">Common mistakes</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Starting with no goal.</li>
                <li>Judging the ad after one day.</li>
                <li>Spending so little that you learn nothing.</li>
                <li>
                  Changing many things at once. Change one thing at a time, such as the image or the
                  text, so you know what made the difference.
                </li>
              </ul>
              <DoNowBox>
                <p>
                  Choose your best post from the last month. Write the goal for a 7-day test and a
                  budget you can afford to lose.
                </p>
              </DoNowBox>
            </div>
          </>
        )}

        {activeId === 'lesson-6' && (
          <>
            <div className="max-w-[70ch] space-y-4">
              <p>You only need a few numbers, and you only need to look at them once a week.</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Reach:</strong> how many people saw your post.
                </li>
                <li>
                  <strong>Engagement:</strong> reactions, comments, shares and saves.
                </li>
                <li>
                  <strong>Clicks or messages:</strong> people who took a step toward buying.
                </li>
                <li>
                  <strong>Sales:</strong> the number that pays you.
                </li>
              </ul>
              <h3 className="font-display text-lg font-bold pt-3">Engagement rate</h3>
              <p>
                Engagement rate is engagement divided by reach, times 100. Tools define it slightly
                differently, and some divide by followers. Pick one method and use it every time you
                compare.
              </p>
            </div>

            <EngagementAndReviewTool review={weeklyReview} onChangeReview={onChangeWeeklyReview} />

            <div className="max-w-[70ch] space-y-4">
              <h3 className="font-display text-lg font-bold pt-3">Compare with yourself</h3>
              <p>
                Buffer recommends comparing each platform with its own baseline, not with other
                platforms. For rough context, Buffer&apos;s 2025 medians were about 6.1% on
                LinkedIn, 5.6% on Facebook, 5.5% on Instagram and 4.6% on TikTok. These come from
                Buffer users, so use them only as background. Your best comparison is your own last
                month.
              </p>
              <h3 className="font-display text-lg font-bold pt-3">The 20-minute weekly review</h3>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Open your statistics for the last seven days.</li>
                <li>List your three best and three weakest posts.</li>
                <li>
                  Ask what the best ones had in common: the topic, the format or the first line.
                </li>
                <li>Make more of that and stop the weakest kind.</li>
                <li>Write one change to test next week.</li>
              </ol>
              <DoNowBox>
                <p>Do your first weekly review above and write down one change to test.</p>
              </DoNowBox>
            </div>
          </>
        )}

        {activeId === 'lesson-7' && (
          <>
            <div className="max-w-[70ch] space-y-4">
              <p>
                This plan puts every lesson together. Tick each item as you finish it. Your ticks
                and start date are saved in this browser.
              </p>
            </div>
            <ThirtyDayPlanTool
              checks={checks}
              onToggleCheck={onToggleCheck}
              startDate={planStartDate}
              onChangeStartDate={onChangePlanStartDate}
            />
            <div className="max-w-[70ch]">
              <DoNowBox>
                <p>
                  Pick the date you start Week 1 and put it in your calendar. Then share what you
                  learn in the feedback box below. Your answers decide which lessons I add next.
                </p>
              </DoNowBox>
            </div>
          </>
        )}
      </div>

      {/* Quiz */}
      {quiz && (
        <QuizBlock
          key={activeId}
          quiz={quiz}
          savedSelection={quizzes[activeId]}
          onSelect={(idx) => onRecordQuiz(activeId, idx)}
          onReset={() => onClearQuiz(activeId)}
        />
      )}

      {/* Personal Notes */}
      <LessonNotes
        lessonId={activeId}
        value={notes[activeId] || ''}
        onChange={(text) => onUpdateNote(activeId, text)}
      />

      {/* Lesson Footer Navigation */}
      <div className="no-print mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-6">
        <div className="flex items-center gap-2">
          {prevLesson && (
            <button
              type="button"
              onClick={() => onSelectLesson(prevLesson.id)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:border-[var(--ink)] transition-colors whitespace-nowrap min-h-[44px]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onToggleDone(activeId)}
            aria-pressed={isDone}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap min-h-[44px] ${
              isDone
                ? 'border-[var(--leaf)] bg-[var(--leaf)] text-[var(--bg)]'
                : 'border-[var(--ink)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--bg)]'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {isDone ? 'Lesson completed' : 'Mark lesson complete'}
          </button>

          {nextLesson ? (
            <button
              type="button"
              onClick={() => onSelectLesson(nextLesson.id)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-ink)] hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap min-h-[44px]"
            >
              <span>Next: {nextLesson.shortTitle}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSelectLesson('start')}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-ink)] hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap min-h-[44px]"
            >
              Back to start
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
};
