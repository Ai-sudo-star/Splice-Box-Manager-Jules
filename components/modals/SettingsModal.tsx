import React, { useState } from 'react';
import Modal from './Modal';
import TagPill from '../TagPill';
import { Tag, SpliceBoxTypeDefinition } from '../../types';
import { tagColors } from '../../constants';
import { TrashIcon } from '../Icons';

const AddBoxTypeForm: React.FC<{ onAdd: (name: string, prefix: string) => void; existingPrefixes: string[] }> = ({ onAdd, existingPrefixes }) => {
    const [name, setName] = useState('');
    const [prefix, setPrefix] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const upperPrefix = prefix.toUpperCase();
        
        if (!name.trim() || !upperPrefix.trim()) {
            setError('Name and Prefix cannot be empty.');
            return;
        }
        if (!/^[A-Z]{2,4}$/.test(upperPrefix)) {
            setError('Prefix must be 2-4 uppercase letters.');
            return;
        }
        if (existingPrefixes.includes(upperPrefix)) {
            setError('This prefix is already in use.');
            return;
        }
        
        onAdd(name.trim(), upperPrefix);
        setName('');
        setPrefix('');
        setError(null);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-900 rounded-lg space-y-4">
            <div>
                <label htmlFor="typeName" className="block text-slate-400 mb-2 text-sm">Type Name</label>
                <input
                    id="typeName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Fiber Access Terminal"
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                />
            </div>
             <div>
                <label htmlFor="typePrefix" className="block text-slate-400 mb-2 text-sm">Prefix (2-4 letters)</label>
                <input
                    id="typePrefix"
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="e.g., FAT"
                    maxLength={4}
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded-md uppercase placeholder:capitalize focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200">
                + Add Type
            </button>
        </form>
    );
};

const AddTagForm: React.FC<{ onAddTag: (name: string, color: string) => boolean }> = ({ onAddTag }) => {
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
        <div className="p-4 bg-slate-900 rounded-lg space-y-4">
            <input
                type="text"
                value={newTagName}
                onChange={(e) => {
                    setNewTagName(e.target.value);
                    setError(null);
                }}
                placeholder="New tag name..."
                className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="flex flex-wrap gap-2">
                {tagColors.map(color => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full ${color} transition-transform transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white' : ''}`}
                        aria-label={`Select color ${color}`}
                    />
                ))}
            </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="button" onClick={handleAdd} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200">
                + Add Tag
            </button>
        </div>
    );
};

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    boxTypes: SpliceBoxTypeDefinition[];
    onAddBoxType: (name: string, prefix: string) => void;
    onDeleteBoxType: (prefix: string) => void;
    tags: Tag[];
    onAddTag: (name: string, color: string) => boolean;
    onDeleteTag: (name: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, boxTypes, onAddBoxType, onDeleteBoxType, tags, onAddTag, onDeleteTag }) => {
    const [activeTab, setActiveTab] = useState<'types' | 'tags'>('types');

    const tabButtonClasses = (isActive: boolean) => 
        `px-4 py-3 text-sm font-semibold transition-colors focus:outline-none ${
            isActive 
                ? 'border-b-2 border-cyan-400 text-white' 
                : 'border-b-2 border-transparent text-slate-400 hover:text-slate-200'
        }`;
        
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settings">
            {/* The modal title has a bottom border and mb-4. We cancel the margin with -mt-4 to connect our tab bar. */}
            <div className="-mt-4 border-b border-slate-700">
                <nav className="flex space-x-2" aria-label="Tabs">
                    <button 
                        onClick={() => setActiveTab('types')} 
                        className={tabButtonClasses(activeTab === 'types')}
                        role="tab"
                        aria-selected={activeTab === 'types'}
                        aria-controls="box-types-panel"
                        id="box-types-tab"
                    >
                        Box Types
                    </button>
                    <button 
                        onClick={() => setActiveTab('tags')} 
                        className={tabButtonClasses(activeTab === 'tags')}
                        role="tab"
                        aria-selected={activeTab === 'tags'}
                        aria-controls="tags-panel"
                        id="tags-tab"
                    >
                        Tags
                    </button>
                </nav>
            </div>
            
            <div className="pt-5 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2 -mr-2">
                {activeTab === 'types' && (
                    <div id="box-types-panel" role="tabpanel" tabIndex={0} aria-labelledby="box-types-tab" className="space-y-6">
                        <div className="space-y-3">
                            <h4 className="text-md font-semibold text-slate-300">Existing Types</h4>
                            {boxTypes.length > 0 ? (
                                <ul className="space-y-2">
                                    {boxTypes.map(bt => (
                                        <li key={bt.prefix} className="flex justify-between items-center p-2 bg-slate-700 rounded-md">
                                            <span className="text-slate-200">{bt.name} (<span className="font-mono">{bt.prefix}</span>)</span>
                                            <button
                                                onClick={() => onDeleteBoxType(bt.prefix)}
                                                className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-500/20 transition-colors"
                                                aria-label={`Delete box type ${bt.name}`}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-500 italic text-sm p-2">No box types defined.</p>
                            )}
                        </div>
                        <div>
                            <h4 className="text-md font-semibold text-slate-300 mb-2">Add New Type</h4>
                            <AddBoxTypeForm onAdd={onAddBoxType} existingPrefixes={boxTypes.map(bt => bt.prefix)} />
                        </div>
                    </div>
                )}
                {activeTab === 'tags' && (
                     <div id="tags-panel" role="tabpanel" tabIndex={0} aria-labelledby="tags-tab" className="space-y-6">
                         <div className="space-y-3">
                            <h4 className="text-md font-semibold text-slate-300">Existing Tags</h4>
                             <div className="flex flex-wrap p-2 bg-slate-900 rounded-lg min-h-[4rem] items-center">
                                {tags.length > 0 ? tags.map(tag => (
                                    <TagPill
                                        key={tag.name}
                                        name={tag.name}
                                        color={tag.color}
                                        canRemove={true}
                                        onRemove={() => onDeleteTag(tag.name)}
                                    />
                                )) : <p className="text-slate-500 italic text-sm">No tags created yet.</p>}
                            </div>
                         </div>
                         <div>
                            <h4 className="text-md font-semibold text-slate-300 mb-2">Add New Tag</h4>
                            <AddTagForm onAddTag={onAddTag} />
                         </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default SettingsModal;