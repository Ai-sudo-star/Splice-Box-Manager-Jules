import React from 'react';

const StorageErrorBanner: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => (
    <div className="bg-red-800 bg-opacity-90 text-white p-4 rounded-lg mb-6 flex justify-between items-center shadow-lg" role="alert">
        <div className="flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{message}</span>
        </div>
        <button onClick={onDismiss} className="text-white hover:bg-red-700 p-1 rounded-full transition-colors" aria-label="Dismiss error">
             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
);

export default StorageErrorBanner;
