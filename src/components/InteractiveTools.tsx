import React, { useState } from 'react';
import { Check, Copy, Plus, RotateCcw, Trash2 } from 'lucide-react';
import {
  DEFAULT_CONTENT_IDEAS,
  PLATFORM_BENCHMARKS,
  PLAN_WEEKS,
  PROFILE_CHECKLIST_ITEMS,
} from '../data/courseData';
import type {
  ContentIdeaSlot,
  GoalDraft,
  LeadRecord,
  OfferDraft,
  ProfileBioDraft,
  ReplyVariables,
  WeeklyReviewDraft,
} from '../types/course';
import { copyToClipboard } from '../utils/clipboard';
import {
  AdFunnelVisual,
  EngagementBenchmarkVisual,
  LiveProfilePreview,
} from './LessonVisualGuides';

function buildOfferSentence(offer: OfferDraft): string {
  const who = offer.who.trim() || '[who]';
  const res = offer.result.trim() || '[result]';
  const what = offer.what.trim() || '[what you sell]';
  return `I help ${who} get ${res} with ${what}.`;
}

/* ── Copy Button Helper ── */
const CopyButton: React.FC<{ text: string; label: string }> = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyToClipboard(text);
        if (ok) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }
      }}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--ink)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-[var(--leaf)]" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : label}
    </button>
  );
};

/* ── Lesson 0: 30-Day Goal Setter ── */
export const GoalSetterTool: React.FC<{
  goalDraft: GoalDraft;
  onChange: (patch: Partial<GoalDraft>) => void;
}> = ({ goalDraft, onChange }) => {
  return (
    <div className="no-print my-6 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5">
      <h4 className="font-display text-base font-bold text-[var(--ink)]">
        Your 30-day goal tracker
      </h4>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Save what you sell and one clear number you want to reach. It appears in your final progress summary.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--ink)]">
          <span>What you sell (product, service, or skill)</span>
          <input
            type="text"
            value={goalDraft.product}
            onChange={(e) => onChange({ product: e.target.value })}
            placeholder="e.g. Fresh lunch boxes in Kigali"
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--ink)]">
          <span>30-day numeric goal</span>
          <input
            type="text"
            value={goalDraft.goal}
            onChange={(e) => onChange({ goal: e.target.value })}
            placeholder="e.g. Get 10 new customer messages every week"
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
          />
        </label>
      </div>
    </div>
  );
};

/* ── Lesson 1: Offer Builder & Platform Selector ── */
const PLATFORMS = [
  { id: 'WhatsApp', hint: 'Best for local chats, catalogs, and fast repeat orders.' },
  { id: 'Instagram', hint: 'Best for food, fashion, beauty, crafts, and visual proof.' },
  { id: 'TikTok', hint: 'Best for reaching people who do not follow you yet via short video.' },
  { id: 'Facebook', hint: 'Best for local community groups and steady photo/text posts.' },
  { id: 'LinkedIn', hint: 'Best for services, business clients, and professional skills.' },
];

