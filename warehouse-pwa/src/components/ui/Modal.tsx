import { ReactNode, useEffect } from 'react';
import { Icon } from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'wide';
  footer?: ReactNode;
  maxContentHeight?: string; // e.g., 'max-h-[60vh]'
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl',
  wide: 'max-w-6xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  footer,
  maxContentHeight,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-black/50"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div
          className={`inline-block w-full ${sizeClasses[size]} my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-xl shadow-2xl border border-slate-200`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              {subtitle && (
                <p className="text-sm text-slate-500 mt-0.5 whitespace-pre-line">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Icon name="close" size="md" />
            </button>
          </div>

          {/* Content */}
          <div className={`px-6 py-4 ${maxContentHeight ? `${maxContentHeight} overflow-y-auto` : ''}`}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
