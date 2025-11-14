import React from 'react';
import Modal from './Modal';

/**
 * Props for the ConfirmDeleteModal component.
 */
interface ConfirmDeleteModalProps {
    /** The ID of the box to be deleted. The modal is open if this is not null. */
    boxId: string | null;
    /** Callback function to close the modal. */
    onClose: () => void;
    /** Callback function to execute when the deletion is confirmed. */
    onConfirm: () => void;
}

/**
 * A modal dialog to confirm the deletion of a splice box.
 * It displays the ID of the box to be deleted and provides options to confirm or cancel.
 *
 * @param {ConfirmDeleteModalProps} props - The component props.
 * @returns {JSX.Element} The rendered modal component.
 */
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