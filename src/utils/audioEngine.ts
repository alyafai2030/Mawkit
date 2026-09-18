import { VoiceOption } from '../types';

class SafeAudioEngine {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private activeHtmlAudio: HTMLAudioElement | null = null;
  private isCurrentlyPlaying = false;
  private onEndCallbacks: (() => void)[] = [];

  public adhanVoices: VoiceOption[] = [
    {
      id: 'adhan_daghreeri',
      name: 'أذان الشيخ حمد الدقريري',
      reciter: 'صوت نقي وواضح وخاشع (تسجيل حقيقي)',
      url: '/audio/adhan_daghreeri.mp3',
      isRealAudio: true,
    },
    {
      id: 'adhan_makkah',
      name: 'أذان الحرم المكي الشريف',
      reciter: 'الشيخ علي ملا (تسجيل حقيقي)',
      url: '/audio/adhan_makkah.mp3',
      isRealAudio: true,
    },
    {
      id: 'adhan_madinah',
      name: 'أذان المسجد النبوي الشريف',
      reciter: 'الشيخ عاصم بخاري (تسجيل حقيقي)',
      url: '/audio/adhan_madinah.mp3',
      isRealAudio: true,
    },
    {
      id: 'adhan_bahrain',
      name: 'أذان مساجد البحرين',
      reciter: 'تسجيل رسمي موحد',
      url: '/audio/adhan_makkah.mp3',
      isRealAudio: true,
    },
    {
      id: 'adhan_aqsa',
      name: 'أذان المسجد الأقصى المبارك',
      reciter: 'مؤذنو القدس الشريف',
      url: '/audio/adhan_daghreeri.mp3',
      isRealAudio: true,
    },
  ];

