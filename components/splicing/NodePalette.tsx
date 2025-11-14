import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NodeType } from '../../types';
import { CloseIcon } from '../Icons';

interface NodePaletteProps {
    isEditing: boolean;
    isVisible: boolean;
    onClose: () => void;
    onAddNode: (type: NodeType) => void;
    position: { x: number; y: number };
    onPositionChange: (newPosition: { x: number; y: number }) => void;
}

const nodeTypes: { type: NodeType; label: string }[] = [
    { type: 'input-cable', label: 'Input Cable' },
    { type: 'output-cable', label: 'Output Cable' },
    { type: 'splitter', label: 'Splitter' },
];

const NodePalette: React.FC<NodePaletteProps> = ({ isEditing, isVisible, onClose, onAddNode, position, onPositionChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const paletteRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        // Prevent drag from starting if the click is on a button or an element inside a button
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }

        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        e.preventDefault();
    }, [position]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;

        let newX = e.clientX - dragOffset.current.x;
        let newY = e.clientY - dragOffset.current.y;

        // Constrain to viewport
        if (paletteRef.current) {
            const { offsetWidth, offsetHeight } = paletteRef.current;
            newX = Math.max(0, Math.min(newX, window.innerWidth - offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - offsetHeight));
        }

        onPositionChange({ x: newX, y: newY });
    }, [isDragging, onPositionChange]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);
    
    if (!isEditing || !isVisible) {
        return null;
    }

    return (
        <aside
            ref={paletteRef}
            onMouseDown={handleMouseDown}
            className="fixed w-64 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl z-20 cursor-move"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            aria-label="Drag to move components panel"
        >
            <div
                className="flex justify-between items-center p-2 bg-slate-900/80 rounded-t-lg"
            >
                <h3 className="font-semibold text-white text-sm select-none">Components</h3>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors cursor-pointer"
                    aria-label="Close components panel"
                >
                    <CloseIcon />
                </button>
            </div>
            <div className="p-4">
                <div className="space-y-2">
                    {nodeTypes.map(node => (
                        <button 
                            key={node.type}
                            onClick={() => onAddNode(node.type)}
                            className="w-full text-left p-3 bg-slate-700 rounded-md text-slate-200 text-sm font-medium hover:bg-slate-600 hover:ring-2 hover:ring-cyan-500 transition-all cursor-pointer"
                        >
                            {node.label}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default NodePalette;
