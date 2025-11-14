import React, { useState } from 'react';
import Modal from './Modal';
import TagPill from '../TagPill';
import { Tag } from '../../types';
import { tagColors } from '../../constants';

interface ManageTagsModalProps {
    isOpen: boolean;
    onClose: () => void;
    tags: Tag[];
    onAddTag: (name: string, color: string) => boolean;
    onDeleteTag: (name: string) => void;
}

const ManageTagsModal: React.FC<ManageTagsModalProps> = ({ isOpen, onClose, tags, onAddTag, onDeleteTag }) => {
    const [newTagName, setNewTagName] = useState('');
    const [selectedColor, setSelectedColor] = useState(tagColors[0]);
    const [error, setError] = useState<string | null>(null);

    const handleAdd = () => {
        if (!newTagName.trim()) {
            setError('Tag name cannot be empty.');
            return;
        }
        const success = onAddTag(newTagName.trim(), selectedColor);
        if (success) {
            setNewTagName('');
            setError(null);
        } else {
            setError('A tag with this name already exists.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Tags">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-white mb-3">Add New Tag</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder="New tag name..."
                            className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <div className="flex flex-wrap gap-2">
                            {tagColors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-8 h-8 rounded-full ${color} transition-transform transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white' : ''}`}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                        </div>
                         {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button onClick={handleAdd} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200">
                            Add Tag
                        </button>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white mb-3">Existing Tags</h3>
                    <div className="flex flex-wrap">
                        {tags.length > 0 ? tags.map(tag => (
                            <TagPill
                                key={tag.name}
                                name={tag.name}
                                color={tag.color}
                                canRemove={true}
                                onRemove={() => onDeleteTag(tag.name)}
                            />
                        )) : <p className="text-slate-500 italic">No tags created yet.</p>}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ManageTagsModal;