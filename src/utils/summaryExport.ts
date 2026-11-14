import { jsPDF } from 'jspdf';
import { LESSONS, SUMMARY_CREDIT, SUMMARY_DISCLAIMER } from '../data/courseData';
import type { LessonId } from '../types/course';
import { downloadBlob } from './clipboard';

export interface SummarySnapshot {
  learnerName: string;
  date: string;
  done: LessonId[];
  tickedCount: number;
  totalChecklists: number;
  notes: Record<string, string>;
}

export function isCourseComplete(done: LessonId[]): boolean {
  return LESSONS.every((l) => done.includes(l.id));
}

export function getSummaryTitle(done: LessonId[]): string {
  return isCourseComplete(done) ? 'Course completion summary' : 'Progress summary';
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const out: string[] = [];
  String(text)
    .split('\n')
    .forEach((par) => {
      const words = par.split(/\s+/);
      let line = '';
      words.forEach((w) => {
        const test = line ? `${line} ${w}` : w;
        if (line && ctx.measureText(test).width > maxW) {
          out.push(line);
          line = w;
        } else {
          line = test;
        }
      });
      out.push(line);
    });
  return out;
}

export function downloadSummaryPdf(snap: SummarySnapshot): boolean {
  try {
    const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 44;
    const contentW = pageW - margin * 2;
    const completedCount = LESSONS.filter((l) => snap.done.includes(l.id)).length;
    const title = getSummaryTitle(snap.done);

    const ensureSpace = (needed: number, currentY: number): number => {
      if (currentY + needed > pageH - margin) {
        doc.addPage();
        return margin;
      }
      return currentY;
    };

    // Header Band
    doc.setFillColor(15, 31, 26); // #0F1F1A
    doc.rect(0, 0, pageW, 96, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(169, 189, 179); // #A9BDB3
    doc.text('SOCIAL SALES STARTER', margin, 36);

    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin, 68);

    let y = 128;

    // Learner & Date
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(15, 31, 26);
    doc.text(snap.learnerName, margin, y);
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(70, 87, 79); // #46574F
    doc.text(`Date: ${snap.date}`, margin, y);
    y += 24;

    // Completion Progress Bar
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 31, 26);
    doc.text(`Sections completed: ${completedCount} of ${LESSONS.length}`, margin, y);
    y += 8;

    doc.setFillColor(211, 220, 214); // #D3DCD6
    doc.rect(margin, y, contentW, 8, 'F');
    if (completedCount > 0) {
      doc.setFillColor(30, 111, 70); // #1E6F46
      doc.rect(margin, y, (contentW * completedCount) / LESSONS.length, 8, 'F');
    }
    y += 24;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(70, 87, 79);
    doc.text(`Checklist items ticked: ${snap.tickedCount} of ${snap.totalChecklists}`, margin, y);
    y += 28;

    // Sections List
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 31, 26);
    doc.text('Sections', margin, y);
    y += 8;
    doc.setDrawColor(211, 220, 214);
    doc.line(margin, y, pageW - margin, y);
    y += 18;

    LESSONS.forEach((lesson) => {
      y = ensureSpace(24, y);
      const isDone = snap.done.includes(lesson.id);
      const label =
        lesson.number === '0' ? lesson.fullTitle : `Lesson ${lesson.number}: ${lesson.fullTitle}`;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(15, 31, 26);
      doc.text(label, margin, y);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      if (isDone) {
        doc.setTextColor(30, 111, 70);
      } else {
        doc.setTextColor(107, 123, 115);
      }
      doc.text(isDone ? 'Completed' : 'Not yet', pageW - margin, y, { align: 'right' });

      y += 8;
      doc.setDrawColor(235, 240, 237);
      doc.line(margin, y, pageW - margin, y);
      y += 16;
    });

    // Notes
    const sectionsWithNotes = LESSONS.filter((l) => (snap.notes[l.id] || '').trim().length > 0);
    if (sectionsWithNotes.length > 0) {
      y = ensureSpace(46, y + 8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 31, 26);
      doc.text('My notes', margin, y);
      y += 8;
      doc.setDrawColor(211, 220, 214);
      doc.line(margin, y, pageW - margin, y);
      y += 18;

      sectionsWithNotes.forEach((l) => {
        const heading = l.number === '0' ? l.fullTitle : `Lesson ${l.number}: ${l.fullTitle}`;
        const noteText = (snap.notes[l.id] || '').trim();
        const wrapped = doc.splitTextToSize(noteText, contentW) as string[];

        y = ensureSpace(20 + wrapped.length * 14, y);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(70, 87, 79);
        doc.text(heading, margin, y);
        y += 15;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(34, 34, 34);
        wrapped.forEach((line) => {
          y = ensureSpace(16, y);
          doc.text(line, margin, y);
          y += 14;
        });
        y += 10;
      });
    }

    // Footer Disclaimer + Attribution
    const disclaimerLines = doc.splitTextToSize(SUMMARY_DISCLAIMER, contentW) as string[];
    const creditLines = doc.splitTextToSize(SUMMARY_CREDIT, contentW) as string[];
    y = ensureSpace(28 + (disclaimerLines.length + creditLines.length) * 13, y + 12);

    doc.setDrawColor(211, 220, 214);
    doc.line(margin, y, pageW - margin, y);
    y += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(70, 87, 79);
    disclaimerLines.forEach((line) => {
      doc.text(line, margin, y);
      y += 13;
    });
    y += 2;
    doc.setFont('helvetica', 'bold');
    creditLines.forEach((line) => {
      doc.text(line, margin, y);
      y += 13;
    });

    const blob = doc.output('blob');
    downloadBlob(blob, 'social-sales-starter-summary.pdf');
    return true;
  } catch {
    return false;
  }
}

