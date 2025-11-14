import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { SpliceBox, SpliceBoxDetails, HistoryEntry, Tag, UserProfile } from './types';
import { generateNextId } from './utils/idGenerator';
import { sortSpliceBoxIds } from './utils/sorting';
import useSpliceBoxState from './hooks/useSpliceBoxState';
import { parseSearchQuery } from './utils/searchParser';

import Header from './components/Header';
import { CloseIcon, FilterIcon, InfoIcon, SearchIcon } from './components/Icons';
import IdControls from './components/IdControls';
import IdList from './components/IdList';
import IdDetailsView from './components/IdDetailsView';
import StorageErrorBanner from './components/StorageErrorBanner';
import TagFilter from './components/TagFilter';
import SettingsModal from './components/modals/SettingsModal';
import EditRemarkModal from './components/modals/EditRemarkModal';
import HistoryModal from './components/modals/HistoryModal';
import ConfirmDeleteModal from './components/modals/ConfirmDeleteModal';
import ProfilePage from './components/ProfilePage';
import SplicingDiagramPage from './components/splicing/SplicingDiagramPage';

const App: React.FC = () => {
    const {
        storageError,
        setStorageError,
        isStateLoaded,
        boxTypes,
        setBoxTypes,
        boxes,
        setBoxes,
        tags,
        setTags,
        profile,
        setProfile
    } = useSpliceBoxState();
    
    // State for UI interaction
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [historyModalId, setHistoryModalId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [editingRemark, setEditingRemark] = useState<{id: string, text: string} | null>(null);
    const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
    const [isSearchHelpOpen, setIsSearchHelpOpen] = useState(false);
    const [currentView, setCurrentView] = useState<'manager' | 'profile' | 'splicing'>('manager');
    const [splicingViewBoxId, setSplicingViewBoxId] = useState<string | null>(null);

    const searchControlsRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    // Effect to handle clicks outside popovers
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchControlsRef.current && !searchControlsRef.current.contains(event.target as Node)) {
                setIsFilterPopoverOpen(false);
                setIsSearchHelpOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Effect to set initial selected type
    useEffect(() => {
        if (isStateLoaded && boxTypes.length > 0 && !selectedType) {
            setSelectedType(boxTypes[0].prefix);
        }
    }, [isStateLoaded, boxTypes, selectedType]);


    // Effect to manage selected type when box types change
    useEffect(() => {
        if (!isStateLoaded) return;
        if (boxTypes.length > 0 && !boxTypes.find(bt => bt.prefix === selectedType)) {
            setSelectedType(boxTypes[0].prefix);
        } else if (boxTypes.length === 0) {
            setSelectedType(null);
        }
        setSelectedId(null);
        setSearchTerm('');
    }, [boxTypes, isStateLoaded, selectedType]);

    const handleAddBoxType = useCallback((name: string, prefix: string) => {
        const newType = { name, prefix };
        setBoxTypes(prev => [...prev, newType].sort((a, b) => a.name.localeCompare(b.name)));
        if (!selectedType) {
            setSelectedType(prefix);
        }
    }, [selectedType, setBoxTypes]);

    const handleDeleteBoxType = useCallback((prefixToDelete: string) => {
        const boxesOfTypeCount = boxes.filter(box => box.type === prefixToDelete).length;
        let confirmationMessage = `Are you sure you want to delete the box type "${prefixToDelete}"?`;

        if (boxesOfTypeCount > 0) {
            confirmationMessage += ` This will also permanently delete ${boxesOfTypeCount} associated splice box ID(s). This action cannot be undone.`;
        }

        if (window.confirm(confirmationMessage)) {
            setBoxTypes(prev => prev.filter(bt => bt.prefix !== prefixToDelete));
            setBoxes(prev => prev.filter(box => box.type !== prefixToDelete));
        }
    }, [boxes, setBoxTypes, setBoxes]);

    const handleGenerateId = useCallback(() => {
        if (!selectedType) return;
        setIsLoading(true);
        setTimeout(() => {
            const reusableBoxes = boxes
                .filter(b => b.type === selectedType && b.status === 'DELETED')
                .sort((a, b) => sortSpliceBoxIds(a.id, b.id));

            if (reusableBoxes.length > 0) {
                const boxToReuse = reusableBoxes[0];
                const historyEntry: HistoryEntry = {
                    timestamp: new Date().toISOString(),
                    event: 'REINSTATED',
                    notes: `ID ${boxToReuse.id} was reactivated.`,
                };
                
                setBoxes(prevBoxes =>
                    prevBoxes.map(box =>
                        box.id === boxToReuse.id
                            ? {
                                ...box,
                                status: 'ACTIVE',
                                history: [...box.history, historyEntry],
                              }
                            : box
                    )
                );
            } else {
                const activeIdsForType = boxes
                    .filter(b => b.type === selectedType && b.status === 'ACTIVE')
                    .map(b => b.id)
                    .sort(sortSpliceBoxIds);

                const lastId = activeIdsForType.length > 0 ? activeIdsForType[activeIdsForType.length - 1] : null;
                const newId = generateNextId(lastId, selectedType);
                const newBox: SpliceBox = { 
                    id: newId, 
                    type: selectedType,
                    status: 'ACTIVE',
                    remark: '',
                    isFavorite: false,
                    tags: [],
                    details: { 
                        coreConnections: '', 
                        powerBalance: '', 
                        internalConnections: '', 
                        landmark: '', 
                        area: '', 
                        distance: '', 
                        latitude: '', 
                        longitude: '', 
                        splicingDiagram: { inputs: [], outputs: [], connections: [] }
                    },
                    history: [{
                        timestamp: new Date().toISOString(),
                        event: 'CREATED',
                        notes: `ID ${newId} generated.`
                    }]
                };
                setBoxes(prev => [...prev, newBox]);
            }
            setIsLoading(false);
        }, 300);
    }, [selectedType, boxes, setBoxes]);

    const handleConfirmDelete = useCallback(() => {
        if (!confirmDeleteId) return;

        if (confirmDeleteId === selectedId) {
            setSelectedId(null);
        }

        const historyEntry: HistoryEntry = {
            timestamp: new Date().toISOString(),
            event: 'DELETED',
            notes: `ID ${confirmDeleteId} marked as deleted.`,
        };

        setBoxes(prevBoxes =>
            prevBoxes.map(box =>
                box.id === confirmDeleteId
                    ? { ...box, status: 'DELETED', history: [...box.history, historyEntry] }
                    : box
            )
        );
        
        setConfirmDeleteId(null);
    }, [confirmDeleteId, selectedId, setBoxes]);

    const handleToggleFavorite = useCallback((idToToggle: string) => {
        setBoxes(prevBoxes =>
            prevBoxes.map(box =>
                box.id === idToToggle
                    ? { ...box, isFavorite: !box.isFavorite }
                    : box
            )
        );
    }, [setBoxes]);


    const handleUpdateDetails = useCallback((idToUpdate: string, newDetails: SpliceBoxDetails) => {
        const oldBox = boxes.find(box => box.id === idToUpdate);
        if (!oldBox) return;

        const changedFields = (Object.keys(newDetails) as Array<keyof SpliceBoxDetails>).filter(
            key => {
                if (key === 'splicingDiagram') {
                    return JSON.stringify(newDetails[key]) !== JSON.stringify(oldBox.details[key]);
                }
                return newDetails[key] !== oldBox.details[key];
            }
        );

        let historyEntry: HistoryEntry | null = null;
        if (changedFields.length > 0) {
            historyEntry = {
                timestamp: new Date().toISOString(),
                event: 'DETAILS_UPDATED',
                notes: `Updated fields: ${changedFields.join(', ')}.`,
            };
        }

        setBoxes(prevBoxes =>
            prevBoxes.map(box => {
                if (box.id !== idToUpdate) {
                    return box;
                }
                return { 
                    ...box, 
                    details: newDetails,
                    history: historyEntry ? [...box.history, historyEntry] : box.history
                };
            })
        );
    }, [boxes, setBoxes]);
    
    const handleUpdateBoxTags = useCallback((idToUpdate: string, newTags: string[]) => {
        const oldBox = boxes.find(box => box.id === idToUpdate);
        if (!oldBox) return;

        const tagsChanged = oldBox.tags.length !== newTags.length || !oldBox.tags.every(tag => newTags.includes(tag));

        if (!tagsChanged) return;

        const historyEntry: HistoryEntry = {
            timestamp: new Date().toISOString(),
            event: 'TAGS_UPDATED',
            notes: `Tags updated.`,
        };

        setBoxes(prevBoxes =>
            prevBoxes.map(box => {
                if (box.id !== idToUpdate) {
                    return box;
                }
                return {
                    ...box,
                    tags: newTags,
                    history: [...box.history, historyEntry]
                };
            })
        );
    }, [boxes, setBoxes]);

    const handleSaveRemark = (id: string, text: string) => {
        setBoxes(prev => prev.map(box => 
            box.id === id 
            ? { ...box, remark: text }
            : box
        ));
        setEditingRemark(null);
    };
    
    const handleToggleFilterTag = (tagName: string) => {
        setSelectedFilterTags(prev =>
            prev.includes(tagName)
                ? prev.filter(t => t !== tagName)
                : [...prev, tagName]
        );
    };

    const handleAddTag = (name: string, color: string): boolean => {
        if (tags.some(tag => tag.name.toLowerCase() === name.toLowerCase())) {
            return false;
        }
        setTags(prev => [...prev, { name, color }].sort((a,b) => a.name.localeCompare(b.name)));
        return true;
    };

    const handleDeleteTag = (name: string) => {
        setBoxes(prevBoxes => prevBoxes.map(box => ({
            ...box,
            tags: box.tags.filter(t => t !== name)
        })));
        setTags(prev => prev.filter(tag => tag.name !== name));
    };

    const handleSearchGuideClick = (keyword: string) => {
        setSearchTerm(prev => {
            const trimmed = prev.trim();
            if (trimmed === '') {
                return `${keyword} `;
            }
            return `${trimmed} ${keyword} `;
        });
        searchInputRef.current?.focus();
    };

    const handleOpenSplicingDiagram = (id: string) => {
        setSplicingViewBoxId(id);
        setCurrentView('splicing');
    };

    const handleBackToManager = () => {
        setSplicingViewBoxId(null);
        setCurrentView('manager');
    };
    
    const searchKeywords = [
        { key: 'id:', description: 'Search by ID' },
        { key: 'remark:', description: 'Search in remarks/notes' },
        { key: 'landmark:', description: 'Search in landmarks' },
        { key: 'area:', description: 'Search in area' },
        { key: 'conn:', description: 'Search in connections' },
        { key: 'power:', description: 'Search in power balance' },
        { key: 'dist:', description: 'Search in distance' },
        { key: 'loc:', description: 'Search in location' },
    ];

    const filteredActiveBoxes = useMemo(() => {
        if (!selectedType) return [];
        const sortSpliceBoxes = (a: SpliceBox, b: SpliceBox): number => sortSpliceBoxIds(a.id, b.id);

        const criteria = parseSearchQuery(searchTerm);
    
        return boxes
            .filter(b => {
                const matchesType = b.type === selectedType && b.status === 'ACTIVE';
                const matchesTags = selectedFilterTags.length === 0 || selectedFilterTags.every(filterTag => b.tags.includes(filterTag));
                const matchesFavorites = !showFavoritesOnly || b.isFavorite;

                if (!matchesType || !matchesTags || !matchesFavorites) {
                    return false;
                }
    
                if (searchTerm.trim() === '') {
                    return true;
                }

                const content = {
                    id: b.id.toLowerCase(),
                    remark: b.remark.toLowerCase(),
                    landmark: b.details.landmark.toLowerCase(),
                    area: b.details.area.toLowerCase(),
                    conn: `${b.details.coreConnections.toLowerCase()} ${b.details.internalConnections.toLowerCase()}`,
                    power: b.details.powerBalance.toLowerCase(),
                    dist: b.details.distance.toLowerCase(),
                    loc: `${b.details.latitude.toLowerCase()} ${b.details.longitude.toLowerCase()}`,
                    global: `${b.id.toLowerCase()} ${b.remark.toLowerCase()} ${b.details.landmark.toLowerCase()} ${b.details.coreConnections.toLowerCase()} ${b.details.area.toLowerCase()}`
                };

                const check = (terms: string[], fieldContent: string) => {
                    return terms.every(term => fieldContent.includes(term));
                };

                return (
                    check(criteria.global, content.global) &&
                    check(criteria.id, content.id) &&
                    check(criteria.remark, content.remark) &&
                    check(criteria.landmark, content.landmark) &&
                    check(criteria.area, content.area) &&
                    check(criteria.conn, content.conn) &&
                    check(criteria.power, content.power) &&
                    check(criteria.dist, content.dist) &&
                    check(criteria.loc, content.loc)
                );
            })
            .sort(sortSpliceBoxes);
    }, [boxes, selectedType, searchTerm, selectedFilterTags, showFavoritesOnly]);

    const selectedBox = useMemo(() => {
        if (!selectedId) return null;
        return boxes.find(box => box.id === selectedId) || null;
    }, [selectedId, boxes]);

    const selectedBoxForHistory = useMemo(() => {
        if (!historyModalId) return null;
        return boxes.find(box => box.id === historyModalId) || null;
    }, [historyModalId, boxes]);
    
    const splicingViewBox = useMemo(() => {
        if (!splicingViewBoxId) return null;
        return boxes.find(box => box.id === splicingViewBoxId) || null;
    }, [splicingViewBoxId, boxes]);

    const handleSaveProfile = (newProfile: UserProfile) => {
        setProfile(newProfile);
        alert('Profile updated successfully!');
        setCurrentView('manager');
    };
    
    if (!isStateLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-cyan-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl text-slate-400">Loading Splice Box Manager...</p>
                </div>
            </div>
        );
    }
    
    const renderContent = () => {
        if (currentView === 'profile') {
            return (
                <ProfilePage 
                    profile={profile}
                    onSave={handleSaveProfile}
                    onBack={() => setCurrentView('manager')}
                />
            );
        }

        if (currentView === 'splicing' && splicingViewBox) {
            return (
                <SplicingDiagramPage
                    box={splicingViewBox}
                    onUpdateDetails={handleUpdateDetails}
                    onBack={handleBackToManager}
                />
            );
        }

        // Default to 'manager' view
        return (
             <div role="main" className="mt-8">
                {storageError && <StorageErrorBanner message={storageError} onDismiss={() => setStorageError(null)} />}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <IdControls
                            selectedType={selectedType}
                            boxTypes={boxTypes}
                            onTypeChange={setSelectedType}
                            onGenerate={handleGenerateId}
                            isLoading={isLoading}
                            onShowSettingsModal={() => setIsSettingsModalOpen(true)}
                        />
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <div ref={searchControlsRef} className="relative">
                            <div className="flex items-center gap-4">
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <SearchIcon />
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        id="search-ids"
                                        type="text"
                                        placeholder={`Search or use filters like 'remark:text'`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 p-3 pl-10 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                                        aria-label="Search active IDs"
                                        disabled={!selectedType}
                                    />
                                    {searchTerm && (
                                        <button 
                                            onClick={() => setSearchTerm('')} 
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                                            aria-label="Clear search"
                                        >
                                            <CloseIcon />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsSearchHelpOpen(prev => !prev)}
                                    className="flex-shrink-0 flex items-center p-3 rounded-lg font-semibold transition-colors duration-200 bg-slate-700 hover:bg-slate-600 text-slate-300"
                                    aria-label="Show search help"
                                    aria-haspopup="true"
                                    aria-expanded={isSearchHelpOpen}
                                >
                                    <InfoIcon />
                                </button>
                                <button
                                    onClick={() => setIsFilterPopoverOpen(prev => !prev)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                                        selectedFilterTags.length > 0 || isFilterPopoverOpen
                                            ? 'bg-cyan-600 text-white'
                                            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                    }`}
                                    aria-haspopup="true"
                                    aria-expanded={isFilterPopoverOpen}
                                >
                                    <FilterIcon />
                                    <span>Filter</span>
                                    {selectedFilterTags.length > 0 && (
                                        <span className="bg-cyan-400 text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {selectedFilterTags.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {isFilterPopoverOpen && (
                                <div className="absolute top-full mt-2 w-full max-w-sm right-0 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-4 z-10 animate-fade-in-down">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-lg font-semibold text-white">Filter by Tags</h4>
                                        {selectedFilterTags.length > 0 && (
                                            <button 
                                                onClick={() => setSelectedFilterTags([])} 
                                                className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                    <TagFilter 
                                        allTags={tags} 
                                        selectedTags={selectedFilterTags} 
                                        onToggleTag={handleToggleFilterTag}
                                    />
                                </div>
                            )}

                            {isSearchHelpOpen && (
                                <div className="absolute top-full mt-2 w-full max-w-md right-0 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-4 z-10 animate-fade-in-down">
                                    <h4 className="text-lg font-semibold text-white mb-3">Advanced Search Guide</h4>
                                    {/* FIX: Corrected typo 'code>' to a proper <code> element with consistent styling. */}
                                    <p className="text-sm text-slate-400 mb-4">Click a keyword to add it to your search. Combine filters like <code className="bg-slate-900 text-cyan-400 px-2 py-1 rounded font-mono text-xs">id:JB-001 remark:check</code>.</p>
                                    <ul className="space-y-1 text-sm">
                                        {searchKeywords.map(({ key, description }) => (
                                            <li
                                                key={key}
                                                onClick={() => handleSearchGuideClick(key)}
                                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSearchGuideClick(key)}
                                                className="flex items-center p-1 rounded-md hover:bg-slate-700 cursor-pointer transition-colors"
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <code className="bg-slate-900 text-cyan-400 px-2 py-1 rounded font-mono text-xs">{key}&lt;text&gt;</code>
                                                <span className="ml-2 text-slate-300">- {description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <IdList 
                                title={`Active ${selectedType || ''} IDs`}
                                boxes={filteredActiveBoxes}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                                onDelete={setConfirmDeleteId}
                                onViewHistory={setHistoryModalId}
                                onEditRemark={(id) => setEditingRemark({ id, text: boxes.find(b => b.id === id)?.remark || ''})}
                                isFavoritesActive={showFavoritesOnly}
                                onToggleFavorites={() => setShowFavoritesOnly(prev => !prev)}
                            />
                            <IdDetailsView 
                                selectedBox={selectedBox}
                                onUpdateDetails={handleUpdateDetails} 
                                onToggleFavorite={handleToggleFavorite}
                                onUpdateTags={handleUpdateBoxTags}
                                allTags={tags}
                                onOpenSplicingDiagram={handleOpenSplicingDiagram}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
                .line-clamp-2 {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fadeInDown 0.2s ease-out forwards;
                }
                .toggle-bg:after {
                    content: '';
                    @apply absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition shadow-sm;
                }
                input:checked + .toggle-bg:after {
                    @apply transform translate-x-full;
                }
                input:checked + .toggle-bg {
                    @apply bg-cyan-600;
                }

            `}</style>
            <div className={`min-h-screen ${currentView !== 'splicing' ? 'p-4 sm:p-6 lg:p-8' : ''}`}>
                <div className={`${currentView !== 'splicing' ? 'max-w-7xl mx-auto' : 'h-screen flex flex-col'}`}>
                    {currentView !== 'splicing' && <Header profile={profile} onNavigateToProfile={() => setCurrentView('profile')} />}
                    <div className={currentView === 'splicing' ? 'flex-1 overflow-hidden p-4 sm:p-6 lg:p-8' : ''}>
                        {renderContent()}
                    </div>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                boxTypes={boxTypes}
                onAddBoxType={handleAddBoxType}
                onDeleteBoxType={handleDeleteBoxType}
                tags={tags}
                onAddTag={handleAddTag}
                onDeleteTag={handleDeleteTag}
            />

            <EditRemarkModal
                editingRemark={editingRemark}
                onClose={() => setEditingRemark(null)}
                onSave={handleSaveRemark}
            />

            <HistoryModal
                isOpen={!!historyModalId}
                onClose={() => setHistoryModalId(null)}
                box={selectedBoxForHistory}
            />
            
            <ConfirmDeleteModal
                boxId={confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
};

export default App;