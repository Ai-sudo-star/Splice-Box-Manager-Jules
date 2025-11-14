import React from 'react';

interface TagPillProps {
    name: string;
    color: string;
    onClick?: () => void;
    isActive?: boolean;
    canRemove?: boolean;
    onRemove?: () => void;
}

const TagPill: React.FC<TagPillProps> = ({ name, color, onClick, isActive, canRemove, onRemove }) => {
    const baseClasses = `text-xs font-semibold mr-2 mb-2 px-2.5 py-1 rounded-full text-white inline-flex items-center`;
    const interactiveClasses = onClick ? 'cursor-pointer transition-transform transform hover:scale-105' : '';
    const activeClasses = isActive ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white' : '';
    
    return (
        <span className={`${baseClasses} ${color} ${interactiveClasses} ${activeClasses}`} onClick={onClick}>
            {name}
            {canRemove && onRemove && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(); }} 
                    className="ml-1.5 -mr-1 p-0.5 rounded-full text-white/70 hover:text-white hover:bg-black/20 focus:outline-none"
                    aria-label={`Remove tag ${name}`}
                >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 14 14" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l12 12M13 1L1 13"/></svg>
                 </button>
            )}
        </span>
    );
};

export default TagPill;
