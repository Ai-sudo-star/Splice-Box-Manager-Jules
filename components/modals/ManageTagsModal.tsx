import React, { useState } from 'react';
import Modal from './Modal';
import TagPill from '../TagPill';
import { Tag } from '../../types';
import { tagColors } from '../../constants';

/**
 * Props for the ManageTagsModal component.
 */
interface ManageTagsModalProps {
    /** Whether the modal is currently open. */
    isOpen: boolean;
    /** Callback function to close the modal. */
    onClose: () => void;
    /** The current list of all tags. */
    tags: Tag[];
    /**
     * Callback function to add a new tag.
     * @param name - The name of the new tag.
     * @param color - The color of the new tag.
     * @returns {boolean} - True if the tag was added successfully, false otherwise (e.g., if it already exists).
     */
    onAddTag: (name: string, color: string) => boolean;
    /**
     * Callback function to delete an existing tag.
     * @param name - The name of the tag to delete.
     */
    onDeleteTag: (name: string) => void;
}

/**
 * A modal dialog for managing tags. It allows users to create new tags
 * with a specified name and color, and to delete existing tags.
 *
 * @param {ManageTagsModalProps} props - The component props.
 * @returns {JSX.Element} The rendered modal component.
 */
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