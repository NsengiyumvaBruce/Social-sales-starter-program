import React from 'react';
import { Check, MessageCircle, ExternalLink, Pin, UserCheck, X } from 'lucide-react';
import { PLATFORM_BENCHMARKS } from '../data/courseData';
import type { OfferDraft, ProfileBioDraft } from '../types/course';

/* ── Lesson 1: Weak vs Strong Offer Visual Comparison ── */
export const OfferComparisonVisual: React.FC = () => {
  return (
    <div className="my-6 grid gap-4 sm:grid-cols-2" aria-label="Weak versus strong offer examples">
      <div className="rounded-xl border border-[var(--warn)]/40 bg-[var(--warn-soft)]/50 p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--warn)]">
          <X className="h-4 w-4" aria-hidden="true" />
          <span>Weak offer (too vague)</span>
        </div>
        <p className="mt-2 text-sm font-medium text-[var(--ink)]">
          &ldquo;We sell high quality clothes and accessories for everyone at affordable prices.&rdquo;
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Why it fails: Nobody knows who it is for, what result they get, or why to message today.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--leaf)]/45 bg-[var(--leaf-soft)]/55 p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
          <Check className="h-4 w-4" aria-hidden="true" />
          <span>Strong offer (clear &amp; specific)</span>
        </div>
        <p className="mt-2 text-sm font-medium text-[var(--ink)]">
          &ldquo;I help office workers in Nairobi get tailored shirts delivered in one week.&rdquo;
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Why it works: Names the customer, the clear outcome, and the exact product in one breath.
        </p>
      </div>
    </div>
  );
};

/* ── Lesson 2: Live Mobile Profile Mockup Preview ── */
export const LiveProfilePreview: React.FC<{
  bioDraft: ProfileBioDraft;
  offerDraft: OfferDraft;
  generatedBio: string;
  waLink: string;
}> = ({ bioDraft, generatedBio, waLink }) => {
  const initials = (bioDraft.businessName || 'B')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
          Live 5-second profile preview
        </span>
        <span className="text-xs text-[var(--muted)]">Updates as you type</span>
      </div>

      <div className="mx-auto max-w-[340px] rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
        {/* Profile Header Row */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] font-display text-base font-extrabold text-[var(--bg)]">
            {initials || 'SS'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-sm font-bold text-[var(--ink)]">
              {bioDraft.businessName || 'Your Business Name'}
            </div>
            <div className="text-xs text-[var(--muted)]">
              Business Account · {bioDraft.location || 'Local Area'}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-3 text-xs leading-relaxed text-[var(--ink)]">{generatedBio}</p>

        {/* One Link */}
        {waLink && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] truncate">
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate font-mono-num">{waLink.replace('https://', '')}</span>
          </div>
        )}

        {/* Contact Action Row */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--accent-ink)]">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Message</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--ink)]">
            <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Follow</span>
          </div>
        </div>

        {/* Pinned Post Slot */}
        <div className="mt-3 border-t border-[var(--line)] pt-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--muted)]">
            <Pin className="h-3 w-3" aria-hidden="true" />
            <span>Pinned post: Best offer &amp; how to order</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Lesson 3: Post Formula Anatomy & Format Guide ── */
