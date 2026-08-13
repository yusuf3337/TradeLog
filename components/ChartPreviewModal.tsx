"use client";

import { X, ExternalLink, ImageIcon } from 'lucide-react';
import { TRANSLATIONS } from '@/constants/translations';

interface ChartPreviewModalProps {
  imageUrl: string | null;
  closePreview: () => void;
  lang: 'tr' | 'en';
}

export default function ChartPreviewModal({
  imageUrl,
  closePreview,
  lang
}: ChartPreviewModalProps) {
  if (!imageUrl) return null;

  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-100 flex items-center justify-center p-4">
      <div className="bg-bg-panel border border-border-main rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 px-6 border-b border-border-main flex items-center justify-between bg-bg-app">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-text-main">{t.viewChart}</h3>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t.openInNewTab}</span>
            </a>
            <button onClick={closePreview} className="p-2 rounded-full hover:bg-bg-hover text-text-muted hover:text-text-main transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Preview Container */}
        <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-black/40">
          <img
            src={imageUrl}
            alt="TradingView Chart"
            className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-border-main shadow-lg"
          />
        </div>

      </div>
    </div>
  );
}
