import { useCallback, useEffect, useRef, useState } from 'react';

export interface VoiceOption {
  uri: string;
  label: string;
  lang: string;
}

export function useSpeechReader(articleRef: React.RefObject<HTMLElement | null>) {
  const [supported] = useState<boolean>(() =>
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined'
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>('');
  const [rate, setRate] = useState<number>(1);
  const [status, setStatus] = useState<'idle' | 'speaking' | 'paused'>('idle');
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });

  const queueRef = useRef<HTMLElement[]>([]);
  const indexRef = useRef<number>(0);
  const tokenRef = useRef<number>(0);
  const activeElRef = useRef<HTMLElement | null>(null);
  const rateRef = useRef<number>(rate);
  const voiceUriRef = useRef<string>(selectedVoiceUri);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  useEffect(() => {
    voiceUriRef.current = selectedVoiceUri;
  }, [selectedVoiceUri]);

  const clearHighlight = useCallback(() => {
    if (activeElRef.current) {
      activeElRef.current.classList.remove('reading-active');
      activeElRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    tokenRef.current += 1;
    if (supported) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    clearHighlight();
    setStatus('idle');
    setProgress({ current: 0, total: 0 });
  }, [clearHighlight, supported]);

  // Load voices
  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const enVoices = synth.getVoices().filter((v) => /^en/i.test(v.lang));
      if (!enVoices.length) return;
      setVoices(enVoices);
      setSelectedVoiceUri((prev) => {
        if (prev && enVoices.some((v) => v.voiceURI === prev)) return prev;
        const preferred = enVoices.find((v) =>
          /natural|neural|online|enhanced|premium|google/i.test(v.name)
        );
        return preferred ? preferred.voiceURI : enVoices[0].voiceURI;
      });
    };
    loadVoices();
    synth.addEventListener?.('voiceschanged', loadVoices);
    return () => {
      synth.removeEventListener?.('voiceschanged', loadVoices);
    };
  }, [supported]);

  useEffect(() => {
    const onPageHide = () => stop();
    window.addEventListener('pagehide', onPageHide);
    return () => {
      window.removeEventListener('pagehide', onPageHide);
      stop();
    };
  }, [stop]);

  const speakNext = useCallback(
    (myToken: number) => {
      if (myToken !== tokenRef.current) return;
      const queue = queueRef.current;
      if (indexRef.current >= queue.length) {
        clearHighlight();
        setStatus('idle');
        setProgress({ current: 0, total: 0 });
        return;
      }

      const el = queue[indexRef.current];
      const stepNumber = indexRef.current + 1;
      indexRef.current += 1;

      clearHighlight();
      el.classList.add('reading-active');
      activeElRef.current = el;
      setProgress({ current: stepNumber, total: queue.length });

      try {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      } catch {
        // Ignore
      }

      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text) {
        speakNext(myToken);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const chosenVoice = voices.find((v) => v.voiceURI === voiceUriRef.current) || voices[0];
      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang;
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = rateRef.current || 1;
      utterance.onend = () => speakNext(myToken);
      utterance.onerror = () => {
        if (myToken === tokenRef.current) speakNext(myToken);
      };
      window.speechSynthesis.speak(utterance);
    },
    [clearHighlight, voices]
  );

  const start = useCallback(() => {
    if (!supported || !articleRef.current) return;
    stop();
    const candidates = Array.from(
      articleRef.current.querySelectorAll<HTMLElement>('h2, h3, p, li')
    ).filter((el) => !el.closest('.no-say') && (el.textContent || '').trim().length > 0);

    if (!candidates.length) return;
    queueRef.current = candidates;
    indexRef.current = 0;
    const myToken = tokenRef.current + 1;
    tokenRef.current = myToken;
    setStatus('speaking');
    speakNext(myToken);
  }, [articleRef, speakNext, stop, supported]);

  const pause = useCallback(() => {
    if (!supported || status !== 'speaking') return;
    try {
      window.speechSynthesis.pause();
      setStatus('paused');
    } catch {
      stop();
    }
  }, [status, stop, supported]);

  const resume = useCallback(() => {
    if (!supported || status !== 'paused') return;
    try {
      window.speechSynthesis.resume();
      setStatus('speaking');
    } catch {
      stop();
    }
  }, [status, stop, supported]);

  return {
    supported,
    voices,
    selectedVoiceUri,
    setSelectedVoiceUri,
    rate,
    setRate,
    status,
    progress,
    start,
    pause,
    resume,
    stop,
  };
}