export const OfferBuilderTool: React.FC<{
  offerDraft: OfferDraft;
  onChange: (patch: Partial<OfferDraft>) => void;
}> = ({ offerDraft, onChange }) => {
  const sentence = buildOfferSentence(offerDraft);

  const togglePlatform = (name: string) => {
    const exists = offerDraft.platforms.includes(name);
    if (exists) {
      onChange({ platforms: offerDraft.platforms.filter((p) => p !== name) });
    } else if (offerDraft.platforms.length < 2) {
      onChange({ platforms: [...offerDraft.platforms, name] });
    } else {
      onChange({ platforms: [offerDraft.platforms[1], name] });
    }
  };

  return (
    <div className="no-print my-6 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5">
      <h4 className="font-display text-base font-bold text-[var(--ink)]">Offer builder</h4>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Example values are filled in. Replace them with your own customer, result, and product.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--ink)]">
          <span>Who you help</span>
          <input
            type="text"
            value={offerDraft.who}
            onChange={(e) => onChange({ who: e.target.value })}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--ink)]">
          <span>The result they get</span>
          <input
            type="text"
            value={offerDraft.result}
            onChange={(e) => onChange({ result: e.target.value })}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--ink)]">
          <span>What you sell</span>
          <input
            type="text"
            value={offerDraft.what}
            onChange={(e) => onChange({ what: e.target.value })}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
          />
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
        <p className="font-semibold text-[var(--ink)]">{sentence}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <CopyButton text={sentence} label="Copy sentence" />
        <span className="text-xs text-[var(--muted)]">Saved automatically</span>
      </div>

      <div className="mt-5 border-t border-[var(--line)] pt-4">
        <p className="text-xs font-semibold text-[var(--ink)]">
          Pick 1 or 2 starting platforms (selected: {offerDraft.platforms.join(', ') || 'none'})
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {PLATFORMS.map((p) => {
            const active = offerDraft.platforms.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePlatform(p.id)}
                aria-pressed={active}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap min-h-[38px] ${
                  active
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]'
                    : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)]'
                }`}
              >
                {p.id}
              </button>
            );
          })}
        </div>
        {offerDraft.platforms.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-[var(--muted)]">
            {offerDraft.platforms.map((name) => {
              const info = PLATFORMS.find((p) => p.id === name);
              return info ? (
                <li key={name}>
                  <strong className="text-[var(--ink)]">{info.id}:</strong> {info.hint}
                </li>
              ) : null;
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ── Lesson 2: Profile Bio & WhatsApp Link Builder + Checklist ── */
export const ProfileTools: React.FC<{
  checks: Record<string, boolean>;
  onToggleCheck: (key: string, val: boolean) => void;
  bioDraft: ProfileBioDraft;
  onChangeBio: (patch: Partial<ProfileBioDraft>) => void;
  offerDraft: OfferDraft;
}> = ({ checks, onToggleCheck, bioDraft, onChangeBio, offerDraft }) => {
  const cleanPhone = bioDraft.whatsappPhone.replace(/[^\d]/g, '');
  const waLink = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(bioDraft.whatsappGreeting || 'Hello!')}`
    : '';

  const generatedBio = `${bioDraft.businessName || 'Your Business'} · ${
    offerDraft.what ? `Offering ${offerDraft.what}` : 'What you sell'
  } for ${offerDraft.who || 'customers'} in ${bioDraft.location || 'your city'}. ${
    bioDraft.deliveryPromise ? `${bioDraft.deliveryPromise}. ` : ''
  }Tap the link below to order on WhatsApp.`;

  return (
    <div className="no-print space-y-6 my-6">
      {/* Interactive Bio & WhatsApp Link Helper */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5">
        <h4 className="font-display text-base font-bold text-[var(--ink)]">
          Bio & WhatsApp order link builder
        </h4>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Generates a five-second profile bio and a one-tap WhatsApp chat link you can paste into your profile.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-xs font-semibold text-[var(--ink)]">
            <span>Business or account name</span>
            <input
              type="text"
              value={bioDraft.businessName}
              onChange={(e) => onChangeBio({ businessName: e.target.value })}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
            />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold text-[var(--ink)]">
            <span>City / area you serve</span>
            <input
              type="text"
              value={bioDraft.location}
              onChange={(e) => onChangeBio({ location: e.target.value })}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
            />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold text-[var(--ink)]">
            <span>Speed or promise</span>
            <input
              type="text"
              value={bioDraft.deliveryPromise}
              onChange={(e) => onChangeBio({ deliveryPromise: e.target.value })}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
            />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold text-[var(--ink)]">
            <span>WhatsApp number (with country code, digits only)</span>
            <input
              type="text"
              value={bioDraft.whatsappPhone}
              onChange={(e) => onChangeBio({ whatsappPhone: e.target.value })}
              placeholder="e.g. 250780000000"
              className="font-mono-num rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="space-y-3">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Bio preview ({generatedBio.length} chars)
                </span>
              </div>
              <p className="text-sm text-[var(--ink)]">{generatedBio}</p>
              <div className="mt-3">
                <CopyButton text={generatedBio} label="Copy bio" />
              </div>
            </div>

            {waLink && (
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
                <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
                  One-tap WhatsApp link
                </span>
                <p className="font-mono-num text-xs break-all text-[var(--accent)]">{waLink}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CopyButton text={waLink} label="Copy WhatsApp link" />
                </div>
              </div>
            )}
          </div>

          <LiveProfilePreview
            bioDraft={bioDraft}
            offerDraft={offerDraft}
            generatedBio={generatedBio}
            waLink={waLink}
          />
        </div>
      </div>

      {/* Do this now Checklist */}
      <div className="rounded-xl border border-[var(--sun-border)] bg-[var(--sun)] p-5 text-[var(--sun-ink)]">
        <span className="block text-xs font-bold uppercase tracking-wider mb-1.5">
          Do this now
        </span>
        <p className="font-medium mb-3">Tick each item when your profile has it.</p>
        <div className="space-y-2.5">
          {PROFILE_CHECKLIST_ITEMS.map((item) => (
            <label key={item.key} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!checks[item.key]}
                onChange={(e) => onToggleCheck(item.key, e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--accent)] rounded"
              />
              <span className={checks[item.key] ? 'line-through opacity-75' : ''}>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Lesson 3: 12-Idea Content Planner Matrix ── */
export const ContentPlannerTool: React.FC<{
  ideas: ContentIdeaSlot[];
  onChangeIdea: (id: string, value: string) => void;
  onResetIdeas: (toDefault: boolean) => void;
}> = ({ ideas, onChangeIdea, onResetIdeas }) => {
  const weeks = [1, 2, 3, 4];
  const fullPlanText = weeks
    .map((w) => {
      const items = ideas.filter((i) => i.week === w);
      return `Week ${w}\n` + items.map((i) => `- ${i.day}: ${i.idea || '(empty)'}`).join('\n');
    })
    .join('\n\n');

  return (
    <div className="no-print my-6 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-display text-base font-bold text-[var(--ink)]">
            4-week content planner (12 posts)
          </h4>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Starter ideas are pre-filled. Edit any slot to match your product or service.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onResetIdeas(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--ink)] whitespace-nowrap min-h-[36px]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Load starter ideas
          </button>
          <CopyButton text={fullPlanText} label="Copy 12-post plan" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {weeks.map((weekNum) => {
          const slots = ideas.filter((i) => i.week === weekNum);
          return (
            <div
              key={weekNum}
              className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 space-y-3"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Week {weekNum}
              </div>
              {slots.map((slot) => (
                <label key={slot.id} className="grid gap-1 text-xs">
                  <span className="font-semibold text-[var(--ink)]">{slot.day}</span>
                  <input
                    type="text"
                    value={slot.idea}
                    onChange={(e) => onChangeIdea(slot.id, e.target.value)}
                    placeholder="Write your post idea..."
                    className="rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-xs text-[var(--ink)] min-h-[38px]"
                  />
                </label>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── Lesson 4: Customizable Reply Scripts + Lead Tracker ── */
export const RepliesAndLeadTrackerTool: React.FC<{
  replyVars: ReplyVariables;
  onChangeReplyVars: (patch: Partial<ReplyVariables>) => void;
  leads: LeadRecord[];
  onAddLead: (lead: Omit<LeadRecord, 'id'>) => void;
  onUpdateLeadStatus: (id: string, status: LeadRecord['status']) => void;
  onRemoveLead: (id: string) => void;
}> = ({ replyVars, onChangeReplyVars, leads, onAddLead, onUpdateLeadStatus, onRemoveLead }) => {
  const [name, setName] = useState('');
  const [source, setSource] = useState('Instagram DM');
  const [want, setWant] = useState('');
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().slice(0, 10));

  const s1 = 'Hello, thanks for your message. What are you looking for today?';
  const s2 = `The price is ${replyVars.price || '[price]'} and delivery takes ${
    replyVars.deliveryTime || '[time]'
  }. Send me your location and I will confirm the total.`;
  const s3 =
    'Hello, did your order arrive well? If you are happy, could you send me a photo or one sentence about it? I will only post it with your permission.';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !want.trim()) return;
    onAddLead({
      name: name.trim(),
      source: source.trim() || 'Direct Message',
      want: want.trim(),
      status: 'New',
      followUpDate,
    });
    setName('');
    setWant('');
  };

  const leadCsv = [
    'Name,Where they came from,What they want,Status,Follow-up date',
    ...leads.map(
      (l) =>
        `"${l.name.replace(/"/g, '""')}","${l.source.replace(/"/g, '""')}","${l.want.replace(
          /"/g,
          '""'
        )}","${l.status}","${l.followUpDate}"`
    ),
  ].join('\n');

  return (
    <div className="no-print my-6 space-y-6">
      {/* Reply Scripts */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5">
        <h4 className="font-display text-base font-bold text-[var(--ink)]">
          Three replies you can copy
        </h4>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Set your price and delivery time once, and all scripts update automatically.
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-xs font-semibold text-[var(--ink)]">
            <span>Your price</span>
            <input
              type="text"
              value={replyVars.price}
              onChange={(e) => onChangeReplyVars({ price: e.target.value })}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-normal text-[var(--ink)] min-h-[42px]"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[var(--ink)]">
            <span>Delivery time</span>
            <input
              type="text"
              value={replyVars.deliveryTime}
              onChange={(e) => onChangeReplyVars({ deliveryTime: e.target.value })}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-normal text-[var(--ink)] min-h-[42px]"
            />
          </label>
        </div>

        <div className="mt-4 space-y-3">
          {[
            { label: 'Copy greeting', text: s1 },
            { label: 'Copy price reply', text: s2 },
            { label: 'Copy follow-up', text: s3 },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-[var(--ink)]">{item.text}</p>
              <CopyButton text={item.text} label={item.label} />
            </div>
          ))}
        </div>
      </div>

      {/* Lead Tracker */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="font-display text-base font-bold text-[var(--ink)]">
              Mini lead tracker
            </h4>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Track people who messaged or commented so nobody slips through the cracks.
            </p>
          </div>
          {leads.length > 0 && <CopyButton text={leadCsv} label="Copy as CSV" />}
        </div>

        <form onSubmit={handleAdd} className="mt-4 grid gap-2.5 sm:grid-cols-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer name"
            aria-label="Customer name"
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--ink)] min-h-[40px]"
          />
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Platform (e.g. WhatsApp)"
            aria-label="Lead source"
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--ink)] min-h-[40px]"
          />
          <input
            type="text"
            value={want}
            onChange={(e) => setWant(e.target.value)}
            placeholder="What they want"
            aria-label="What they want"
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--ink)] min-h-[40px]"
          />
          <input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            aria-label="Follow-up date"
            className="font-mono-num rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--ink)] min-h-[40px]"
          />
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--accent-ink)] hover:bg-[var(--accent-hover)] whitespace-nowrap min-h-[40px]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add lead
          </button>
        </form>

        {leads.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--surface)]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--line)] bg-[var(--surface-alt)] text-[var(--muted)]">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Name</th>
                  <th className="px-3 py-2.5 font-semibold">Source</th>
                  <th className="px-3 py-2.5 font-semibold">What they want</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold">Follow up</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-3 py-2.5 font-semibold text-[var(--ink)]">{lead.name}</td>
                    <td className="px-3 py-2.5 text-[var(--muted)]">{lead.source}</td>
                    <td className="px-3 py-2.5 text-[var(--ink)]">{lead.want}</td>
                    <td className="px-3 py-2.5">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          onUpdateLeadStatus(lead.id, e.target.value as LeadRecord['status'])
                        }
                        aria-label={`Status for ${lead.name}`}
                        className={`rounded-md border px-2 py-1 text-xs font-semibold ${
                          lead.status === 'Paid'
                            ? 'border-[var(--leaf)] bg-[var(--leaf-soft)] text-[var(--leaf)]'
                            : lead.status === 'Talking'
                            ? 'border-[var(--accent)] bg-[var(--bg)] text-[var(--accent)]'
                            : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Talking">Talking</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>
                    <td className="px-3 py-2.5 font-mono-num text-[var(--muted)]">
                      {lead.followUpDate}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => onRemoveLead(lead.id)}
                        aria-label={`Delete ${lead.name}`}
                        className="cursor-pointer rounded p-1.5 text-[var(--muted)] hover:text-[var(--warn)]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-xs text-[var(--muted)]">
            No leads added yet. Add your first message or comment inquiry above.
          </p>
        )}
      </div>
    </div>
  );
};

/* ── Lesson 5: Multi-Currency Test Budget & Break-Even Calculator ── */
const CURRENCIES = ['USD', 'RWF', 'KES', 'UGX', 'NGN', 'EUR', 'GBP'];

export const BudgetCalculatorTool: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [dailyBudget, setDailyBudget] = useState('5');
  const [days, setDays] = useState('7');
  const [cpc, setCpc] = useState('0.5');
  const [convRate, setConvRate] = useState('4');

  const d = parseFloat(dailyBudget);
  const n = parseFloat(days);
  const c = parseFloat(cpc);
  const cr = parseFloat(convRate);

  const totalSpend = Number.isFinite(d) && d >= 0 && Number.isFinite(n) && n >= 0 ? d * n : NaN;
  const estClicks =
    Number.isFinite(totalSpend) && Number.isFinite(c) && c > 0 ? Math.floor(totalSpend / c) : NaN;
  const estOrders =
    Number.isFinite(estClicks) && Number.isFinite(cr) && cr >= 0
      ? Math.round((estClicks * cr) / 100)
      : NaN;

  const formatAmt = (val: number) =>
    `${currency} ${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <div className="no-print my-6 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-base font-bold text-[var(--ink)]">
            Test budget calculator
          </h4>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Example values are filled in. Switch to your own currency and use the cost per click you see in Ads Manager.
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-[var(--ink)]">
          <span>Currency</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--ink)] min-h-[38px]"
          >
            {CURRENCIES.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <label className="grid gap-1 text-xs font-semibold text-[var(--ink)]">
          <span>Budget per day ({currency})</span>
          <input
            type="number"
            min="0"
            step="any"
            value={dailyBudget}
            onChange={(e) => setDailyBudget(e.target.value)}
            className="font-mono-num rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
          />
        </label>
        <label className="grid gap-1 text-xs font-semibold text-[var(--ink)]">
          <span>Number of days</span>
          <input
            type="number"
            min="1"
            step="1"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="font-mono-num rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
          />
        </label>
        <label className="grid gap-1 text-xs font-semibold text-[var(--ink)]">
          <span>Est. cost per click</span>
          <input
            type="number"
            min="0"
            step="any"
            value={cpc}
            onChange={(e) => setCpc(e.target.value)}
            className="font-mono-num rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
          />
        </label>
        <label className="grid gap-1 text-xs font-semibold text-[var(--ink)]">
          <span>Click-to-order rate (%)</span>
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={convRate}
            onChange={(e) => setConvRate(e.target.value)}
            className="font-mono-num rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="font-mono-num text-xl font-bold text-[var(--ink)]">
            {Number.isFinite(totalSpend) ? formatAmt(totalSpend) : '-'}
          </div>
          <div className="mt-0.5 text-xs text-[var(--muted)]">Total you will spend</div>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="font-mono-num text-xl font-bold text-[var(--ink)]">
            {Number.isFinite(estClicks) ? estClicks.toLocaleString() : '-'}
          </div>
          <div className="mt-0.5 text-xs text-[var(--muted)]">Estimated clicks</div>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="font-mono-num text-xl font-bold text-[var(--leaf)]">
            {Number.isFinite(estOrders) ? `~${estOrders.toLocaleString()}` : '-'}
          </div>
          <div className="mt-0.5 text-xs text-[var(--muted)]">
            Est. orders at {convRate || 0}% conversion
          </div>
        </div>
      </div>

      <AdFunnelVisual
        currency={currency}
        totalSpend={totalSpend}
        estClicks={estClicks}
        estOrders={estOrders}
      />
    </div>
  );
};

