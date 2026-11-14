import { useCallback, useEffect, useState } from 'react';
import {
  ALL_CHECKLIST_KEYS,
  COURSE_AUTHOR,
  DEFAULT_CONTENT_IDEAS,
  LESSON_IDS,
  SAMPLE_LEADS,
} from '../data/courseData';
import type {
  ContentIdeaSlot,
  CourseBackupPayload,
  GoalDraft,
  LeadRecord,
  LessonId,
  OfferDraft,
  ProfileBioDraft,
  ReplyVariables,
  WeeklyReviewDraft,
} from '../types/course';

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : (parsed as T);
  } catch {
    return fallback;
  }
}

const DEFAULT_GOAL: GoalDraft = {
  product: '',
  goal: '',
};

const DEFAULT_OFFER: OfferDraft = {
  who: 'small cafés',
  result: 'more walk-in customers',
  what: 'eye-catching Instagram posts',
  platforms: ['Instagram', 'WhatsApp'],
};

const DEFAULT_PROFILE_BIO: ProfileBioDraft = {
  businessName: 'Kigali Fresh Kitchen',
  location: 'Kigali',
  deliveryPromise: 'Order before 10:00, delivered by 12:00',
  whatsappPhone: '250780000000',
  whatsappGreeting: 'Hello, I would like to place an order.',
};

const DEFAULT_REPLY_VARS: ReplyVariables = {
  price: '5,000 RWF',
  deliveryTime: 'same day',
};

const DEFAULT_WEEKLY_REVIEW: WeeklyReviewDraft = {
  bestPosts: '',
  weakPosts: '',
  commonPattern: '',
  nextWeekChange: '',
};

