import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface EditRemarkModalProps {
    editingRemark: { id: string; text: string } | null;
    onClose: () => void;
    onSave: (id: string, text: string) => void;
}

const EditRemarkModal: React.FC<EditRemarkModalProps> = ({ editingRemark, onClose, onSave }) => {
    const [remarkText, setRemarkText] = useState('');

    useEffect(() => {
        if (editingRemark) {
            setRemarkText(editingRemark.text);
        }
    }, [editingRemark]);

    const handleSave = () => {
        if (editingRemark) {
            onSave(editingRemark.id, remarkText);
        }
    };

    return (
        <Modal isOpen={!!editingRemark} onClose={onClose} title={`Edit Note for ${editingRemark?.id || ''}`}>
            {editingRemark && (
                <div className="space-y-4">
                    <textarea
                        value={remarkText}
                        onChange={(e) => setRemarkText(e.target.value)}
                        className="w-full h-32 bg-slate-700 border border-slate-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                        placeholder="Enter remark/note..."
                        aria-label="Remark text area"
                    />
                    <div className="flex justify-end space-x-4">
                         <button onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-md transition-all duration-200">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200">
                            Save Note
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default EditRemarkModal;