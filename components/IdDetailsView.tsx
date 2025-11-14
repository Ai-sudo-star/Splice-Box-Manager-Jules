import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { SpliceBox, SpliceBoxDetails, Tag } from '../types';
import { LocationMarkerIcon, StarIcon } from './Icons';
import TagPill from './TagPill';

/**
 * A reusable component for displaying a single section of details.
 * It can switch between a view mode and an edit mode with a textarea.
 * @param {object} props The component props.
 * @returns {JSX.Element} The rendered detail section.
 */
const DetailSection: React.FC<{ title: string; content: string; isEditing: boolean; onChange: (value: string) => void; }> = ({ title, content, isEditing, onChange }) => (
    <div>
        <h4 className="font-bold text-slate-100 border-b border-slate-600 pb-1 mb-2">{title}</h4>
        {isEditing ? (
            <textarea
                value={content}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-24 bg-slate-700 border border-slate-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                placeholder={`Enter ${title.toLowerCase()}...`}
            />
        ) : (
            <div className="p-2 min-h-[4rem] text-slate-300 text-sm font-mono whitespace-pre-wrap">
                {content && content.trim() ? content : <span className="text-slate-500 italic">No details entered yet.</span>}
            </div>
        )}
    </div>
);

/**
 * Props for the IdDetailsView component.
 */
interface IdDetailsViewProps {
    /** The currently selected splice box to display details for. */
    selectedBox: SpliceBox | null;
    /** Callback to update the details of a splice box. */
    onUpdateDetails: (id: string, newDetails: SpliceBoxDetails) => void;
    /** Callback to toggle the favorite status of a splice box. */
    onToggleFavorite: (id: string) => void;
    /** Callback to update the tags of a splice box. */
    onUpdateTags: (id: string, newTags: string[]) => void;
    /** The list of all available tags. */
    allTags: Tag[];
    /** Callback to open the splicing diagram for the selected box. */
    onOpenSplicingDiagram: (id: string) => void;
}

/**
 * A component that displays the detailed information for a selected splice box.
 * It supports an editing mode to modify details, tags, and location.
 * @param {IdDetailsViewProps} props The component props.
 * @returns {JSX.Element} The rendered details view.
 */
