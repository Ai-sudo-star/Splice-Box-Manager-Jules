import React, { useState, useEffect, useCallback } from 'react';
import { SpliceBox, SpliceBoxDetails, SplicingDiagramData, DiagramNode, OldSplicingDiagramData, FiberGroup, DiagramContent, NodeType } from '../../types';
import SplicingDiagram from './SplicingDiagram';
import NodePalette from './NodePalette';
import { PaletteIcon, RedoIcon, UndoIcon } from '../Icons';

/**
 * Props for the SplicingDiagramPage component.
 */
interface SplicingDiagramPageProps {
    /** The splice box data for which the diagram is being displayed. */
    box: SpliceBox;
    /** Callback function to update the details of the splice box. */
    onUpdateDetails: (id: string, newDetails: SpliceBoxDetails) => void;
    /** Callback function to navigate back to the previous view. */
    onBack: () => void;
}

/**
 * A toolbar component providing controls for the splicing diagram.
 * It includes buttons for editing, saving, canceling, undo/redo, and toggling the components palette.
 * @param {object} props The component props.
 * @returns {JSX.Element} The rendered toolbar.
 */
const DiagramToolbar: React.FC<{
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    isPaletteVisible: boolean;
    onTogglePalette: () => void;
}> = ({ isEditing, onEdit, onSave, onCancel, onUndo, onRedo, canUndo, canRedo, isPaletteVisible, onTogglePalette }) => {
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-2 rounded-lg shadow-lg flex items-center space-x-2">
            {!isEditing ? (
                <button onClick={onEdit} className="bg-slate-600 hover:bg-slate-700 text-sm text-slate-200 font-bold py-2 px-4 rounded-md transition-all duration-200">
                    Edit Diagram
                </button>
            ) : (
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                        <button onClick={onUndo} disabled={!canUndo} className="p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Undo">
                            <UndoIcon />
                        </button>
                        <button onClick={onRedo} disabled={!canRedo} className="p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Redo">
                            <RedoIcon />
                        </button>
                    </div>
                    <div className="h-6 w-px bg-slate-600"></div>
                     <button 
                        onClick={onTogglePalette} 
                        className={`p-2 rounded-md transition-colors ${isPaletteVisible ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`} 
                        aria-label="Toggle Components Palette"
                        title="Toggle Components"
                    >
                        <PaletteIcon />
                    </button>
                    <div className="h-6 w-px bg-slate-600"></div>
                    <button onClick={onSave} className="bg-green-600 hover:bg-green-700 text-sm text-white font-bold py-2 px-4 rounded-md transition-all duration-200">
                        Save Changes
                    </button>
                    <button onClick={onCancel} className="bg-slate-600 hover:bg-slate-700 text-sm text-slate-200 font-bold py-2 px-4 rounded-md transition-all duration-200">
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

/**
 * A top-level component that orchestrates the splicing diagram view.
 * It manages the editing state, history (undo/redo), and data migration from older diagram formats.
 * It combines the main diagram, a toolbar for actions, and a floating node palette.
 * @param {SplicingDiagramPageProps} props The component props.
 * @returns {JSX.Element} The rendered page.
 */
const SplicingDiagramPage: React.FC<SplicingDiagramPageProps> = ({ box, onUpdateDetails, onBack }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [diagramContent, setDiagramContent] = useState<DiagramContent>({ nodes: [], connections: [] });
    const [viewport, setViewport] = useState<SplicingDiagramData['viewport']>({ x: 0, y: 0, zoom: 1 });
    const [pendingNodeType, setPendingNodeType] = useState<NodeType | null>(null);
    const [isPaletteVisible, setIsPaletteVisible] = useState(true);
    const [palettePosition, setPalettePosition] = useState({ x: window.innerWidth - 256 - 32, y: 150 });
    
    const [history, setHistory] = useState<DiagramContent[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);
    
    // Migration and initialization effect
    useEffect(() => {
        const initialDiagram = box.details.splicingDiagram;
        let migratedDiagram: SplicingDiagramData;

        // Check if it's the old format ('inputs' property exists) and needs migration
        if (initialDiagram && 'inputs' in initialDiagram) {
            const oldData = initialDiagram as OldSplicingDiagramData;
            const newNodes: DiagramNode[] = [];
            let yPos = 50;

            (oldData.inputs || []).forEach((group: FiberGroup, index) => {
                newNodes.push({
                    id: group.id || `input-${index}-${Date.now()}`,
                    type: 'input-cable',
                    position: { x: 150, y: yPos },
                    data: { label: group.label, fibers: group.fibers }
                });
                yPos += (group.fibers.length * 22) + 60; // Adjust spacing based on fiber count
            });
            
            yPos = 50; // Reset Y for the other column
            (oldData.outputs || []).forEach((group: FiberGroup, index) => {
                newNodes.push({
                    id: group.id || `output-${index}-${Date.now()}`,
                    type: 'output-cable',
                    position: { x: 600, y: yPos },
                    data: { label: group.label, fibers: group.fibers }
                });
                yPos += (group.fibers.length * 22) + 60;
            });

            migratedDiagram = {
                nodes: newNodes,
                connections: oldData.connections || [],
                viewport: { x: 0, y: 0, zoom: 1 },
            };
        } else {
             migratedDiagram = initialDiagram as SplicingDiagramData;
             if (!migratedDiagram || !migratedDiagram.nodes) {
                migratedDiagram = { nodes: [], connections: [], viewport: { x: 0, y: 0, zoom: 1 } };
             }
             if (!migratedDiagram.viewport) {
                migratedDiagram.viewport = { x: 0, y: 0, zoom: 1 };
             }
        }
        
        const { nodes, connections, viewport: initialViewport } = migratedDiagram;
        const initialContent = { nodes, connections };

        setDiagramContent(initialContent);
        setViewport(initialViewport);
        setHistory([initialContent]);
        setHistoryIndex(0);
        setIsEditing(false);
    }, [box]);


    const handleContentChange = useCallback((newContent: DiagramContent) => {
        setDiagramContent(newContent);
        
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);
    
    const handleViewportChange = useCallback((newViewport: SplicingDiagramData['viewport']) => {
        setViewport(newViewport);
    }, []);

    const handleAddNode = useCallback((type: NodeType) => {
        setPendingNodeType(type);
    }, []);

    const handleSave = () => {
        const fullDiagramData: SplicingDiagramData = {
            ...diagramContent,
            viewport,
        };
        onUpdateDetails(box.id, { ...box.details, splicingDiagram: fullDiagramData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        const originalContent = history[0]; // The state before any edits
        const originalViewport = (box.details.splicingDiagram as SplicingDiagramData)?.viewport || { x: 0, y: 0, zoom: 1 };
        setDiagramContent(originalContent);
        setViewport(originalViewport);
        setHistory([originalContent]);
        setHistoryIndex(0);
        setIsEditing(false);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setDiagramContent(history[newIndex]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setDiagramContent(history[newIndex]);
        }
    };
    
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    return (
        <div role="main" className="h-full flex flex-col animate-fade-in-down">
            <header className="p-6 sm:p-8 pb-4 flex-shrink-0">
                <button onClick={onBack} className="text-sm text-cyan-400 hover:underline mb-2">
                    &larr; Back to Manager
                </button>
                <h2 className="text-2xl font-bold text-white">
                    Splicing Diagram for <span className="text-cyan-400 font-mono">{box.id}</span>
                </h2>
            </header>
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col relative bg-slate-800 rounded-lg shadow-inner">
                    <DiagramToolbar
                        isEditing={isEditing}
                        onEdit={() => setIsEditing(true)}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        isPaletteVisible={isPaletteVisible}
                        onTogglePalette={() => setIsPaletteVisible(prev => !prev)}
                    />
                    <div className="flex-1 overflow-hidden">
                        <SplicingDiagram
                            content={diagramContent}
                            viewport={viewport}
                            isEditing={isEditing}
                            onContentUpdate={handleContentChange}
                            onViewportUpdate={handleViewportChange}
                            pendingNodeType={pendingNodeType}
                            onPendingNodeHandled={useCallback(() => setPendingNodeType(null), [])}
                        />
                    </div>
                </div>
            </div>
            <NodePalette 
                isEditing={isEditing}
                isVisible={isPaletteVisible}
                onClose={() => setIsPaletteVisible(false)}
                onAddNode={handleAddNode}
                position={palettePosition}
                onPositionChange={setPalettePosition}
            />
        </div>
    );
};

export default SplicingDiagramPage;