import { useState, useEffect } from 'react';
import { SpliceBox, SpliceBoxTypeDefinition, SpliceBoxDetails, Tag, UserProfile, SplicingDiagramData, OldSplicingDiagramData } from '../types';
import { APP_STORAGE_KEY } from '../constants';

const useSpliceBoxState = () => {
    const [storageError, setStorageError] = useState<string | null>(null);
    const [isStateLoaded, setIsStateLoaded] = useState(false);
    const [boxTypes, setBoxTypes] = useState<SpliceBoxTypeDefinition[]>([]);
    const [boxes, setBoxes] = useState<SpliceBox[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [profile, setProfile] = useState<UserProfile>({
        displayName: 'Default User',
        profilePicture: null,
        notifications: {
            email: true,
            push: false,
        }
    });

    // Effect to LOAD state from localStorage on initial mount
    useEffect(() => {
        const initialBoxTypes: SpliceBoxTypeDefinition[] = [
            { name: 'Joint Box', prefix: 'JB' },
            { name: 'Distribution Box', prefix: 'DB' },
            { name: 'Customer Access Point', prefix: 'CAP' },
        ];
        
         const initialTags: Tag[] = [
            { name: 'Priority', color: 'bg-red-500' },
            { name: 'Maintenance', color: 'bg-yellow-500' },
            { name: 'New Install', color: 'bg-green-500' },
            { name: 'Audit', color: 'bg-blue-500' },
        ];
        
        const defaultSplicingDiagram: SplicingDiagramData = {
            nodes: [],
            connections: [],
            viewport: { x: 0, y: 0, zoom: 1 },
        };

        const defaultDetails: Omit<SpliceBoxDetails, 'splicingDiagram'> = {
            coreConnections: '',
            powerBalance: '',
            internalConnections: '',
            landmark: '',
            area: '',
            distance: '',
            latitude: '',
            longitude: '',
        };

        try {
            const storedState = localStorage.getItem(APP_STORAGE_KEY);
            if (storedState) {
                const parsedState = JSON.parse(storedState);
                const migratedBoxes = (parsedState.boxes || []).map((box: any): SpliceBox => {
                    const migratedBox: SpliceBox = {
                        ...box,
                        status: box.status || 'ACTIVE',
                        remark: box.remark || box.details?.remark || '', // Handle migration from old structure
                        isFavorite: box.isFavorite || false, // Handle migration for favorites
                        tags: box.tags || [],
                        details: { ...defaultDetails, ...(box.details || {}) },
                    };
                    
                    const diagram = migratedBox.details.splicingDiagram;
                    // Check for invalid or missing diagram data
                    const isInvalidDiagram = !diagram || 
                        typeof diagram !== 'object' || 
                        (!('nodes' in diagram) && !('inputs' in diagram)); // Check for new or old format keys

                    if (isInvalidDiagram) {
                         migratedBox.details.splicingDiagram = defaultSplicingDiagram;
                    }
                    
                    // Further validation for new format to ensure viewport exists
                    if ('nodes' in diagram && !diagram.viewport) {
                        (diagram as SplicingDiagramData).viewport = { x: 0, y: 0, zoom: 1 };
                    }

                    delete (migratedBox.details as any).remark; // Clean up old structure
                    return migratedBox;
                });

                setBoxTypes(parsedState.boxTypes || initialBoxTypes);
                setTags(parsedState.tags || initialTags);
                setBoxes(migratedBoxes);
                if (parsedState.profile) {
                    setProfile(parsedState.profile);
                }
            } else {
                setBoxTypes(initialBoxTypes);
                setTags(initialTags);
                setBoxes([]);
            }
        } catch (error) {
            console.error("Failed to parse state from localStorage", error);
            setStorageError("Could not load your previous session. Starting with a fresh state.");
            setBoxTypes(initialBoxTypes);
            setTags(initialTags);
            setBoxes([]);
        } finally {
            setIsStateLoaded(true);
        }
    }, []);

    // Effect to SAVE state to localStorage whenever data changes
    useEffect(() => {
        if (!isStateLoaded) return; // Don't save until initial state is loaded

        try {
            const stateToSave = JSON.stringify({ boxTypes, boxes, tags, profile });
            localStorage.setItem(APP_STORAGE_KEY, stateToSave);
            if (storageError?.startsWith('Warning:')) {
                setStorageError(null);
            }
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
            setStorageError("Warning: Could not save your changes. They might be lost when you close this tab.");
        }
    }, [boxTypes, boxes, tags, profile, isStateLoaded, storageError]);

    return {
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
        setProfile,
    };
};

export default useSpliceBoxState;
