import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-amber-400 mb-2">
              حدث خطأ أثناء تحميل التطبيق
            </h2>
            <p className="text-stone-300 text-sm mb-4 leading-relaxed">
              يرجى إعادة تحميل الصفحة أو إعادة ضبط الإعدادات.
            </p>
            {this.state.error && (
              <pre className="text-xs bg-black/50 text-red-300 p-3 rounded-lg overflow-x-auto text-left mb-4 dir-ltr">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                إعادة التحميل
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch {}
                  window.location.reload();
                }}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                مسح الذاكرة المؤقتة
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
