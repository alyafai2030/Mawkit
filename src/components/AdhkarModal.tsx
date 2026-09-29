import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  X,
  Sun,
  Moon,
  CheckCircle2,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Share2,
  ZoomIn,
  ZoomOut,
  Smartphone,
  Search,
  Flame,
  Award,
  ChevronLeft,
  ChevronRight,
  List,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Settings2,
  CheckCheck,
  RefreshCw,
} from 'lucide-react';
import {
  DhikrItem,
  MORNING_ADHKAR,
  EVENING_ADHKAR,
  POST_PRAYER_ADHKAR,
  TASBEEH_PRESETS,
  TasbeehPreset,
} from '../data/adhkarData';
import { audioEngine } from '../utils/audioEngine';
import { formatDigits } from '../utils/astronomicalPrayer';

interface AdhkarModalProps {
  isOpen: boolean;
  initialTab?: 'morning' | 'evening' | 'post_prayer' | 'tasbeeh';
  useArabicDigits?: boolean;
  onClose: () => void;
}

type TabType = 'morning' | 'evening' | 'post_prayer' | 'tasbeeh';
type ViewMode = 'card' | 'list';

const STORAGE_KEY = 'PRAYER_APP_ADHKAR_STATE_V1';

export const AdhkarModal: React.FC<AdhkarModalProps> = ({
  isOpen,
  initialTab,
  useArabicDigits = false,
  onClose,
}) => {
  // Determine smart default tab based on hour if not specified
  const defaultTab = useMemo<TabType>(() => {
    if (initialTab) return initialTab;
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 15) return 'morning';
    return 'evening';
  }, [initialTab]);

  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [viewMode, setViewMode] = useState<ViewMode>('card'); // Default to iPhone Card mode
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isIndexDrawerOpen, setIsIndexDrawerOpen] = useState(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Settings
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Counters dictionary: dhikrId -> current count done
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const today = new Date().toDateString();
        if (parsed.date === today && parsed.counts) {
          return parsed.counts;
        }
      }
    } catch {}
    return {};
  });

  // Free Tasbeeh state
  const [selectedTasbeehPreset, setSelectedTasbeehPreset] = useState<TasbeehPreset>(
    TASBEEH_PRESETS[0]
  );
  const [tasbeehTarget, setTasbeehTarget] = useState<number>(33);
  const [tasbeehCount, setTasbeehCount] = useState<number>(0);
  const [totalDailyTasbeeh, setTotalDailyTasbeeh] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = localStorage.getItem('PRAYER_APP_DAILY_TASBEEH_TOTAL');
      if (saved) return parseInt(saved, 10) || 0;
    } catch {}
    return 0;
  });

  // Touch gesture state for iPhone swipe transitions
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const [touchTranslateX, setTouchTranslateX] = useState<number>(0);

  // Active list of adhkar items
  const currentList: DhikrItem[] = useMemo(() => {
    if (activeTab === 'morning') return MORNING_ADHKAR;
    if (activeTab === 'evening') return EVENING_ADHKAR;
    if (activeTab === 'post_prayer') return POST_PRAYER_ADHKAR;
    return [];
  }, [activeTab]);

  // Ensure currentIndex stays within bounds when list changes
  useEffect(() => {
    setCurrentIndex(0);
    setShowCelebration(false);
  }, [activeTab]);

  // Update active tab if initialTab changes from parent
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      setCurrentIndex(0);
      setShowCelebration(false);
    }
  }, [initialTab]);

  // Save counts to LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const payload = {
        date: new Date().toDateString(),
        counts,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [counts]);

  // Save daily tasbeeh total
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('PRAYER_APP_DAILY_TASBEEH_TOTAL', String(totalDailyTasbeeh));
    } catch {}
  }, [totalDailyTasbeeh]);

  // Stop TTS speech on unmount or tab switch
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeTab, currentIndex]);

  // Progress metrics for current list
  const totalItems = currentList.length;
  const completedItems = useMemo(() => {
    return currentList.filter((item) => (counts[item.id] || 0) >= item.count).length;
  }, [currentList, counts]);

  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const isAllCompleted = totalItems > 0 && completedItems === totalItems;

  // Haptic feedback helper
  const triggerHaptic = useCallback(
    (type: 'light' | 'medium' | 'success' = 'light') => {
      if (!vibrationEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
      try {
        if (type === 'light') {
          navigator.vibrate(15);
        } else if (type === 'medium') {
          navigator.vibrate(30);
        } else {
          navigator.vibrate([35, 60, 35]);
        }
      } catch {}
    },
    [vibrationEnabled]
  );

  // Transition to Next Dhikr
  const handleNextDhikr = useCallback(() => {
    if (isAnimating || currentList.length === 0) return;
    if (currentIndex < currentList.length - 1) {
      setSlideDirection('next');
      setIsAnimating(true);
      if (soundEnabled) audioEngine.playSwipe(0.25);
      triggerHaptic('light');

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSlideDirection(null);
        setIsAnimating(false);
      }, 180);
    } else {
      // Reached the end
      if (completedItems >= totalItems) {
        setShowCelebration(true);
      }
    }
  }, [currentIndex, currentList.length, isAnimating, completedItems, totalItems, soundEnabled, triggerHaptic]);

  // Transition to Previous Dhikr
  const handlePrevDhikr = useCallback(() => {
    if (isAnimating || currentList.length === 0) return;
    if (currentIndex > 0) {
      setSlideDirection('prev');
      setIsAnimating(true);
      if (soundEnabled) audioEngine.playSwipe(0.25);
      triggerHaptic('light');

      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setSlideDirection(null);
        setIsAnimating(false);
      }, 180);
    }
  }, [currentIndex, currentList.length, isAnimating, soundEnabled, triggerHaptic]);

  // Jump directly to specific dhikr index
  const handleJumpToIndex = (index: number) => {
    if (index >= 0 && index < currentList.length) {
      setCurrentIndex(index);
      setIsIndexDrawerOpen(false);
      setShowCelebration(false);
      triggerHaptic('light');
    }
  };

  // Tap-to-count Dhikr interaction
  const handleCountDhikr = (item: DhikrItem, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      // Prevent double firing if clicking button inside clickable card
      e.stopPropagation();
    }

    const current = counts[item.id] || 0;
    if (current >= item.count) {
      // Already finished: allow tapping to manually advance to next
      if (autoAdvance && currentIndex < currentList.length - 1) {
        handleNextDhikr();
      }
      return;
    }

    const next = current + 1;
    setCounts((prev) => ({ ...prev, [item.id]: next }));
    setTotalDailyTasbeeh((prev) => prev + 1);

    const isNowFinished = next >= item.count;

    if (soundEnabled) {
      if (isNowFinished) {
        audioEngine.playTasbeehFinish(0.75);
      } else {
        audioEngine.playTasbeehClick(0.45);
      }
    }

    triggerHaptic(isNowFinished ? 'success' : 'light');

    // Auto-advance to next Dhikr if enabled!
    if (isNowFinished && autoAdvance) {
      setTimeout(() => {
        if (currentIndex < currentList.length - 1) {
          handleNextDhikr();
        } else {
          // Final dhikr completed: show celebration!
          setShowCelebration(true);
        }
      }, 360);
    }
  };

  // Reset current dhikr count
  const handleResetCurrent = (item: DhikrItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCounts((prev) => {
      const updated = { ...prev };
      delete updated[item.id];
      return updated;
    });
    triggerHaptic('light');
  };

  // Reset all dhikr in current tab
  const handleResetAllTab = () => {
    if (!confirm('هل تريد تصفير عداد جميع أذكار هذه القائمة؟')) return;
    const idsToClear = new Set(currentList.map((i) => i.id));
    setCounts((prev) => {
      const updated = { ...prev };
      idsToClear.forEach((id) => delete updated[id]);
      return updated;
    });
    setCurrentIndex(0);
    setShowCelebration(false);
    triggerHaptic('light');
  };

  // Copy Dhikr text to clipboard
  const handleCopyDhikr = (item: DhikrItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const content = `${item.title}\n\n${item.text}\n\n(التكرار: ${item.count} مرة)${
      item.virtue ? `\nالفضل: ${item.virtue}` : ''
    }`;
    navigator.clipboard.writeText(content).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2200);
      triggerHaptic('light');
    });
  };

  // Share via Web Share API
  const handleShareDhikr = async (item: DhikrItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `${item.title}\n\n${item.text}\n\n(التكرار: ${item.count} مرة)${
      item.virtue ? `\nالفضل: ${item.virtue}` : ''
    }`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: text,
        });
      } catch {}
    } else {
      handleCopyDhikr(item);
    }
  };

  // Read aloud TTS
  const handleToggleSpeak = (item: DhikrItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('ميزة القراءة الصوتية غير مدعومة في متصفحك.');
      return;
    }

    if (speakingId === item.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = item.text.replace(/[﴿﴾۝]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.88;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) utterance.voice = arabicVoice;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(item.id);
    window.speechSynthesis.speak(utterance);
  };

  // Touch Swipe handlers for iPhone gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      touchDeltaXRef.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartXRef.current;
    const deltaY = currentY - touchStartYRef.current;

    // Only apply horizontal swipe if horizontal movement is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      touchDeltaXRef.current = deltaX;
      // Provide subtle live spring resistance
      const clampedDelta = Math.max(-120, Math.min(120, deltaX));
      setTouchTranslateX(clampedDelta * 0.4);
    }
  };

  const handleTouchEnd = () => {
    const delta = touchDeltaXRef.current;
    setTouchTranslateX(0);

    // In RTL (Arabic):
    // Swiping right-to-left (delta < -45px): Go to NEXT Dhikr
    // Swiping left-to-right (delta > 45px): Go to PREVIOUS Dhikr
    if (delta < -45) {
      handleNextDhikr();
    } else if (delta > 45) {
      handlePrevDhikr();
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchDeltaXRef.current = 0;
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Spacebar counts current dhikr
      if (e.code === 'Space') {
        e.preventDefault();
        if (activeTab === 'tasbeeh') {
          handleTasbeehClick();
        } else if (currentList[currentIndex]) {
          handleCountDhikr(currentList[currentIndex]);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextDhikr();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevDhikr();
      } else if (e.key === 'Escape') {
        if (isIndexDrawerOpen) {
          setIsIndexDrawerOpen(false);
        } else if (isSettingsDrawerOpen) {
          setIsSettingsDrawerOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    activeTab,
    currentIndex,
    currentList,
    handleNextDhikr,
    handlePrevDhikr,
    isIndexDrawerOpen,
    isSettingsDrawerOpen,
    onClose,
  ]);

  // Tasbeeh methods
  const handleTasbeehClick = () => {
    const next = tasbeehCount + 1;
    setTasbeehCount(next);
    setTotalDailyTasbeeh((prev) => prev + 1);

    if (tasbeehTarget > 0 && next % tasbeehTarget === 0) {
      if (soundEnabled) audioEngine.playTasbeehFinish(0.75);
      triggerHaptic('success');
    } else {
      if (soundEnabled) audioEngine.playTasbeehClick(0.45);
      triggerHaptic('light');
    }
  };

  const handleResetTasbeeh = () => {
    setTasbeehCount(0);
    triggerHaptic('light');
  };

  // Text size classes
  const getTextSizeClass = () => {
    if (fontSize === 'normal') return 'text-lg sm:text-xl leading-relaxed sm:leading-loose';
    if (fontSize === 'xlarge') return 'text-2xl sm:text-3xl leading-loose';
    return 'text-xl sm:text-2xl leading-relaxed sm:leading-loose'; // large
  };

  // Filtered list for list mode / index
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return currentList;
    const q = searchQuery.trim().toLowerCase();
    return currentList.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.text.toLowerCase().includes(q) ||
        (item.virtue && item.virtue.toLowerCase().includes(q))
    );
  }, [currentList, searchQuery]);

  if (!isOpen) return null;

  const currentDhikr = currentList[currentIndex];
  const currentCount = currentDhikr ? counts[currentDhikr.id] || 0 : 0;
  const isCurrentCompleted = currentDhikr ? currentCount >= currentDhikr.count : false;
  const currentRemaining = currentDhikr ? Math.max(0, currentDhikr.count - currentCount) : 0;
  const currentProgressPercent = currentDhikr
    ? Math.min(100, Math.round((currentCount / currentDhikr.count) * 100))
    : 0;

  return (
    <div
      id="modal-adhkar-ios"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col justify-end sm:justify-center sm:items-center sm:p-4 select-none font-tajawal animate-fadeIn overflow-hidden"
      onClick={onClose}
    >
      {/* Toast Notification */}
      {copiedToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600/95 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400/50 animate-bounce">
          <Check className="w-4 h-4" />
          <span>تم نسخ نص الذكر بنجاح</span>
        </div>
      )}

      {/* Main Container - Full height on iPhone/Mobile, rounded card on tablet/desktop */}
      <div
        className="w-full sm:max-w-xl md:max-w-2xl h-[94vh] sm:h-[88vh] max-h-[920px] bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#040711] border border-amber-400/30 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Pull / Drag Handle for Mobile */}
        <div className="sm:hidden w-full pt-2.5 pb-1 flex justify-center bg-black/40">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* 1. iOS Top Navigation Bar */}
        <div className="relative px-4 sm:px-6 pt-2 pb-2.5 bg-black/50 border-b border-white/10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            {/* Left: View Mode Toggle & Index Drawer button */}
            <div className="flex items-center gap-1.5">
              {activeTab !== 'tasbeeh' && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsIndexDrawerOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-200 transition-all cursor-pointer"
                    title="فهرس أذكار القائمة"
                  >
                    <List className="w-4 h-4 text-amber-300" />
                    <span className="hidden sm:inline">الفهرس</span>
                    <span className="font-numbers text-xs font-bold text-amber-300">
                      ({formatDigits(currentIndex + 1, useArabicDigits)}/
                      {formatDigits(totalItems, useArabicDigits)})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode((prev) => (prev === 'card' ? 'list' : 'card'))}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                      viewMode === 'card'
                        ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                    title={viewMode === 'card' ? 'التبديل إلى عرض القائمة' : 'التبديل إلى بطاقات اللمس'}
                  >
                    {viewMode === 'card' ? (
                      <Layers className="w-4 h-4" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Center: Title / Header */}
            <div className="text-center">
              <h2 className="text-base sm:text-lg font-bold font-amiri text-[#fae084] flex items-center justify-center gap-1.5">
                <span>
                  {activeTab === 'morning'
                    ? 'أذكار الصباح'
                    : activeTab === 'evening'
                    ? 'أذكار المساء'
                    : activeTab === 'post_prayer'
                    ? 'أذكار بعد الصلاة'
                    : 'السبحة الإلكترونية'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              </h2>
            </div>

            {/* Right: Settings and Done ("تم") Button */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsSettingsDrawerOpen((prev) => !prev)}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                  isSettingsDrawerOpen
                    ? 'bg-amber-400/25 border-amber-400/50 text-amber-300'
                    : 'bg-white/5 hover:bg-white/15 border-white/10 text-slate-300'
                }`}
                title="إعدادات القراءة واللمس"
              >
                <Settings2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                title="تم (إغلاق)"
              >
                تم
              </button>
            </div>
          </div>

          {/* iOS Category Segmented Control */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-black/60 border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('morning')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'morning'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 shrink-0 text-amber-200" />
              <span className="truncate">الصباح</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('evening')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'evening'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 shrink-0 text-indigo-300" />
              <span className="truncate">المساء</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('post_prayer')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'post_prayer'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
              <span className="truncate">بعد الصلاة</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tasbeeh')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'tasbeeh'
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 shrink-0 text-cyan-300" />
              <span className="truncate">السبحة</span>
            </button>
          </div>

          {/* Segmented iOS Story Progress Bar (Card Mode) */}
          {activeTab !== 'tasbeeh' && viewMode === 'card' && totalItems > 0 && (
            <div className="flex items-center gap-1 pt-0.5">
              {currentList.map((item, idx) => {
                const isItemDone = (counts[item.id] || 0) >= item.count;
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleJumpToIndex(idx)}
                    className="flex-1 h-1.5 rounded-full transition-all cursor-pointer overflow-hidden focus:outline-none"
                    title={`${item.title} (${idx + 1}/${totalItems})`}
                  >
                    <div
                      className={`h-full w-full rounded-full transition-all duration-300 ${
                        isItemDone
                          ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                          : isCurrent
                          ? 'bg-amber-400 shadow-sm shadow-amber-400/50 animate-pulse'
                          : 'bg-white/15 hover:bg-white/30'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Settings Drawer Dropdown (Collapsible) */}
        {isSettingsDrawerOpen && (
          <div className="px-4 py-3 bg-black/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs z-30 animate-fadeIn">
            {/* Font Size */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">حجم الخط:</span>
              <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/15">
                <button
                  type="button"
                  onClick={() =>
                    setFontSize((prev) =>
                      prev === 'xlarge' ? 'large' : prev === 'large' ? 'normal' : 'normal'
                    )
                  }
                  className="px-2 py-0.5 text-slate-300 hover:text-white cursor-pointer"
                  title="تصغير"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1 text-amber-300 font-bold">
                  {fontSize === 'normal' ? 'عادي' : fontSize === 'large' ? 'كبير' : 'كبير جداً'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFontSize((prev) =>
                      prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'xlarge'
                    )
                  }
                  className="px-2 py-0.5 text-slate-300 hover:text-white cursor-pointer"
                  title="تكبير"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Auto Advance Toggle */}
            <button
              type="button"
              onClick={() => setAutoAdvance(!autoAdvance)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                autoAdvance
                  ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
              title="الانتقال التلقائي للذكر التالي عند إكمال العد"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>انتقال تلقائي باللمس: {autoAdvance ? 'مفعل' : 'معطل'}</span>
            </button>

            {/* Sound & Vibration */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  soundEnabled
                    ? 'bg-amber-400/20 border-amber-400/30 text-amber-300'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
                title="صوت النقر"
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setVibrationEnabled(!vibrationEnabled)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  vibrationEnabled
                    ? 'bg-emerald-400/20 border-emerald-400/30 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
                title="اهتزاز اللمس"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleResetAllTab}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-all cursor-pointer"
                title="تصفير جميع عدادات هذه القائمة"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 2. BODY CONTENT: Either Card Mode (iPhone Touch) or List Mode or Free Tasbeeh */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {/* TAB: FREE TASBEEH */}
          {activeTab === 'tasbeeh' ? (
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col items-center justify-between">
              {/* Presets Chips */}
              <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {TASBEEH_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedTasbeehPreset(p);
                      setTasbeehTarget(p.target);
                      setTasbeehCount(0);
                    }}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-amiri font-bold border transition-all cursor-pointer ${
                      selectedTasbeehPreset.id === p.id
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20 scale-105'
                        : 'bg-black/40 hover:bg-black/60 border-white/15 text-slate-200'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Selected Dhikr Display */}
              <div className="w-full p-4 rounded-2xl bg-black/40 border border-amber-400/20 text-center my-2 shadow-inner">
                <h3 className="text-xl sm:text-2xl font-bold font-amiri text-amber-200 mb-1 leading-relaxed">
                  {selectedTasbeehPreset.text}
                </h3>
                {selectedTasbeehPreset.virtue && (
                  <p className="text-xs text-amber-300/80 font-tajawal">
                    ✨ {selectedTasbeehPreset.virtue}
                  </p>
                )}
              </div>

              {/* Target Selector */}
              <div className="flex items-center gap-2 my-1 text-xs font-bold">
                <span className="text-slate-400">الهدف:</span>
                {[33, 100, 1000, 0].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTasbeehTarget(t)}
                    className={`px-3 py-1 rounded-lg border font-numbers transition-all cursor-pointer ${
                      tasbeehTarget === t
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t === 0 ? 'مفتوح' : formatDigits(t, useArabicDigits)}
                  </button>
                ))}
              </div>

              {/* Huge Tactile iPhone Tasbeeh Button */}
              <div className="relative my-4 flex items-center justify-center">
                <div
                  className="w-56 h-56 sm:w-64 sm:h-64 rounded-full p-2 relative flex items-center justify-center cursor-pointer transition-transform active:scale-95 select-none"
                  onClick={handleTasbeehClick}
                >
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      className="text-white/10 stroke-current"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    {tasbeehTarget > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        className="text-amber-400 stroke-current transition-all duration-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                        strokeWidth="6"
                        strokeDasharray={276.46}
                        strokeDashoffset={
                          276.46 -
                          (276.46 *
                            Math.min(tasbeehTarget, tasbeehCount % (tasbeehTarget || 1))) /
                            tasbeehTarget
                        }
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    )}
                  </svg>

                  <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#1b263b] via-[#0d1424] to-[#1e293b] border-2 border-amber-400/40 flex flex-col items-center justify-center shadow-[inset_0_4px_16px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,0,0,0.5)]">
                    <span className="text-xs text-amber-300/80 font-tajawal mb-1">
                      المس للتسبيح
                    </span>
                    <span className="font-numbers text-5xl sm:text-6xl font-black text-white tracking-wider tabular-nums drop-shadow-md">
                      {formatDigits(tasbeehCount, useArabicDigits)}
                    </span>
                    {tasbeehTarget > 0 && (
                      <span className="text-xs text-slate-400 font-numbers mt-1">
                        الهدف: {formatDigits(tasbeehTarget, useArabicDigits)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Lower Controls & Stats */}
              <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/30 border border-white/10 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>
                    إجمالي تسابيح اليوم:{' '}
                    <strong className="text-amber-300 font-numbers text-sm">
                      {formatDigits(totalDailyTasbeeh, useArabicDigits)}
                    </strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleResetTasbeeh}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 text-slate-300 hover:text-rose-300 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>تصفير العداد</span>
                </button>
              </div>
            </div>
          ) : viewMode === 'list' ? (
            /* TAB: FULL LIST VIEW MODE */
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-amber-500/20">
              {/* Search Bar */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="بحث في الأذكار..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 focus:bg-white/15 border border-white/15 focus:border-amber-400/50 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 outline-none pr-9"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>

              {filteredList.map((item, idx) => {
                const count = counts[item.id] || 0;
                const isDone = count >= item.count;
                const rem = Math.max(0, item.count - count);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleCountDhikr(item)}
                    className={`rounded-2xl p-4 transition-all duration-200 border cursor-pointer ${
                      isDone
                        ? 'bg-emerald-950/25 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                        : 'bg-black/35 hover:bg-black/50 border-white/10 hover:border-amber-400/40'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center text-xs font-bold font-numbers">
                          {formatDigits(idx + 1, useArabicDigits)}
                        </span>
                        <h3 className="font-amiri font-bold text-base text-amber-200">
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleToggleSpeak(item, e)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            speakingId === item.id
                              ? 'bg-amber-400 text-black border-amber-400 animate-pulse'
                              : 'bg-white/5 border-white/10 text-slate-300'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleCopyDhikr(item, e)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p
                      className={`font-amiri text-white whitespace-pre-line tracking-wide select-text ${getTextSizeClass()}`}
                    >
                      {item.text}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {isDone ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            اكتمل بحمد الله
                          </span>
                        ) : (
                          <span>
                            المتبقي:{' '}
                            <strong className="text-amber-300 font-numbers">
                              {formatDigits(rem, useArabicDigits)}
                            </strong>
                          </span>
                        )}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleCountDhikr(item, e)}
                        className={`px-3 py-1.5 rounded-xl font-bold font-numbers text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                        }`}
                      >
                        {formatDigits(count, useArabicDigits)} /{' '}
                        {formatDigits(item.count, useArabicDigits)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : showCelebration || (isAllCompleted && currentIndex >= currentList.length - 1 && isCurrentCompleted) ? (
            /* CELEBRATION VIEW */
            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-center text-center animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400/30 to-emerald-400/20 border-2 border-amber-400 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-amber-300" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-amiri text-amber-200 mb-2">
                هنيئاً لك! أتممت الأذكار بحمد الله
              </h3>

              <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                ﴿ الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾
              </p>

              <div className="w-full max-w-sm bg-black/40 border border-amber-400/20 rounded-2xl p-4 mb-6 text-xs text-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span>الأذكار المنجزة:</span>
                  <span className="font-bold text-amber-300 font-numbers">
                    {formatDigits(completedItems, useArabicDigits)} من{' '}
                    {formatDigits(totalItems, useArabicDigits)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>نسبة الإتمام:</span>
                  <span className="font-bold text-emerald-400 font-numbers">100%</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
                <button
                  type="button"
                  onClick={() => {
                    handleResetAllTab();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>إعادة قراءة الأذكار</span>
                </button>

                {activeTab === 'morning' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('evening');
                      setCurrentIndex(0);
                      setShowCelebration(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Moon className="w-4 h-4 text-indigo-300" />
                    <span>الانتقال لأذكار المساء</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('tasbeeh');
                      setShowCelebration(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>السبحة الإلكترونية</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* TAB: IPHONE TOUCH CARD VIEW (DEFAULT HERO MODE) */
            <div
              className="flex-1 flex flex-col justify-between overflow-hidden relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {currentDhikr && (
                <div
                  className={`flex-1 flex flex-col justify-between px-4 sm:px-8 py-3 transition-transform duration-200 ease-out ${
                    slideDirection === 'next'
                      ? '-translate-x-full opacity-0'
                      : slideDirection === 'prev'
                      ? 'translate-x-full opacity-0'
                      : 'translate-x-0 opacity-100'
                  }`}
                  style={{
                    transform:
                      touchTranslateX !== 0 ? `translateX(${touchTranslateX}px)` : undefined,
                  }}
                >
                  {/* Dhikr Card Top Header: Title & Badges */}
                  <div className="flex items-center justify-between pt-1 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold font-numbers flex items-center gap-1">
                        <span>الذكر</span>
                        <span>{formatDigits(currentIndex + 1, useArabicDigits)}</span>
                        <span>من</span>
                        <span>{formatDigits(totalItems, useArabicDigits)}</span>
                      </span>

                      <h3 className="font-amiri font-bold text-lg sm:text-xl text-amber-200 line-clamp-1">
                        {currentDhikr.title}
                      </h3>
                    </div>

                    {/* Quick Dhikr Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleToggleSpeak(currentDhikr, e)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          speakingId === currentDhikr.id
                            ? 'bg-amber-400 text-black border-amber-400 animate-pulse'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                        }`}
                        title="استماع صوتي للذكر"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleShareDhikr(currentDhikr, e)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="مشاركة أو نسخ الذكر"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {currentCount > 0 && (
                        <button
                          type="button"
                          onClick={(e) => handleResetCurrent(currentDhikr, e)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-rose-400 transition-all cursor-pointer"
                          title="تصفير عداد هذا الذكر"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Scrollable Center: Arabic Supplication Text & Fadl */}
                  <div
                    className="flex-1 overflow-y-auto my-2 py-2 pr-1 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent flex flex-col justify-center cursor-pointer active:opacity-95"
                    onClick={() => handleCountDhikr(currentDhikr)}
                    title="المس الشاشة في أي مكان للعد"
                  >
                    <div className="bg-black/25 rounded-2xl p-4 sm:p-6 border border-white/5 hover:border-amber-400/30 transition-all shadow-inner">
                      <p
                        className={`font-amiri text-white whitespace-pre-line text-center tracking-wide leading-relaxed select-text ${getTextSizeClass()}`}
                      >
                        {currentDhikr.text}
                      </p>

                      {/* Virtue / Hadith Source Badge */}
                      {(currentDhikr.virtue || currentDhikr.reward) && (
                        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 text-xs">
                          {currentDhikr.virtue && (
                            <div className="flex items-center gap-1 text-amber-200/90 bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/20">
                              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{currentDhikr.virtue}</span>
                            </div>
                          )}
                          {currentDhikr.reward && (
                            <div className="flex items-center gap-1 text-emerald-200/90 bg-emerald-400/10 px-3 py-1 rounded-xl border border-emerald-400/20">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{currentDhikr.reward}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Touch Hint */}
                    <div className="text-center mt-1.5 text-[11px] text-slate-400 flex items-center justify-center gap-1">
                      <Smartphone className="w-3 h-3 text-amber-400/70" />
                      <span>المس الشاشة في أي مكان للعد والانتقال • أو اسحب يميناً ويساراً</span>
                    </div>
                  </div>

                  {/* 3. Hero Touch Counter (iPhone Style Circle/Pill) */}
                  <div className="py-2 flex flex-col items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => handleCountDhikr(currentDhikr, e)}
                      className={`relative w-44 h-16 sm:w-52 sm:h-20 rounded-2xl sm:rounded-3xl border-2 flex items-center justify-center transition-all duration-150 active:scale-95 shadow-xl cursor-pointer overflow-hidden ${
                        isCurrentCompleted
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-700 border-emerald-400 shadow-emerald-500/30'
                          : 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 border-amber-300 text-slate-950 shadow-amber-500/30 hover:brightness-105'
                      }`}
                    >
                      {/* Linear fill background progress */}
                      <div
                        className="absolute inset-y-0 right-0 bg-white/20 transition-all duration-200 pointer-events-none"
                        style={{ width: `${currentProgressPercent}%` }}
                      />

                      {/* Content */}
                      <div className="relative z-10 flex items-center gap-3">
                        {isCurrentCompleted ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                              <Check className="w-5 h-5" />
                            </div>
                            <div className="text-right text-white">
                              <div className="text-xs font-bold font-tajawal">اكتمل الذكر</div>
                              <div className="text-sm font-black font-numbers">
                                {formatDigits(currentDhikr.count, useArabicDigits)} /{' '}
                                {formatDigits(currentDhikr.count, useArabicDigits)}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Circular miniature badge */}
                            <div className="w-10 h-10 rounded-full bg-black/30 border border-black/20 flex items-center justify-center text-white font-numbers font-black text-xl">
                              {formatDigits(currentRemaining, useArabicDigits)}
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-black/80 font-tajawal">
                                المتبقي: {formatDigits(currentRemaining, useArabicDigits)} مرات
                              </div>
                              <div className="text-sm font-extrabold text-black font-numbers">
                                {formatDigits(currentCount, useArabicDigits)} /{' '}
                                {formatDigits(currentDhikr.count, useArabicDigits)} (المس للعد)
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. iOS Bottom Navigation Bar (Previous, Index, Next) */}
        {activeTab !== 'tasbeeh' && viewMode === 'card' && (
          <div className="px-4 sm:px-6 py-2.5 bg-black/60 border-t border-white/10 flex items-center justify-between text-xs">
            {/* Previous Button (< السابق) */}
            <button
              type="button"
              onClick={handlePrevDhikr}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer font-bold ${
                currentIndex === 0
                  ? 'opacity-30 border-white/5 cursor-not-allowed text-slate-500'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white active:scale-95'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            {/* Quick Index Drawer Button */}
            <button
              type="button"
              onClick={() => setIsIndexDrawerOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold font-numbers active:scale-95 cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
              <span>
                {formatDigits(currentIndex + 1, useArabicDigits)} /{' '}
                {formatDigits(totalItems, useArabicDigits)}
              </span>
            </button>

            {/* Next Button (التالي >) */}
            <button
              type="button"
              onClick={handleNextDhikr}
              disabled={currentIndex >= totalItems - 1 && isCurrentCompleted}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer font-bold ${
                currentIndex >= totalItems - 1 && isCurrentCompleted
                  ? 'bg-emerald-600/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-gradient-to-r from-amber-500/90 to-amber-600/90 border-amber-400/50 text-slate-950 shadow-md active:scale-95'
              }`}
            >
              <span>{currentIndex >= totalItems - 1 ? 'إنهاء' : 'التالي'}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 5. Slide-up Index Drawer Sheet (فهرس الأذكار السريع) */}
        {isIndexDrawerOpen && (
          <div
            className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fadeIn"
            onClick={() => setIsIndexDrawerOpen(false)}
          >
            <div
              className="w-full bg-[#0d1424] border-t border-amber-400/30 rounded-t-3xl max-h-[80%] flex flex-col p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <List className="w-5 h-5 text-amber-300" />
                  <h3 className="font-bold text-base font-amiri text-amber-200">
                    فهرس الأذكار ({formatDigits(completedItems, useArabicDigits)} /{' '}
                    {formatDigits(totalItems, useArabicDigits)})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsIndexDrawerOpen(false)}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Items List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-1.5 scrollbar-thin scrollbar-thumb-amber-500/20">
                {currentList.map((item, idx) => {
                  const count = counts[item.id] || 0;
                  const isDone = count >= item.count;
                  const isCurrent = idx === currentIndex;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleJumpToIndex(idx)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold'
                          : isDone
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-black/40 border border-white/15 flex items-center justify-center text-xs font-numbers shrink-0">
                          {formatDigits(idx + 1, useArabicDigits)}
                        </span>
                        <span className="truncate text-sm font-amiri">{item.title}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span className="text-xs font-numbers text-slate-400">
                            {formatDigits(count, useArabicDigits)} /{' '}
                            {formatDigits(item.count, useArabicDigits)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleResetAllTab}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>تصفير الكل</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsIndexDrawerOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