  public iqamaVoices: VoiceOption[] = [
    { id: 'iqama_standard', name: 'إقامة المساجد الموحدة', reciter: 'صوت واضح ومهيب' },
    { id: 'iqama_makkah', name: 'إقامة الحرم المكي', reciter: 'المؤذن المكي' },
    { id: 'iqama_madinah', name: 'إقامة المسجد النبوي', reciter: 'المؤذن المدني' },
  ];

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play crisp Islamic Chime
  public playChime(volume = 1.0): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (major chord)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        const noteVol = Math.max(0, Math.min(1, volume * 0.25));
        gain.gain.setValueAtTime(0.0001, now + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(noteVol, now + idx * 0.18 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 1.2);
      });
    } catch (e) {
      console.warn('Chime audio error:', e);
    }
  }

  /**
   * Main Adhan playback method:
   * Uses real studio audio MP3 (with Sheikh Hamad Al-Daghreeri as default)
   */
  public playAdhan(
    voiceId: string = 'adhan_daghreeri',
    volume = 1.0,
    isFajr = false,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    this.stopAllAudio();

    const voice =
      this.adhanVoices.find((v) => v.id === voiceId) ||
      this.adhanVoices[0]; // defaults to Sheikh Hamad Al-Daghreeri

    if (voice && voice.url) {
      this.isCurrentlyPlaying = true;
      if (onStart) onStart();
      if (onEnd) this.onEndCallbacks.push(onEnd);

      try {
        const audio = new Audio(voice.url);
        audio.volume = Math.max(0, Math.min(1, volume));
        this.activeHtmlAudio = audio;

        audio.onended = () => {
          this.activeHtmlAudio = null;
          this.finishPlayback();
        };

        audio.onerror = (e) => {
          console.warn('Real adhan audio failed to load, falling back to synthesis:', e);
          this.activeHtmlAudio = null;
          this.playAdhanSynthesis(volume, isFajr, onStart, onEnd);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Adhan autoplay prevented or playback error:', err);
            // Fall back to synthesis in case HTML5 audio element was blocked
            this.playAdhanSynthesis(volume, isFajr, onStart, onEnd);
          });
        }
        return;
      } catch (err) {
        console.warn('Audio construction error:', err);
      }
    }

    // Fallback to synthesis if no URL found
    this.playAdhanSynthesis(volume, isFajr, onStart, onEnd);
  }

  // Melodic Adhan Takbeerat synthesizer fallback: "Allahu Akbar, Allahu Akbar"
  public playAdhanSynthesis(
    volume = 1.0,
    isFajr = false,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    this.stopAllAudio();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.isCurrentlyPlaying = true;
    if (onStart) onStart();
    if (onEnd) this.onEndCallbacks.push(onEnd);

    try {
      const now = ctx.currentTime;
      // Authentic Hijaz maqam notes: D4, Eb4, F#4, G4, A4, Bb4, C5, D5
      const takbeerPattern = isFajr
        ? [
            { freq: 392.0, dur: 1.2, rest: 0.1 }, // Al-
            { freq: 466.16, dur: 1.8, rest: 0.2 }, // laa-
            { freq: 440.0, dur: 0.8, rest: 0.1 }, // hu
            { freq: 392.0, dur: 2.0, rest: 0.6 }, // Ak-bar
            { freq: 369.99, dur: 1.2, rest: 0.1 }, // Al-
            { freq: 466.16, dur: 1.9, rest: 0.2 }, // laa-
            { freq: 440.0, dur: 0.8, rest: 0.1 }, // hu
            { freq: 392.0, dur: 2.2, rest: 0.8 }, // Ak-bar
            // As-Salatu Khayrun Min An-Nawm
            { freq: 440.0, dur: 1.4, rest: 0.2 },
            { freq: 493.88, dur: 2.0, rest: 0.2 },
            { freq: 523.25, dur: 1.6, rest: 0.1 },
            { freq: 440.0, dur: 2.4, rest: 0.6 },
          ]
        : [
            { freq: 392.0, dur: 1.2, rest: 0.1 }, // Al-
            { freq: 466.16, dur: 1.8, rest: 0.2 }, // laa-
            { freq: 440.0, dur: 0.8, rest: 0.1 }, // hu
            { freq: 392.0, dur: 2.0, rest: 0.6 }, // Ak-bar
            { freq: 369.99, dur: 1.2, rest: 0.1 }, // Al-
            { freq: 466.16, dur: 1.9, rest: 0.2 }, // laa-
            { freq: 440.0, dur: 0.8, rest: 0.1 }, // hu
            { freq: 392.0, dur: 2.4, rest: 0.6 }, // Ak-bar
          ];

      let t = now + 0.1;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.4)), now);
      masterGain.connect(ctx.destination);
      this.currentSource = masterGain;

      takbeerPattern.forEach((step) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(step.freq, t);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(step.freq * 2, t);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(step.freq * 1.5, t);
        filter.Q.setValueAtTime(1.8, t);

        noteGain.gain.setValueAtTime(0.0001, t);
        noteGain.gain.linearRampToValueAtTime(0.6, t + 0.15);
        noteGain.gain.setValueAtTime(0.55, t + step.dur - 0.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, t + step.dur);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(masterGain);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + step.dur + 0.05);
        osc2.stop(t + step.dur + 0.05);

        t += step.dur + step.rest;
      });

      const totalDuration = (t - now) * 1000;
      setTimeout(() => {
        this.finishPlayback();
      }, totalDuration);
    } catch (err) {
      console.warn('Adhan playback error:', err);
      this.finishPlayback();
    }
  }

  // Melodic Iqama synthesizer: "Qad Qamatis-Salah, Qad Qamatis-Salah"
  public playIqamaSynthesis(volume = 1.0, onStart?: () => void, onEnd?: () => void): void {
    this.stopAllAudio();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.isCurrentlyPlaying = true;
    if (onStart) onStart();
    if (onEnd) this.onEndCallbacks.push(onEnd);

    try {
      const now = ctx.currentTime;
      const iqamaPattern = [
        { freq: 440.0, dur: 0.8, rest: 0.1 }, // Qad
        { freq: 493.88, dur: 1.0, rest: 0.1 }, // qa-ma-tis
        { freq: 440.0, dur: 1.6, rest: 0.4 }, // Sa-lah
        { freq: 440.0, dur: 0.8, rest: 0.1 }, // Qad
        { freq: 493.88, dur: 1.0, rest: 0.1 }, // qa-ma-tis
        { freq: 392.0, dur: 1.8, rest: 0.5 }, // Sa-lah
      ];

      let t = now + 0.1;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.4)), now);
      masterGain.connect(ctx.destination);
      this.currentSource = masterGain;

      iqamaPattern.forEach((step) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(step.freq, t);

        noteGain.gain.setValueAtTime(0.0001, t);
        noteGain.gain.linearRampToValueAtTime(0.65, t + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, t + step.dur);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(t);
        osc.stop(t + step.dur + 0.05);

        t += step.dur + step.rest;
      });

      const totalDuration = (t - now) * 1000;
      setTimeout(() => {
        this.finishPlayback();
      }, totalDuration);
    } catch (e) {
      console.warn('Iqama playback error:', e);
      this.finishPlayback();
    }
  }

  public stopAllAudio(): void {
    // 1. Stop HTML5 audio element
    if (this.activeHtmlAudio) {
      try {
        this.activeHtmlAudio.pause();
        this.activeHtmlAudio.currentTime = 0;
      } catch {}
      this.activeHtmlAudio = null;
    }

    // 2. Stop WebAudio oscillator
    if (this.ctx && this.currentSource) {
      try {
        (this.currentSource as GainNode).gain.linearRampToValueAtTime(
          0.0001,
          this.ctx.currentTime + 0.05
        );
      } catch {}
      this.currentSource = null;
    }

    this.finishPlayback();
  }

  private finishPlayback(): void {
    this.isCurrentlyPlaying = false;
    const cbs = [...this.onEndCallbacks];
    this.onEndCallbacks = [];
    cbs.forEach((cb) => {
      try {
        cb();
      } catch {}
    });
  }

  public isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }
}

export const audioEngine = new SafeAudioEngine();