export const PostAnatomyVisual: React.FC = () => {
  return (
    <div className="my-6 space-y-4">
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
          Example post using the 3-part formula
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="font-mono-num text-xs font-bold text-[var(--accent)]">01. HOOK</div>
            <p className="mt-1.5 text-sm font-semibold text-[var(--ink)]">
              &ldquo;Tired of buying lunch at 13:30 when meetings run late?&rdquo;
            </p>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Stops the scroll in line 1 by naming a real daily frustration.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="font-mono-num text-xs font-bold text-[var(--accent)]">02. VALUE</div>
            <p className="mt-1.5 text-sm font-semibold text-[var(--ink)]">
              &ldquo;Here is today&apos;s fresh box: grilled chicken, avocado, rice &amp; fruit, packed at 10:30.&rdquo;
            </p>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Shows proof, clear ingredients, and why it solves the problem.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="font-mono-num text-xs font-bold text-[var(--leaf)]">03. CALL TO ACTION</div>
            <p className="mt-1.5 text-sm font-semibold text-[var(--ink)]">
              &ldquo;Message &lsquo;LUNCH&rsquo; on WhatsApp before 10:00 to book yours.&rdquo;
            </p>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Gives one simple next step so interested readers take action.
            </p>
          </div>
        </div>
      </div>

      {/* Format visual comparison from Buffer's 52M posts */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            Format engagement benchmarks (Buffer 52M-post study)
          </span>
          <span className="text-xs text-[var(--muted)]">Use as a directional guide</span>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'LinkedIn Carousels', pct: 21.8, width: 100 },
            { label: 'Instagram Carousels', pct: 6.9, width: 32 },
            { label: 'Facebook (All formats)', pct: 5.6, width: 26 },
          ].map((row) => (
            <div key={row.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[var(--ink)]">{row.label}</span>
                <span className="font-mono-num font-semibold text-[var(--ink)]">~{row.pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--line)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${row.width}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Lesson 4: Visual Comment-to-Sale Chat Flow ── */
export const SalesChatWalkthrough: React.FC = () => {
  const steps = [
    {
      stage: '1. Public comment',
      who: 'Customer',
      msg: '"How much is this?"',
      align: 'left',
    },
    {
      stage: '2. Helpful public reply',
      who: 'You (public)',
      msg: '"The price is 5,000 RWF and delivery takes same day. Message me your location and I will confirm!"',
      align: 'right',
    },
    {
      stage: '3. Private DM close',
      who: 'You (WhatsApp / DM)',
      msg: '"Thanks for messaging! I recommend the Family Box for 3 people. Shall I prepare it for delivery at 12:00 today?"',
      align: 'right',
    },
    {
      stage: '4. Proof after delivery',
      who: 'Customer',
      msg: '"Arrived hot and right on time! Sharing a photo with my colleagues."',
      align: 'left',
    },
  ];

  return (
    <div className="my-6 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5">
      <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
        How one comment becomes a paid order &amp; review
      </div>
      <div className="space-y-3">
        {steps.map((s) => (
          <div
            key={s.stage}
            className={`flex flex-col ${s.align === 'right' ? 'items-end' : 'items-start'}`}
          >
            <span className="mb-1 text-[11px] font-semibold text-[var(--muted)]">
              {s.stage} · {s.who}
            </span>
            <div
              className={`max-w-[88%] rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                s.align === 'right'
                  ? 'border-[var(--accent)]/35 bg-[var(--surface)] text-[var(--ink)]'
                  : 'border-[var(--line)] bg-[var(--surface-alt)] text-[var(--ink)]'
              }`}
            >
              {s.msg}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Lesson 5: Ad Budget Visual Funnel ── */
export const AdFunnelVisual: React.FC<{
  currency: string;
  totalSpend: number;
  estClicks: number;
  estOrders: number;
}> = ({ currency, totalSpend, estClicks, estOrders }) => {
  if (!Number.isFinite(totalSpend) || !Number.isFinite(estClicks)) return null;
  const estChats = Math.max(estOrders, Math.round(estClicks * 0.25));

  const stages = [
    { label: '7-Day Test Budget', value: `${currency} ${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, pct: 100 },
    { label: 'Estimated Ad Clicks', value: `${estClicks.toLocaleString()} clicks`, pct: 68 },
    { label: 'Potential Inquiries (~25%)', value: `~${estChats.toLocaleString()} chats`, pct: 40 },
    { label: 'Projected Orders', value: `~${estOrders.toLocaleString()} orders`, pct: 22 },
  ];

  return (
    <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="text-xs font-semibold text-[var(--muted)] mb-3">
        Visual ad test funnel (directional estimate)
      </div>
      <div className="space-y-2">
        {stages.map((st) => (
          <div key={st.label} className="grid grid-cols-[150px_1fr_auto] items-center gap-3 text-xs">
            <span className="text-[var(--muted)] truncate">{st.label}</span>
            <div className="h-2.5 overflow-hidden rounded-full bg-[var(--bg)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-200"
                style={{ width: `${st.pct}%` }}
              />
            </div>
            <span className="font-mono-num font-semibold text-[var(--ink)]">{st.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Lesson 6: Engagement Benchmark Visual Comparison ── */
export const EngagementBenchmarkVisual: React.FC<{ userRate: number | null }> = ({ userRate }) => {
  const maxVal = Math.max(8, userRate || 0);

  return (
    <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="text-xs font-semibold text-[var(--ink)] mb-3">
        Your post vs. Buffer 2025 platform medians (context only)
      </div>
      <div className="space-y-2.5">
        {userRate !== null && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[var(--leaf)]">Your calculated post</span>
              <span className="font-mono-num text-[var(--leaf)]">{userRate.toFixed(1)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg)]">
              <div
                className="h-full rounded-full bg-[var(--leaf)] transition-all duration-200"
                style={{ width: `${Math.min(100, (userRate / maxVal) * 100)}%` }}
              />
            </div>
          </div>
        )}
        {PLATFORM_BENCHMARKS.map((b) => (
          <div key={b.name} className="space-y-1">
            <div className="flex justify-between text-xs text-[var(--muted)]">
              <span>{b.name} median</span>
              <span className="font-mono-num font-semibold text-[var(--ink)]">{b.median}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg)]">
              <div
                className="h-full rounded-full bg-[var(--accent)]/60"
                style={{ width: `${Math.min(100, (b.median / maxVal) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