/* ── Lesson 6: Engagement Rate Calculator + Weekly Review Log ── */
export const EngagementAndReviewTool: React.FC<{
  review: WeeklyReviewDraft;
  onChangeReview: (patch: Partial<WeeklyReviewDraft>) => void;
}> = ({ review, onChangeReview }) => {
  const [eng, setEng] = useState('120');
  const [reach, setReach] = useState('2400');

  const eVal = parseFloat(eng);
  const rVal = parseFloat(reach);
  const ratePct = Number.isFinite(eVal) && eVal >= 0 && Number.isFinite(rVal) && rVal > 0
    ? (eVal / rVal) * 100
    : null;

  return (
    <div className="no-print my-6 space-y-6">
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5">
        <h4 className="font-display text-base font-bold text-[var(--ink)]">
          Engagement rate calculator
        </h4>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Example values are filled in. Use the numbers from one of your own posts.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-xs font-semibold text-[var(--ink)]">
            <span>Engagement (reactions, comments, shares, saves)</span>
            <input
              type="number"
              min="0"
              step="1"
              value={eng}
              onChange={(e) => setEng(e.target.value)}
              className="font-mono-num rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[var(--ink)]">
            <span>Reach (people who saw it)</span>
            <input
              type="number"
              min="0"
              step="1"
              value={reach}
              onChange={(e) => setReach(e.target.value)}
              className="font-mono-num rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="font-mono-num text-2xl font-bold text-[var(--ink)]">
              {ratePct !== null ? `${ratePct.toFixed(1)}%` : '-'}
            </div>
            <div className="mt-0.5 text-xs text-[var(--muted)]">Your engagement rate</div>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="text-xs font-semibold text-[var(--ink)] mb-1.5">
              Buffer 2025 medians (background only)
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
              {PLATFORM_BENCHMARKS.map((b) => (
                <div key={b.name} className="flex justify-between">
                  <span>{b.name}</span>
                  <span className="font-mono-num font-semibold text-[var(--ink)]">{b.median}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <EngagementBenchmarkVisual userRate={ratePct} />
      </div>

      {/* Weekly Review Log */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5">
        <h4 className="font-display text-base font-bold text-[var(--ink)]">
          My 20-minute weekly review log
        </h4>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Saved in your browser so you can compare next week against this week.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-xs font-semibold text-[var(--ink)]">
            <span>Top 3 best posts this week</span>
            <textarea
              rows={2}
              value={review.bestPosts}
              onChange={(e) => onChangeReview({ bestPosts: e.target.value })}
              placeholder="e.g. Price list carousel, behind-the-scenes packaging reel..."
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2.5 text-xs font-normal text-[var(--ink)]"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[var(--ink)]">
            <span>3 weakest posts this week</span>
            <textarea
              rows={2}
              value={review.weakPosts}
              onChange={(e) => onChangeReview({ weakPosts: e.target.value })}
              placeholder="e.g. Generic quote graphic..."
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2.5 text-xs font-normal text-[var(--ink)]"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[var(--ink)]">
            <span>What did the best posts have in common?</span>
            <input
              type="text"
              value={review.commonPattern}
              onChange={(e) => onChangeReview({ commonPattern: e.target.value })}
              placeholder="e.g. Showed a real customer result in the first line"
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-normal text-[var(--ink)] min-h-[40px]"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[var(--ink)]">
            <span>One change to test next week</span>
            <input
              type="text"
              value={review.nextWeekChange}
              onChange={(e) => onChangeReview({ nextWeekChange: e.target.value })}
              placeholder="e.g. Post 2 carousels with clear prices in slide 3"
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-normal text-[var(--ink)] min-h-[40px]"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

/* ── Lesson 7: 30-Day Plan Checklists + Start Date Scheduler ── */
function addDays(isoDate: string, daysToAdd: number): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3) return '';
  const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + daysToAdd));
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export const ThirtyDayPlanTool: React.FC<{
  checks: Record<string, boolean>;
  onToggleCheck: (key: string, val: boolean) => void;
  startDate: string;
  onChangeStartDate: (date: string) => void;
}> = ({ checks, onToggleCheck, startDate, onChangeStartDate }) => {
  return (
    <div className="no-print my-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4">
        <div>
          <span className="text-sm font-semibold text-[var(--ink)]">
            Pick your Week 1 start date
          </span>
          <p className="text-xs text-[var(--muted)]">
            Each week below automatically calculates your target dates.
          </p>
        </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChangeStartDate(e.target.value)}
          aria-label="Week 1 start date"
          className="font-mono-num rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] min-h-[42px]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PLAN_WEEKS.map((w) => {
          const offset = (w.week - 1) * 7;
          const dateRange = startDate
            ? `${addDays(startDate, offset)} – ${addDays(startDate, offset + 6)}`
            : '';
          const completedInWeek = w.items.filter((i) => !!checks[i.key]).length;

          return (
            <div
              key={w.week}
              className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4"
            >
              <div className="flex items-baseline justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-display text-base font-bold text-[var(--ink)]">{w.title}</h3>
                  {dateRange && (
                    <span className="font-mono-num text-xs text-[var(--muted)]">{dateRange}</span>
                  )}
                </div>
                <span className="font-mono-num text-xs font-semibold text-[var(--muted)]">
                  {completedInWeek}/{w.items.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {w.items.map((item) => (
                  <label key={item.key} className="flex items-start gap-3 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={!!checks[item.key]}
                      onChange={(e) => onToggleCheck(item.key, e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--accent)] rounded"
                    />
                    <span className={checks[item.key] ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)]'}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
