import React, { useState } from 'react';
import Modal from './Modal';

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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="typeName" className="block text-slate-400 mb-2 text-sm">Type Name</label>
                <input
                    id="typeName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Fiber Access Terminal"
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200">
                Add Type
            </button>
        </form>
    );
};

interface AddBoxTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, prefix: string) => void;
    existingPrefixes: string[];
}

const AddBoxTypeModal: React.FC<AddBoxTypeModalProps> = ({ isOpen, onClose, onAdd, existingPrefixes }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Box Type">
            <AddBoxTypeForm onAdd={onAdd} existingPrefixes={existingPrefixes} />
        </Modal>
    );
}

export default AddBoxTypeModal;