export function useCourseStorage() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = safeGet('sss-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [done, setDone] = useState<LessonId[]>(() => {
    const arr = parseJson<unknown[]>(safeGet('sss-done'), []);
    if (!Array.isArray(arr)) return [];
    return arr.filter((id): id is LessonId => typeof id === 'string' && LESSON_IDS.includes(id as LessonId));
  });

  const [checks, setChecks] = useState<Record<string, boolean>>(() => {
    const obj = parseJson<Record<string, boolean>>(safeGet('sss-checks'), {});
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj) ? obj : {};
  });

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    LESSON_IDS.forEach((id) => {
      map[id] = safeGet(`sss-note-${id}`) || '';
    });
    return map;
  });

  const [quizzes, setQuizzes] = useState<Record<string, number>>(() => {
    const obj = parseJson<Record<string, number>>(safeGet('sss-quizzes'), {});
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj) ? obj : {};
  });

  const [goalDraft, setGoalDraft] = useState<GoalDraft>(() =>
    parseJson(safeGet('sss-goal'), DEFAULT_GOAL)
  );

  const [offerDraft, setOfferDraft] = useState<OfferDraft>(() =>
    parseJson(safeGet('sss-offer'), DEFAULT_OFFER)
  );

  const [profileBioDraft, setProfileBioDraft] = useState<ProfileBioDraft>(() =>
    parseJson(safeGet('sss-bio'), DEFAULT_PROFILE_BIO)
  );

  const [contentIdeas, setContentIdeas] = useState<ContentIdeaSlot[]>(() =>
    parseJson(safeGet('sss-ideas'), DEFAULT_CONTENT_IDEAS)
  );

  const [replyVariables, setReplyVariables] = useState<ReplyVariables>(() =>
    parseJson(safeGet('sss-replies'), DEFAULT_REPLY_VARS)
  );

  const [leads, setLeads] = useState<LeadRecord[]>(() =>
    parseJson(safeGet('sss-leads'), SAMPLE_LEADS)
  );

  const [weeklyReview, setWeeklyReview] = useState<WeeklyReviewDraft>(() =>
    parseJson(safeGet('sss-review'), DEFAULT_WEEKLY_REVIEW)
  );

  const [planStartDate, setPlanStartDate] = useState<string>(() => {
    return safeGet('sss-plan-start') || new Date().toISOString().slice(0, 10);
  });

  // Apply dark class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    safeSet('sss-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleLessonDone = useCallback((id: LessonId) => {
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      safeSet('sss-done', JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleCheck = useCallback((key: string, checked?: boolean) => {
    setChecks((prev) => {
      const next = { ...prev, [key]: checked !== undefined ? checked : !prev[key] };
      safeSet('sss-checks', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateNote = useCallback((lessonId: LessonId, text: string) => {
    setNotes((prev) => ({ ...prev, [lessonId]: text }));
    safeSet(`sss-note-${lessonId}`, text);
  }, []);

  const recordQuizAnswer = useCallback((lessonId: LessonId, optionIndex: number) => {
    setQuizzes((prev) => {
      const next = { ...prev, [lessonId]: optionIndex };
      safeSet('sss-quizzes', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearQuizAnswer = useCallback((lessonId: LessonId) => {
    setQuizzes((prev) => {
      const next = { ...prev };
      delete next[lessonId];
      safeSet('sss-quizzes', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateGoalDraft = useCallback((patch: Partial<GoalDraft>) => {
    setGoalDraft((prev) => {
      const next = { ...prev, ...patch };
      safeSet('sss-goal', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateOfferDraft = useCallback((patch: Partial<OfferDraft>) => {
    setOfferDraft((prev) => {
      const next = { ...prev, ...patch };
      safeSet('sss-offer', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateProfileBioDraft = useCallback((patch: Partial<ProfileBioDraft>) => {
    setProfileBioDraft((prev) => {
      const next = { ...prev, ...patch };
      safeSet('sss-bio', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateContentIdea = useCallback((id: string, idea: string) => {
    setContentIdeas((prev) => {
      const next = prev.map((slot) => (slot.id === id ? { ...slot, idea } : slot));
      safeSet('sss-ideas', JSON.stringify(next));
      return next;
    });
  }, []);

  const resetContentIdeas = useCallback((toDefault: boolean) => {
    const next = toDefault
      ? DEFAULT_CONTENT_IDEAS
      : DEFAULT_CONTENT_IDEAS.map((slot) => ({ ...slot, idea: '' }));
    setContentIdeas(next);
    safeSet('sss-ideas', JSON.stringify(next));
  }, []);

  const updateReplyVariables = useCallback((patch: Partial<ReplyVariables>) => {
    setReplyVariables((prev) => {
      const next = { ...prev, ...patch };
      safeSet('sss-replies', JSON.stringify(next));
      return next;
    });
  }, []);

  const addLead = useCallback((lead: Omit<LeadRecord, 'id'>) => {
    setLeads((prev) => {
      const next = [{ ...lead, id: `lead-${Date.now()}` }, ...prev];
      safeSet('sss-leads', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateLeadStatus = useCallback((id: string, status: LeadRecord['status']) => {
    setLeads((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, status } : item));
      safeSet('sss-leads', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeLead = useCallback((id: string) => {
    setLeads((prev) => {
      const next = prev.filter((item) => item.id !== id);
      safeSet('sss-leads', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateWeeklyReview = useCallback((patch: Partial<WeeklyReviewDraft>) => {
    setWeeklyReview((prev) => {
      const next = { ...prev, ...patch };
      safeSet('sss-review', JSON.stringify(next));
      return next;
    });
  }, []);

  const updatePlanStartDate = useCallback((date: string) => {
    setPlanStartDate(date);
    safeSet('sss-plan-start', date);
  }, []);

  const exportBackup = useCallback((): CourseBackupPayload => {
    return {
      course: 'Social Sales Starter',
      author: COURSE_AUTHOR.name,
      exportedAt: new Date().toISOString(),
      completedSections: done,
      checklist: checks,
      notes,
      quizzes,
      goalDraft,
      offerDraft,
      profileBioDraft,
      contentIdeas,
      replyVariables,
      leads,
      weeklyReview,
      planStartDate,
    };
  }, [
    done,
    checks,
    notes,
    quizzes,
    goalDraft,
    offerDraft,
    profileBioDraft,
    contentIdeas,
    replyVariables,
    leads,
    weeklyReview,
    planStartDate,
  ]);

  const importBackup = useCallback((rawText: string): { ok: boolean; message: string } => {
    try {
      const data = JSON.parse(rawText) as Partial<CourseBackupPayload>;
      if (!data || typeof data !== 'object' || data.course !== 'Social Sales Starter') {
        return { ok: false, message: 'This file is not a valid Social Sales Starter backup.' };
      }
      if (Array.isArray(data.completedSections)) {
        const validDone = data.completedSections.filter((id): id is LessonId =>
          LESSON_IDS.includes(id as LessonId)
        );
        setDone(validDone);
        safeSet('sss-done', JSON.stringify(validDone));
      }
      if (data.checklist && typeof data.checklist === 'object') {
        setChecks(data.checklist);
        safeSet('sss-checks', JSON.stringify(data.checklist));
      }
      if (data.notes && typeof data.notes === 'object') {
        const merged: Record<string, string> = {};
        LESSON_IDS.forEach((id) => {
          const val = typeof data.notes?.[id] === 'string' ? data.notes[id] : '';
          merged[id] = val;
          safeSet(`sss-note-${id}`, val);
        });
        setNotes(merged);
      }
      if (data.quizzes && typeof data.quizzes === 'object') {
        setQuizzes(data.quizzes);
        safeSet('sss-quizzes', JSON.stringify(data.quizzes));
      }
      if (data.goalDraft) {
        setGoalDraft(data.goalDraft);
        safeSet('sss-goal', JSON.stringify(data.goalDraft));
      }
      if (data.offerDraft) {
        setOfferDraft(data.offerDraft);
        safeSet('sss-offer', JSON.stringify(data.offerDraft));
      }
      if (data.profileBioDraft) {
        setProfileBioDraft(data.profileBioDraft);
        safeSet('sss-bio', JSON.stringify(data.profileBioDraft));
      }
      if (Array.isArray(data.contentIdeas)) {
        setContentIdeas(data.contentIdeas);
        safeSet('sss-ideas', JSON.stringify(data.contentIdeas));
      }
      if (data.replyVariables) {
        setReplyVariables(data.replyVariables);
        safeSet('sss-replies', JSON.stringify(data.replyVariables));
      }
      if (Array.isArray(data.leads)) {
        setLeads(data.leads);
        safeSet('sss-leads', JSON.stringify(data.leads));
      }
      if (data.weeklyReview) {
        setWeeklyReview(data.weeklyReview);
        safeSet('sss-review', JSON.stringify(data.weeklyReview));
      }
      if (typeof data.planStartDate === 'string') {
        setPlanStartDate(data.planStartDate);
        safeSet('sss-plan-start', data.planStartDate);
      }
      return { ok: true, message: 'Backup restored successfully.' };
    } catch {
      return { ok: false, message: 'Could not read backup JSON file.' };
    }
  }, []);

  const resetAllProgress = useCallback(() => {
    setDone([]);
    setChecks({});
    setQuizzes({});
    setGoalDraft(DEFAULT_GOAL);
    setOfferDraft(DEFAULT_OFFER);
    setProfileBioDraft(DEFAULT_PROFILE_BIO);
    setContentIdeas(DEFAULT_CONTENT_IDEAS);
    setReplyVariables(DEFAULT_REPLY_VARS);
    setLeads(SAMPLE_LEADS);
    setWeeklyReview(DEFAULT_WEEKLY_REVIEW);
    const emptyNotes: Record<string, string> = {};
    LESSON_IDS.forEach((id) => {
      emptyNotes[id] = '';
      safeRemove(`sss-note-${id}`);
    });
    setNotes(emptyNotes);
    ['sss-done', 'sss-checks', 'sss-quizzes', 'sss-goal', 'sss-offer', 'sss-bio', 'sss-ideas', 'sss-replies', 'sss-leads', 'sss-review'].forEach(
      safeRemove
    );
  }, []);

  const tickedCount = ALL_CHECKLIST_KEYS.filter((k) => !!checks[k]).length;
  const totalChecklists = ALL_CHECKLIST_KEYS.length;

  return {
    theme,
    toggleTheme,
    done,
    toggleLessonDone,
    checks,
    toggleCheck,
    tickedCount,
    totalChecklists,
    notes,
    updateNote,
    quizzes,
    recordQuizAnswer,
    clearQuizAnswer,
    goalDraft,
    updateGoalDraft,
    offerDraft,
    updateOfferDraft,
    profileBioDraft,
    updateProfileBioDraft,
    contentIdeas,
    updateContentIdea,
    resetContentIdeas,
    replyVariables,
    updateReplyVariables,
    leads,
    addLead,
    updateLeadStatus,
    removeLead,
    weeklyReview,
    updateWeeklyReview,
    planStartDate,
    updatePlanStartDate,
    exportBackup,
    importBackup,
    resetAllProgress,
  };
}
