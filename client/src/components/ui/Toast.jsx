import React, { useEffect, useState } from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';

const icons = {
    success: <CheckCircle className="w-5 h-5 text-primary" />,
    info: <Info className="w-5 h-5 text-cta" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
};

const bgColors = {
    success: 'bg-white border-l-4 border-l-primary',
    info: 'bg-white border-l-4 border-l-cta',
    warning: 'bg-white border-l-4 border-l-yellow-500',
    error: 'bg-white border-l-4 border-l-red-500',
};

const ToastItem = ({ id, type = 'info', title, message, duration = 4000, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(id);
        }, 300); // Match exit animation duration
    };

    return (
        <div
            className={`
        pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-lg shadow-soft ring-1 ring-black ring-opacity-5 
        ${bgColors[type]} 
        ${isExiting ? 'animate-fade-out opacity-0 translate-y-2' : 'animate-slide-up-fade'}
        transform transition-all duration-300 ease-out
      `}
            role="alert"
        >
            <div className="p-4 w-full">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {icons[type]}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        {title && <p className="text-sm font-medium text-text-primary">{title}</p>}
                        <p className={`text-sm text-text-secondary ${title ? 'mt-1' : ''}`}>{message}</p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                        <button
                            type="button"
                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            onClick={handleClose}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-2 px-4 py-6 sm:p-6 sm:items-end justify-end"
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} {...toast} onClose={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;
