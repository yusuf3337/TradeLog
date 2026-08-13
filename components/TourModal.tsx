"use client";

import { Target, ChevronRight } from 'lucide-react';
import { TRANSLATIONS, TOUR_STEPS } from '@/constants/translations';

interface TourModalProps {
  showTour: boolean;
  tourStep: number;
  lang: 'tr' | 'en';
  closeTour: () => void;
  nextTourStep: () => void;
}

export default function TourModal({
  showTour,
  tourStep,
  lang,
  closeTour,
  nextTourStep
}: TourModalProps) {
  if (!showTour) return null;

  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-bg-panel border border-border-main p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-border-main">
          <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${((tourStep + 1) / TOUR_STEPS[lang].length) * 100}%` }}></div>
        </div>

        <div className="flex justify-between items-center mb-6 mt-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-bg-input text-text-muted">
            {tourStep + 1} / {TOUR_STEPS[lang].length}
          </span>
        </div>

        <h2 className="text-2xl font-semibold text-text-main mb-3">{TOUR_STEPS[lang][tourStep].title}</h2>
        <p className="text-text-muted text-sm leading-relaxed mb-8">
          {TOUR_STEPS[lang][tourStep].desc}
        </p>

        <div className="flex items-center justify-between">
          <button onClick={closeTour} className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
            {t.skip}
          </button>

          <button onClick={nextTourStep} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
            {tourStep === TOUR_STEPS[lang].length - 1 ? t.finish : t.next}
            {tourStep !== TOUR_STEPS[lang].length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