const IdDetailsView: React.FC<IdDetailsViewProps> = ({ selectedBox, onUpdateDetails, onToggleFavorite, onUpdateTags, allTags, onOpenSplicingDiagram }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableDetails, setEditableDetails] = useState<SpliceBoxDetails | null>(null);
    const [editableTags, setEditableTags] = useState<string[]>([]);
    const [locationError, setLocationError] = useState<string | null>(null);

    const tagMap = useMemo(() => new Map(allTags.map(tag => [tag.name, tag.color])), [allTags]);

    useEffect(() => {
        if (selectedBox) {
            setEditableDetails(selectedBox.details);
            setEditableTags(selectedBox.tags);
            setIsEditing(false); // Reset to view mode on selection change
            setLocationError(null); // Clear location error on new selection
        } else {
            setEditableDetails(null);
            setEditableTags([]);
        }
    }, [selectedBox]);

    const handleDetailChange = useCallback((field: keyof Omit<SpliceBoxDetails, 'splicingDiagram'>, value: string) => {
        setEditableDetails(prev => prev ? { ...prev, [field]: value } : null);
    }, []);

    const handleGetCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser.');
            return;
        }

        setLocationError(null); // Clear previous errors

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                handleDetailChange('latitude', latitude.toFixed(6).toString());
                handleDetailChange('longitude', longitude.toFixed(6).toString());
            },
            (error) => {
                console.error("Error getting location: ", error);
                let message = 'An unknown error occurred.';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Geolocation permission denied. To use this feature, please enable location access for this site in your browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = "Location information is unavailable. Please ensure your device's location services are turned on and try again.";
                        break;
                    case error.TIMEOUT:
                        message = "The request to get user location timed out. Please try again.";
                        break;
                }
                setLocationError(message);
            }
        );
    }, [handleDetailChange]);


    if (!selectedBox || !editableDetails) {
        return (
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg h-full flex items-center justify-center">
                <p className="text-slate-500 italic text-center">Select an active ID to view its details.</p>
            </div>
        );
    }
    
    const handleSave = () => {
        onUpdateDetails(selectedBox.id, editableDetails);
        onUpdateTags(selectedBox.id, editableTags);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditableDetails(selectedBox.details); // Revert changes
        setEditableTags(selectedBox.tags);
        setIsEditing(false);
    };
    
    const handleTagToggle = (tagName: string) => {
        setEditableTags(prev => 
            prev.includes(tagName)
                ? prev.filter(t => t !== tagName)
                : [...prev, tagName]
        );
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Details for <span className="text-cyan-400 font-mono">{selectedBox.id}</span></h3>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onToggleFavorite(selectedBox.id)}
                        className={`p-1 rounded-full transition-colors ${selectedBox.isFavorite ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-500 hover:text-slate-300'}`}
                        aria-label={selectedBox.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <StarIcon />
                    </button>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="bg-slate-600 hover:bg-slate-700 text-sm text-slate-200 font-bold py-1 px-3 rounded-md transition-all duration-200">
                            Edit
                        </button>
                    ) : (
                         <div className="flex space-x-2">
                             <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-sm text-white font-bold py-1 px-3 rounded-md transition-all duration-200">
                                 Save
                             </button>
                             <button onClick={handleCancel} className="bg-slate-600 hover:bg-slate-700 text-sm text-slate-200 font-bold py-1 px-3 rounded-md transition-all duration-200">
                                 Cancel
                             </button>
                         </div>
                    )}
                </div>
            </div>
            
            <div className="flex-grow h-[400px] overflow-y-auto pr-2 custom-scrollbar text-slate-300 pt-4 border-t border-slate-700">
                <button
                    onClick={() => onOpenSplicingDiagram(selectedBox.id)}
                    className="w-full text-center bg-slate-700 hover:bg-slate-600 text-cyan-300 font-semibold py-2 px-4 rounded-md transition-all duration-200 mb-6"
                >
                    View Splicing Diagram
                </button>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-slate-100 border-b border-slate-600 pb-1 mb-2">Tags</h4>
                        {isEditing ? (
                            <div className="flex flex-wrap p-2">
                                {allTags.length > 0 ? allTags.map(tag => (
                                    <TagPill
                                        key={tag.name}
                                        name={tag.name}
                                        color={tag.color}
                                        onClick={() => handleTagToggle(tag.name)}
                                        isActive={editableTags.includes(tag.name)}
                                    />
                                )) : <span className="text-slate-500 italic text-sm">No tags available. Add some in 'Manage Tags'.</span>}
                            </div>
                        ) : (
                            <div className="p-2 min-h-[2rem]">
                                {selectedBox.tags.length > 0 ? selectedBox.tags.map(tagName => (
                                    <TagPill key={tagName} name={tagName} color={tagMap.get(tagName) || 'bg-slate-500'} />
                                )) : <span className="text-slate-500 italic text-sm">No tags assigned.</span>}
                            </div>
                        )}
                    </div>
                    <DetailSection title="Core Connections" content={editableDetails.coreConnections} isEditing={isEditing} onChange={(val) => handleDetailChange('coreConnections', val)} />
                    <DetailSection title="Power Balance" content={editableDetails.powerBalance} isEditing={isEditing} onChange={(val) => handleDetailChange('powerBalance', val)} />
                    <DetailSection title="Internal Connections" content={editableDetails.internalConnections} isEditing={isEditing} onChange={(val) => handleDetailChange('internalConnections', val)} />
                    <DetailSection title="Landmark" content={editableDetails.landmark} isEditing={isEditing} onChange={(val) => handleDetailChange('landmark', val)} />
                    <DetailSection title="Area" content={editableDetails.area} isEditing={isEditing} onChange={(val) => handleDetailChange('area', val)} />
                    <DetailSection title="Distance" content={editableDetails.distance} isEditing={isEditing} onChange={(val) => handleDetailChange('distance', val)} />
                    <div>
                        <div className="flex justify-between items-center border-b border-slate-600 pb-1 mb-2">
                            <h4 className="font-bold text-slate-100">Location</h4>
                            {isEditing && (
                                <button
                                    onClick={handleGetCurrentLocation}
                                    className="flex items-center space-x-1.5 text-xs bg-sky-600 hover:bg-sky-700 text-white font-semibold py-1 px-2 rounded-md transition-all duration-200"
                                    aria-label="Get current location"
                                >
                                    <LocationMarkerIcon />
                                    <span>Get Current</span>
                                </button>
                            )}
                        </div>
                        {isEditing && locationError && (
                            <p className="text-red-400 text-xs mt-2" role="alert">{locationError}</p>
                        )}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <label htmlFor="latitude-input" className="text-sm text-slate-400 mb-1 block">Latitude</label>
                                {isEditing ? (
                                    <input
                                        id="latitude-input"
                                        type="text"
                                        value={editableDetails.latitude}
                                        onChange={(e) => handleDetailChange('latitude', e.target.value)}
                                        className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                                        placeholder="e.g., 34.052235"
                                    />
                                ) : (
                                    <div className="p-2 min-h-[40px] text-slate-300 text-sm font-mono whitespace-pre-wrap flex items-center">
                                        {editableDetails.latitude.trim() ? editableDetails.latitude : <span className="text-slate-500 italic">No details entered yet.</span>}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="longitude-input" className="text-sm text-slate-400 mb-1 block">Longitude</label>
                                {isEditing ? (
                                    <input
                                        id="longitude-input"
                                        type="text"
                                        value={editableDetails.longitude}
                                        onChange={(e) => handleDetailChange('longitude', e.target.value)}
                                        className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                                        placeholder="e.g., -118.243683"
                                    />
                                ) : (
                                    <div className="p-2 min-h-[40px] text-slate-300 text-sm font-mono whitespace-pre-wrap flex items-center">
                                        {editableDetails.longitude.trim() ? editableDetails.longitude : <span className="text-slate-500 italic">No details entered yet.</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdDetailsView;
