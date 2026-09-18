import React, { useState } from 'react';
import { Copy, Check, Download, Code, ExternalLink, X, FileCode2 } from 'lucide-react';

interface SingleHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlCode: string;
}

export const SingleHtmlModal: React.FC<SingleHtmlModalProps> = ({
  isOpen,
  onClose,
  htmlCode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prayer_times_app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewWindow = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(htmlCode);
      newWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md font-tajawal animate-fadeIn">
      <div className="bg-slate-900 border border-amber-400/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>كود التطبيق الموحد كملف HTML واحد</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  Single File (HTML + CSS + JS)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                يعمل مباشرة على أي متصفح، كمبيوتر، أو هاتف دون الحاجة لتثبيت أي برامج أو خوادم.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-950/40 border-b border-white/5">
          <div className="text-xs text-amber-200/80">
            يتضمن أذان الشيخ حمد الدقريري، الحساب الفلكي الدقيق، التاريخ الهجري، والساعة الرقمية.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer active:scale-95 ${
                copied
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم نسخ كود HTML بنجاح!' : 'نسخ كود HTML بالكامل'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-2 transition cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>تحميل كملف .html</span>
            </button>

            <button
              onClick={handleOpenNewWindow}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              title="فتح في نافذة مستقلة جديدة"
            >
              <ExternalLink className="w-4 h-4 text-blue-400" />
              <span>معاينة</span>
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 p-4 overflow-auto bg-slate-950 font-mono text-xs text-slate-300 select-text leading-relaxed">
          <pre className="whitespace-pre-wrap break-all select-all font-mono">
            {htmlCode}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div>
            طريقة الاستخدام: انسخ الكود، ثم احفظه في ملف باسم <code className="text-amber-300 font-bold bg-black/40 px-1.5 py-0.5 rounded">index.html</code> وافتحه بأي متصفح.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
