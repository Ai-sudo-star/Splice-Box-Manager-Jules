import React from 'react';
import { DiagramNode, Fiber } from '../../types';
import { TrashIcon } from '../Icons';

interface DiagramNodeProps {
    node: DiagramNode;
    isEditing: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onFiberClick: (nodeId: string, fiberId: string, type: 'in' | 'out') => void;
    onDeleteNode: (nodeId: string) => void;
    selection: { nodeId: string; fiberId: string; type: 'in' | 'out' } | null;
    isFiberConnected: (fiberId: string) => boolean;
    fiberElementsRef: React.MutableRefObject<Map<string, HTMLDivElement>>;
    hoveredNodeId: string | null;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const NodeHandle: React.FC<{
    nodeId: string;
    fiber: Fiber;
    type: 'in' | 'out';
    onClick: () => void;
    isSelected: boolean;
    isConnected: boolean;
    isEditing: boolean;
    fiberElementsRef: React.MutableRefObject<Map<string, HTMLDivElement>>;
    isNodeHovered: boolean;
}> = ({ nodeId, fiber, type, onClick, isSelected, isConnected, isEditing, fiberElementsRef, isNodeHovered }) => (
    <div
        className={`flex items-center justify-between text-xs py-0.5 px-1 rounded-md transition-colors ${type === 'in' ? 'flex-row-reverse' : ''}`}
    >
        <div className={`flex items-center ${type === 'in' ? 'flex-row-reverse' : ''}`}>
            <span className={`w-3 h-3 rounded-sm ${type === 'in' ? 'ml-2' : 'mr-2'}`} style={{ backgroundColor: fiber.color }}></span>
            <span className="font-mono text-slate-400">{fiber.label}</span>
        </div>
        <div
            ref={(el) => { if(el) fiberElementsRef.current.set(fiber.id, el); else fiberElementsRef.current.delete(fiber.id); }}
            data-handle-type={type}
            onClick={onClick}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-150 flex items-center justify-center
                ${isEditing && !isConnected ? 'cursor-pointer' : 'cursor-default'}
                ${isSelected ? 'border-yellow-400 ring-2 ring-yellow-400 bg-yellow-400/50' : ''}
                ${isConnected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'}
                ${isEditing && !isConnected && !isSelected ? 'hover:border-white' : ''}
                ${isNodeHovered && isEditing && !isConnected ? 'scale-125 bg-slate-500' : ''}
            `}
            aria-label={`Fiber connection point for ${fiber.label}`}
        >
            {isSelected && <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>}
        </div>
    </div>
);

const DiagramNodeComponent: React.FC<DiagramNodeProps> = ({ node, isEditing, onMouseDown, onFiberClick, onDeleteNode, selection, isFiberConnected, fiberElementsRef, hoveredNodeId, onMouseEnter, onMouseLeave }) => {
    const isNodeHovered = node.id === hoveredNodeId;
    
    const renderFibers = (fibers: Fiber[], type: 'in' | 'out') => (
        <ul className="space-y-1">
            {fibers.map(fiber => (
                <li key={fiber.id}>
                    <NodeHandle
                        nodeId={node.id}
                        fiber={fiber}
                        type={type}
                        onClick={() => onFiberClick(node.id, fiber.id, type)}
                        isSelected={selection?.fiberId === fiber.id}
                        isConnected={isFiberConnected(fiber.id)}
                        isEditing={isEditing}
                        fiberElementsRef={fiberElementsRef}
                        isNodeHovered={isNodeHovered}
                    />
                </li>
            ))}
        </ul>
    );

    const renderNodeBody = () => {
        switch (node.type) {
            case 'input-cable':
                return <div className="p-2">{node.data.fibers && renderFibers(node.data.fibers, 'out')}</div>;
            case 'output-cable':
                return <div className="p-2">{node.data.fibers && renderFibers(node.data.fibers, 'in')}</div>;
            case 'splitter':
                return (
                    <div className="flex justify-between items-start">
                        <div className="p-2">
                            {node.data.input && (
                                <ul>
                                    <li>
                                        <NodeHandle
                                            nodeId={node.id}
                                            fiber={node.data.input}
                                            type="in"
                                            onClick={() => onFiberClick(node.id, node.data.input!.id, 'in')}
                                            isSelected={selection?.fiberId === node.data.input.id}
                                            isConnected={isFiberConnected(node.data.input.id)}
                                            isEditing={isEditing}
                                            fiberElementsRef={fiberElementsRef}
                                            isNodeHovered={isNodeHovered}
                                        />
                                    </li>
                                </ul>
                            )}
                        </div>
                        <div className="p-2">
                            {node.data.outputs && renderFibers(node.data.outputs, 'out')}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const headerColorClass = {
        'input-cable': 'bg-sky-800',
        'output-cable': 'bg-emerald-800',
        'splitter': 'bg-purple-800',
    }[node.type];

    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="absolute bg-slate-800 border-2 border-slate-700 rounded-lg shadow-xl w-64 select-none"
            style={{ transform: `translate(${node.position.x}px, ${node.position.y}px)` }}
        >
            <div
                onMouseDown={onMouseDown}
                className={`flex justify-between items-center p-2 rounded-t-md ${isEditing ? 'cursor-grab' : ''} ${headerColorClass}`}
            >
                <p className="font-semibold text-sm text-slate-200 truncate pr-2">{node.data.label}</p>
                {isEditing && (
                    <button onClick={() => onDeleteNode(node.id)} className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-500/20 transition-colors flex-shrink-0" aria-label={`Delete node ${node.data.label}`}>
                        <TrashIcon />
                    </button>
                )}
            </div>
            {renderNodeBody()}
        </div>
    );
};

export default DiagramNodeComponent;