import React from 'react';
import Modal from './Modal';

interface ConfirmDeleteModalProps {
    boxId: string | null;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ boxId, onClose, onConfirm }) => {
    return (
        <Modal isOpen={!!boxId} onClose={onClose} title="Confirm Deletion">
            {boxId && (
                <div className="space-y-6">
                    <p className="text-slate-300">
                        Are you sure you want to delete ID <span className="font-bold font-mono text-cyan-400">{boxId}</span>? 
                        This action will mark the ID as inactive, but its history will be preserved.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-md transition-all duration-200">
                            Cancel
                        </button>
                        <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200">
                            Confirm Delete
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ConfirmDeleteModal;