function paintSummaryCanvas(
  ctx: CanvasRenderingContext2D,
  snap: SummarySnapshot,
  width: number,
  dry: boolean
): number {
  const pad = 60;
  const maxW = width - pad * 2;
  let y = 0;
  const font = 'system-ui, -apple-system, "Segoe UI", Arial, sans-serif';

  const block = (
    str: string,
    size: number,
    weight: string,
    color: string,
    after = 0,
    maxLines?: number
  ) => {
    ctx.font = `${weight} ${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    let lines = wrapLines(ctx, str, maxW);
    const lh = Math.round(size * 1.42);
    if (maxLines && lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] += ' …';
    }
    lines.forEach((line) => {
      y += lh;
      if (!dry) ctx.fillText(line, pad, y - Math.round(lh * 0.25));
    });
    y += after;
  };

  if (!dry) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, 6000);
    ctx.fillStyle = '#0F1F1A';
    ctx.fillRect(0, 0, width, 170);
    ctx.font = `700 20px ${font}`;
    ctx.fillStyle = '#A9BDB3';
    ctx.textAlign = 'left';
    ctx.fillText('SOCIAL SALES STARTER', pad, 66);
    ctx.font = `800 46px ${font}`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(getSummaryTitle(snap.done), pad, 128);
  }

  y = 170 + 30;
  block(snap.learnerName, 40, '700', '#0F1F1A', 4);
  block(`Date: ${snap.date}`, 24, '400', '#46574F', 22);

  const completedCount = LESSONS.filter((l) => snap.done.includes(l.id)).length;
  block(`Sections completed: ${completedCount} of ${LESSONS.length}`, 24, '600', '#0F1F1A', 8);

  y += 6;
  if (!dry) {
    ctx.fillStyle = '#D3DCD6';
    ctx.fillRect(pad, y, maxW, 18);
    ctx.fillStyle = '#1E6F46';
    ctx.fillRect(pad, y, Math.round((maxW * completedCount) / LESSONS.length), 18);
  }
  y += 18 + 22;

  block(
    `Checklist items ticked: ${snap.tickedCount} of ${snap.totalChecklists}`,
    24,
    '400',
    '#46574F',
    26
  );

  block('Sections', 30, '700', '#0F1F1A', 6);
  LESSONS.forEach((lesson) => {
    const isDone = snap.done.includes(lesson.id);
    const label =
      lesson.number === '0' ? lesson.fullTitle : `Lesson ${lesson.number}: ${lesson.fullTitle}`;
    y += 34;
    if (!dry) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F1F1A';
      ctx.font = `400 24px ${font}`;
      ctx.fillText(label, pad, y - 8);
      ctx.textAlign = 'right';
      ctx.font = `700 22px ${font}`;
      ctx.fillStyle = isDone ? '#1E6F46' : '#6B7B73';
      ctx.fillText(isDone ? 'Completed' : 'Not yet', width - pad, y - 8);
      ctx.textAlign = 'left';
    }
  });
  y += 20;

  const sectionsWithNotes = LESSONS.filter((l) => (snap.notes[l.id] || '').trim().length > 0);
  if (sectionsWithNotes.length > 0) {
    block('My notes', 30, '700', '#0F1F1A', 6);
    sectionsWithNotes.forEach((l) => {
      const heading = l.number === '0' ? l.fullTitle : `Lesson ${l.number}: ${l.fullTitle}`;
      block(heading, 22, '700', '#46574F', 0);
      block((snap.notes[l.id] || '').trim(), 22, '400', '#222222', 16, 8);
    });
  }

  y += 14;
  if (!dry) {
    ctx.fillStyle = '#D3DCD6';
    ctx.fillRect(pad, y, maxW, 2);
  }
  y += 10;
  block(SUMMARY_DISCLAIMER, 19, '400', '#46574F', 4);
  block(SUMMARY_CREDIT, 19, '600', '#46574F', 0);
  y += pad;
  return y;
}

export function downloadSummaryPng(snap: SummarySnapshot): Promise<boolean> {
  return new Promise((resolve) => {
    const width = 1200;
    const probeCanvas = document.createElement('canvas');
    const probeCtx = probeCanvas.getContext('2d');
    if (!probeCtx) {
      resolve(false);
      return;
    }
    const height = paintSummaryCanvas(probeCtx, snap, width, true);
    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(false);
      return;
    }
    ctx.scale(2, 2);
    paintSummaryCanvas(ctx, snap, width, false);
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      downloadBlob(blob, 'social-sales-starter-summary.png');
      resolve(true);
    }, 'image/png');
  });
}

export function buildSummaryText(snap: SummarySnapshot): string {
  const completedCount = LESSONS.filter((l) => snap.done.includes(l.id)).length;
  const lines: string[] = [
    'SOCIAL SALES STARTER',
    getSummaryTitle(snap.done).toUpperCase(),
    '',
    `Learner: ${snap.learnerName}`,
    `Date: ${snap.date}`,
    `Sections completed: ${completedCount} of ${LESSONS.length}`,
    `Checklist items ticked: ${snap.tickedCount} of ${snap.totalChecklists}`,
    '',
    'SECTIONS',
  ];

  LESSONS.forEach((l) => {
    const isDone = snap.done.includes(l.id);
    const label = l.number === '0' ? l.fullTitle : `Lesson ${l.number}: ${l.fullTitle}`;
    lines.push(`${isDone ? '[x]' : '[ ]'} ${label}`);
  });

  const sectionsWithNotes = LESSONS.filter((l) => (snap.notes[l.id] || '').trim().length > 0);
  if (sectionsWithNotes.length > 0) {
    lines.push('', 'MY NOTES');
    sectionsWithNotes.forEach((l) => {
      const heading = l.number === '0' ? l.fullTitle : `Lesson ${l.number}: ${l.fullTitle}`;
      lines.push('', heading, (snap.notes[l.id] || '').trim());
    });
  }

  lines.push('', SUMMARY_DISCLAIMER, SUMMARY_CREDIT);
  return lines.join('\n');
}

export function downloadSummaryTxt(snap: SummarySnapshot): void {
  downloadBlob(
    new Blob([buildSummaryText(snap)], { type: 'text/plain;charset=utf-8' }),
    'social-sales-starter-summary.txt'
  );
}
