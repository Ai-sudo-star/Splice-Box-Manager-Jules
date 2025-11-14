import React from 'react';
import { SpliceBoxTypeDefinition } from '../types';
import { SettingsIcon } from './Icons';

/**
 * Props for the IdControls component.
 */
interface IdControlsProps {
    /** The currently selected box type prefix. */
    selectedType: string | null;
    /** The list of available box type definitions. */
    boxTypes: SpliceBoxTypeDefinition[];
    /** Callback function when the selected box type changes. */
    onTypeChange: (type: string) => void;
    /** Callback function to trigger the generation of a new ID. */
    onGenerate: () => void;
    /** Flag indicating if an ID is currently being generated. */
    isLoading: boolean;
    /** Callback function to show the settings modal. */
    onShowSettingsModal: () => void;
}

/**
 * A component that provides controls for selecting a splice box type and generating a new ID.
 * It includes a dropdown for type selection and a button to trigger ID generation.
 * @param {IdControlsProps} props The component props.
 * @returns {JSX.Element} The rendered controls component.
 */
const IdControls: React.FC<IdControlsProps> = ({ selectedType, boxTypes, onTypeChange, onGenerate, isLoading, onShowSettingsModal }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Controls</h2>
            <button
                onClick={onShowSettingsModal}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Open Settings"
            >
                <SettingsIcon />
            </button>
        </div>
        <div className="space-y-4">
            <div>
                <label htmlFor="boxTypeSelect" className="block text-slate-400 mb-2">1. Select Box Type</label>
                {boxTypes.length > 0 && selectedType ? (
                    <select
                        id="boxTypeSelect"
                        value={selectedType}
                        onChange={(e) => onTypeChange(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-white p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    >
                        {boxTypes.map(bt => (
                            <option key={bt.prefix} value={bt.prefix}>
                                {bt.name} ({bt.prefix})
                            </option>
                        ))}
                    </select>
                ) : (
                    <div className="text-slate-500 italic text-center p-3 bg-slate-700 rounded-md">
                        <p>No box types defined.</p>
                        <button onClick={onShowSettingsModal} className="text-cyan-400 hover:underline mt-1">
                            Add a box type in Settings to begin.
                        </button>
                    </div>
                )}
            </div>
            <div>
                <label className="block text-slate-400 mb-2">2. Generate ID</label>
                <button
                    onClick={onGenerate}
                    disabled={isLoading || !selectedType}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-200 shadow-lg flex items-center justify-center"
                >
                    {isLoading ? 'Generating...' : `Generate New ${selectedType || ''} ID`}
                </button>
            </div>
        </div>
    </div>
);

export default IdControls;
