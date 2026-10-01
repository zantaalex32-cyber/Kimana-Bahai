import React, { useState } from 'react';
import { X, Check, Copy, Share2, MessageSquare, Phone, Send, Sparkles, FileText, CheckCheck } from 'lucide-react';

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycleName: string;
  reportDate: string;
  executiveText: string;
  fullReportText: string;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  cycleName,
  reportDate,
  executiveText,
  fullReportText,
}) => {
  const [reportFormat, setReportFormat] = useState<'executive' | 'full'>('executive');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [includeCustomNote, setIncludeCustomNote] = useState(true);
  const [customNote, setCustomNote] = useState(
    `Alláh-u-Abhá dear Friends! Here is the Kimana Cluster Community Development Report for ${cycleName}.`
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the complete final text based on selected format and optional custom note
  const getCompiledText = () => {
    const baseText = reportFormat === 'executive' ? executiveText : fullReportText;
    if (includeCustomNote && customNote.trim()) {
      return `${customNote.trim()}\n\n${baseText}`;
    }
    return baseText;
  };

  const compiledText = getCompiledText();

  // Clean and format phone number for WhatsApp URL (Kenyan 07xx -> 2547xx)
  const getCleanPhone = () => {
    let clean = recipientPhone.replace(/[^\d+]/g, '');
    if (clean.startsWith('0')) {
      clean = '254' + clean.slice(1);
    } else if (clean.startsWith('+')) {
      clean = clean.slice(1);
    }
    return clean;
  };

  const cleanPhone = getCleanPhone();

  // Create WhatsApp URL
  const whatsAppUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(compiledText)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(compiledText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kimana Cluster Report - ${cycleName}`,
          text: compiledText,
        });
      } catch (err) {
        // User cancelled or share unhandled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-[#25D366]/10 dark:bg-[#25D366]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md">
              <WhatsAppIcon className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Share Report to WhatsApp
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#128C7E] dark:text-[#25D366] font-bold">
                  {cycleName}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Format and send standardized cluster report directly to WhatsApp groups, coordinators, or individuals.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            id="close-whatsapp-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm">
          
          {/* Format Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select WhatsApp Report Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setReportFormat('executive')}
                className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                  reportFormat === 'executive'
                    ? 'border-[#25D366] bg-[#25D366]/10 text-slate-900 dark:text-white ring-2 ring-[#25D366]/40'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`p-2 rounded-lg ${reportFormat === 'executive' ? 'bg-[#25D366] text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                    <span>Executive Summary</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                      Best for Groups
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Concise key totals, core activity stats, movement, and priority goals. Optimal chat size.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setReportFormat('full')}
                className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                  reportFormat === 'full'
                    ? 'border-[#25D366] bg-[#25D366]/10 text-slate-900 dark:text-white ring-2 ring-[#25D366]/40'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`p-2 rounded-lg ${reportFormat === 'full' ? 'bg-[#25D366] text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">Full 10-Section Report</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Complete itemized lists for all classes, JY groups, study circles, devotionals, and pioneers.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Custom Note Option */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeCustomNote}
                  onChange={(e) => setIncludeCustomNote(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Include Opening Greeting / Note</span>
              </label>
              <span className="text-[11px] text-slate-400">Added to top of message</span>
            </div>

            {includeCustomNote && (
              <textarea
                rows={2}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Type your greeting or introductory remark..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
            )}
          </div>

          {/* Recipient Phone (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Direct Recipient Phone (Optional):
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                <Phone className="w-3.5 h-3.5 mr-1" />
                <span className="font-semibold text-slate-500">🇰🇪</span>
              </div>
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="e.g. 0712345678 or +254 712 345678 (leave blank to select in WhatsApp)"
                className="w-full pl-14 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {cleanPhone ? (
                <span className="text-emerald-600 font-medium">Will open direct chat with +{cleanPhone}</span>
              ) : (
                'Leave blank to choose from your WhatsApp chats, groups, or status broadcast'
              )}
            </p>
          </div>

          {/* Live WhatsApp Chat Bubble Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                WhatsApp Chat Message Preview
              </label>
              <span className="text-[11px] text-slate-400">
                {compiledText.length} characters • Formatted with *bold* & _italics_
              </span>
            </div>

            <div className="rounded-2xl p-4 bg-[#e5ddd5] dark:bg-[#0b141a] border border-slate-200 dark:border-slate-800 shadow-inner">
              <div className="max-w-md ml-auto bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-900 dark:text-slate-100 rounded-2xl rounded-tr-none p-3.5 shadow-sm text-xs space-y-2 border border-emerald-200/50 dark:border-emerald-800/40">
                <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed max-h-56 overflow-y-auto pr-1 select-text">
                  {compiledText}
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 dark:text-emerald-200/70 pt-1 border-t border-emerald-200/40 dark:border-emerald-700/40">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition"
              id="copy-whatsapp-text-btn"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Message Text'}</span>
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Device Share</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>

            {/* Standard Anchor Link: Safe in iFrames without window.open restrictions */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition transform active:scale-95"
              id="launch-whatsapp-btn"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Open in WhatsApp</span>
              <Send className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
