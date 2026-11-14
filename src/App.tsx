/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { CourseHero } from './components/CourseHero';
import { FeedbackAndSources } from './components/FeedbackAndSources';
import { LessonContent } from './components/LessonContent';
import { LessonSidebar } from './components/LessonSidebar';
import { ListenBar } from './components/ListenBar';
import { ProgressSummarySection } from './components/ProgressSummarySection';
import { TopBar } from './components/TopBar';
import { LESSON_IDS } from './data/courseData';
import { useCourseStorage } from './hooks/useCourseStorage';
import { useSpeechReader } from './hooks/useSpeechReader';
import type { LessonId } from './types/course';
import { downloadBlob } from './utils/clipboard';

function getLessonFromHash(): LessonId {
  if (typeof window === 'undefined') return 'start';
  const raw = window.location.hash.replace('#', '');
  return LESSON_IDS.includes(raw as LessonId) ? (raw as LessonId) : 'start';
}

export default function App() {
  const [activeId, setActiveId] = useState<LessonId>(getLessonFromHash);
  const [learnerName, setLearnerName] = useState<string>(() => {
    try {
      return localStorage.getItem('sss-learner-name') || '';
    } catch {
      return '';
    }
  });
  const [finishDate, setFinishDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );

  const articleRef = useRef<HTMLElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const storage = useCourseStorage();
  const speech = useSpeechReader(articleRef);

  const handleLearnerNameChange = useCallback((val: string) => {
    setLearnerName(val);
    try {
      localStorage.setItem('sss-learner-name', val);
    } catch {
      // Ignore
    }
  }, []);

  const selectLesson = useCallback(
    (id: LessonId) => {
      speech.stop();
      setActiveId(id);
      if (window.location.hash !== `#${id}`) {
        window.history.replaceState(null, '', `#${id}`);
      }
      const curriculumEl = document.getElementById('curriculum');
      if (curriculumEl) {
        curriculumEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [speech]
  );

  useEffect(() => {
    const onHashChange = () => {
      const next = getLessonFromHash();
      speech.stop();
      setActiveId(next);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [speech]);

  // Keyboard Alt+ArrowLeft / Alt+ArrowRight lesson navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const idx = LESSON_IDS.indexOf(activeId);
      if (e.key === 'ArrowRight' && idx < LESSON_IDS.length - 1) {
        e.preventDefault();
        selectLesson(LESSON_IDS[idx + 1]);
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault();
        selectLesson(LESSON_IDS[idx - 1]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeId, selectLesson]);

  const handleExportBackup = useCallback(() => {
    const payload = storage.exportBackup();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    downloadBlob(blob, 'social-sales-starter-progress.json');
  }, [storage]);

  const jumpToSummary = useCallback(() => {
    const el = document.getElementById('summarySection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      nameInputRef.current?.focus({ preventScroll: true });
    }, 350);
  }, []);

  const jumpToCurriculum = useCallback(() => {
    const el = document.getElementById('curriculum');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="app-shell min-h-screen">
      <TopBar
        onJumpToSummary={jumpToSummary}
        onJumpToCurriculum={jumpToCurriculum}
      />

      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 pb-16">
        <CourseHero
          theme={storage.theme}
          onToggleTheme={storage.toggleTheme}
          done={storage.done}
          tickedCount={storage.tickedCount}
          totalChecklists={storage.totalChecklists}
          quizzes={storage.quizzes}
          onSelectLesson={selectLesson}
          onJumpToCurriculum={jumpToCurriculum}
          onExportBackup={handleExportBackup}
          onImportBackup={storage.importBackup}
          onResetAll={storage.resetAllProgress}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)] items-start">
          <LessonSidebar
            activeId={activeId}
            done={storage.done}
            notes={storage.notes}
            onSelectLesson={selectLesson}
          />

          <main className="min-w-0">
            <ListenBar
              supported={speech.supported}
              voices={speech.voices}
              selectedVoiceUri={speech.selectedVoiceUri}
              onVoiceChange={speech.setSelectedVoiceUri}
              rate={speech.rate}
              onRateChange={speech.setRate}
              status={speech.status}
              progress={speech.progress}
              onStart={speech.start}
              onPause={speech.pause}
              onResume={speech.resume}
              onStop={speech.stop}
            />

            <LessonContent
              articleRef={articleRef}
              activeId={activeId}
              done={storage.done}
              onToggleDone={storage.toggleLessonDone}
              onSelectLesson={selectLesson}
              checks={storage.checks}
              onToggleCheck={storage.toggleCheck}
              notes={storage.notes}
              onUpdateNote={storage.updateNote}
              quizzes={storage.quizzes}
              onRecordQuiz={storage.recordQuizAnswer}
              onClearQuiz={storage.clearQuizAnswer}
              goalDraft={storage.goalDraft}
              onChangeGoal={storage.updateGoalDraft}
              offerDraft={storage.offerDraft}
              onChangeOffer={storage.updateOfferDraft}
              profileBioDraft={storage.profileBioDraft}
              onChangeProfileBio={storage.updateProfileBioDraft}
              contentIdeas={storage.contentIdeas}
              onChangeIdea={storage.updateContentIdea}
              onResetIdeas={storage.resetContentIdeas}
              replyVariables={storage.replyVariables}
              onChangeReplyVars={storage.updateReplyVariables}
              leads={storage.leads}
              onAddLead={storage.addLead}
              onUpdateLeadStatus={storage.updateLeadStatus}
              onRemoveLead={storage.removeLead}
              weeklyReview={storage.weeklyReview}
              onChangeWeeklyReview={storage.updateWeeklyReview}
              planStartDate={storage.planStartDate}
              onChangePlanStartDate={storage.updatePlanStartDate}
            />

            <ProgressSummarySection
              nameInputRef={nameInputRef}
              done={storage.done}
              tickedCount={storage.tickedCount}
              totalChecklists={storage.totalChecklists}
              notes={storage.notes}
              learnerName={learnerName}
              onLearnerNameChange={handleLearnerNameChange}
              finishDate={finishDate}
              onFinishDateChange={setFinishDate}
            />

            <FeedbackAndSources />
          </main>
        </div>
      </div>
    </div>
  );
}
