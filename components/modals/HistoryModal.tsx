import React from 'react';
import Modal from './Modal';
import { SpliceBox } from '../../types';

interface HistoryModalProps {
    box: SpliceBox | null;
    isOpen: boolean;
    onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ box, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`History for ${box?.id || ''}`}>
            {box ? (
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    <ul className="space-y-4">
                        {box.history.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((entry, index) => {
                            const eventColorClass = {
                                CREATED: 'bg-green-400',
                                DETAILS_UPDATED: 'bg-yellow-400',
                                DELETED: 'bg-red-400',
                                REINSTATED: 'bg-sky-400',
                                TAGS_UPDATED: 'bg-purple-400'
                            }[entry.event];
                            return (
                                <li key={index} className="flex items-start space-x-3 border-l-2 border-slate-700 pl-4 py-1">
                                    <div className={`-translate-x-[23px] mt-1.5 w-3 h-3 rounded-full ring-4 ring-slate-800 ${eventColorClass}`}></div>
                                    <div className="flex-1 -mt-1">
                                        <p className="text-sm text-slate-400">{new Date(entry.timestamp).toLocaleString()}</p>
                                        <p className="font-semibold text-white capitalize">{entry.event.replace(/_/g, ' ').toLowerCase()}</p>
                                        <p className="text-sm text-slate-300">{entry.notes}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : <p className="text-slate-500">No history found.</p>}
        </Modal>
    );
};

export default HistoryModal;