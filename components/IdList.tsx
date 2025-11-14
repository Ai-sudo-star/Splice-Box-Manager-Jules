import React from 'react';
import { SpliceBox } from '../types';
import { EditIcon, HistoryIcon, MapIcon, StarIcon, TrashIcon } from './Icons';

interface IdListProps {
    title: string;
    boxes: SpliceBox[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onViewHistory: (id: string) => void;
    onEditRemark: (id: string) => void;
    isFavoritesActive: boolean;
    onToggleFavorites: () => void;
}

const IdList: React.FC<IdListProps> = ({ title, boxes, selectedId, onSelect, onDelete, onViewHistory, onEditRemark, isFavoritesActive, onToggleFavorites }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg h-full">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">{title} ({boxes.length})</h3>
            <button
                onClick={onToggleFavorites}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer transform hover:scale-105 ${
                    isFavoritesActive
                        ? 'bg-yellow-400 text-slate-900 ring-2 ring-offset-2 ring-offset-slate-900 ring-yellow-400'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
            >
                <StarIcon />
                <span>Favorites</span>
            </button>
        </div>
        <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {boxes.length > 0 ? (
                <ul className="space-y-2">
                    {boxes.map((box) => (
                        <li 
                           key={box.id}
                           onClick={() => onSelect(box.id)}
                           className={`flex items-start justify-between p-3 rounded-md transition-all duration-200 cursor-pointer ${selectedId === box.id ? 'bg-cyan-600 shadow-md ring-2 ring-cyan-400' : 'bg-slate-700 hover:bg-slate-600'}`}>
                           <div className="flex-1 min-w-0 pr-2">
                                <span className={`font-mono text-lg block ${selectedId === box.id ? 'text-white font-bold' : 'text-cyan-300'}`}>{box.id}</span>
                                {box.remark && (
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                        {box.remark}
                                    </p>
                                )}
                           </div>
                            <div className="flex items-center space-x-1">
                                {box.details.latitude && box.details.longitude && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const url = `https://www.google.com/maps/search/?api=1&query=${box.details.latitude},${box.details.longitude}`;
                                            window.open(url, '_blank', 'noopener,noreferrer');
                                        }}
                                        className="text-green-400 hover:text-green-300 transition-colors p-1 rounded-full hover:bg-green-500/20"
                                        aria-label={`Open location for ID ${box.id} in Google Maps`}
                                        title="Open in Google Maps"
                                    >
                                        <MapIcon />
                                    </button>
                                )}
                                <button onClick={(e) => { e.stopPropagation(); onEditRemark(box.id); }} className="text-yellow-400 hover:text-yellow-300 transition-colors p-1 rounded-full hover:bg-yellow-500/20" aria-label={`Edit remark for ID ${box.id}`}>
                                    <EditIcon />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); onViewHistory(box.id); }} className="text-sky-400 hover:text-sky-300 transition-colors p-1 rounded-full hover:bg-sky-500/20" aria-label={`View history for ID ${box.id}`}>
                                    <HistoryIcon />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); onDelete(box.id); }} className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-500/20" aria-label={`Delete ID ${box.id}`}>
                                    <TrashIcon />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-slate-500 italic">No IDs match your search.</p>
                </div>
            )}
        </div>
    </div>
);

export default IdList;