'use client';

import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    variant = 'danger',
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: 'bg-red-100',
            text: 'text-red-600',
            button: 'bg-red-600 hover:bg-red-700',
        },
        warning: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-600',
            button: 'bg-yellow-600 hover:bg-yellow-700',
        },
        info: {
            bg: 'bg-blue-100',
            text: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700',
        },
    };

    const variantStyles = colors[variant];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${variantStyles.bg} ${variantStyles.text}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <div className="text-slate-500 mb-6 text-sm leading-relaxed">
                    {message}
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50 ${variantStyles.button}`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
