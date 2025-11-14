import React, { useState, useLayoutEffect, useRef, useEffect, useCallback } from 'react';
import { SplicingDiagramData, DiagramNode, Fiber, Connection, NodeType, DiagramContent } from '../../types';
import { PlusIcon, TrashIcon } from '../Icons';
import { FIBER_COLORS } from '../../constants';
import Modal from '../modals/Modal';
import DiagramNodeComponent from './DiagramNode';
import DiagramControls from './DiagramControls';

const GRID_SIZE = 16;

// Co-located modal component for adding a new cable/fiber group
interface AddCableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (label: string, coreCount: number) => void;
    nodeType: 'input-cable' | 'output-cable';
}

const AddCableModal: React.FC<AddCableModalProps> = ({ isOpen, onClose, onSubmit, nodeType }) => {
    const [label, setLabel] = useState('');
    const [coreCount, setCoreCount] = useState<number>(12);
    const inputRef = useRef<HTMLInputElement>(null);
    const coreCountOptions = [2, 4, 6, 8, 12, 24, 48];

    useEffect(() => {
        if (isOpen) {
            setLabel('');
            setCoreCount(12);
            setTimeout(() => inputRef.current?.focus(), 100); 
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (label.trim() && coreCount > 0) {
            onSubmit(label.trim(), coreCount);
        }
    };

    const sideName = nodeType === 'input-cable' ? 'Input' : 'Output';
    const isFormValid = label.trim() !== '' && coreCount > 0 && coreCount <= 288;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Add New ${sideName} Cable`}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="cableName" className="block text-slate-400 mb-2 text-sm font-semibold">Cable Name</label>
                    <input
                        ref={inputRef}
                        id="cableName"
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder={`e.g., Main Feed Cable`}
                        className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
                <div>
                    <label htmlFor="coreCount" className="block text-slate-400 mb-2 text-sm font-semibold">Number of Cores</label>
                     <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-3">
                        {coreCountOptions.map(count => (
                            <button
                                key={count}
                                type="button"
                                onClick={() => setCoreCount(count)}
                                className={`py-2 px-1 text-sm rounded-md transition-colors font-semibold ${
                                    coreCount === count 
                                    ? 'bg-cyan-600 text-white ring-2 ring-cyan-400' 
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                    <input
                        id="coreCount"
                        type="number"
                        min="1"
                        max="288"
                        value={coreCount}
                        onChange={(e) => setCoreCount(parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
                <div className="flex justify-end space-x-4 pt-2 border-t border-slate-700">
                    <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-md transition-all duration-200">
                        Cancel
                    </button>
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-slate-500 disabled:cursor-not-allowed" disabled={!isFormValid}>
                        Add Cable
                    </button>
                </div>
            </form>
        </Modal>
    );
};

interface AddSplitterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (label: string, outputCount: number) => void;
}

const AddSplitterModal: React.FC<AddSplitterModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [label, setLabel] = useState('');
    const [outputCount, setOutputCount] = useState<number>(8);
    const inputRef = useRef<HTMLInputElement>(null);
    const splitOptions = [2, 4, 8, 16, 32];

    useEffect(() => {
        if (isOpen) {
            setLabel('');
            setOutputCount(8);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (label.trim() && outputCount > 0) {
            onSubmit(label.trim(), outputCount);
        }
    };
    
    const isFormValid = label.trim() !== '';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Splitter">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="splitterName" className="block text-slate-400 mb-2 text-sm font-semibold">Splitter Name / Label</label>
                    <input
                        ref={inputRef}
                        id="splitterName"
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g., SPL-01A"
                        className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
                <div>
                    <label className="block text-slate-400 mb-2 text-sm font-semibold">Split Ratio (1xN)</label>
                    <div className="grid grid-cols-5 gap-2">
                        {splitOptions.map(count => (
                            <button
                                key={count}
                                type="button"
                                onClick={() => setOutputCount(count)}
                                className={`py-2 px-1 text-sm rounded-md transition-colors font-semibold ${
                                    outputCount === count
                                        ? 'bg-cyan-600 text-white ring-2 ring-cyan-400'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                1x{count}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end space-x-4 pt-2 border-t border-slate-700">
                    <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-md transition-all duration-200">
                        Cancel
                    </button>
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-slate-500 disabled:cursor-not-allowed" disabled={!isFormValid}>
                        Add Splitter
                    </button>
                </div>
            </form>
        </Modal>
    );
};


const getCurvePath = (startX: number, startY: number, endX: number, endY: number) => {
    const hx1 = startX + Math.abs(endX - startX) * 0.6;
    const hx2 = endX - Math.abs(endX - startX) * 0.6;
    return `M ${startX} ${startY} C ${hx1} ${startY} ${hx2} ${endY} ${endX} ${endY}`;
};

interface SplicingDiagramProps {
    content: DiagramContent;
    viewport: SplicingDiagramData['viewport'];
    isEditing: boolean;
    onContentUpdate: (newContent: DiagramContent) => void;
    onViewportUpdate: (newViewport: SplicingDiagramData['viewport']) => void;
    pendingNodeType: NodeType | null;
    onPendingNodeHandled: () => void;
}

const SplicingDiagram: React.FC<SplicingDiagramProps> = ({ content, viewport, isEditing, onContentUpdate, onViewportUpdate, pendingNodeType, onPendingNodeHandled }) => {
    const { nodes, connections } = content;
    const { x, y, zoom } = viewport;

    const [elementPositions, setElementPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
    const [selection, setSelection] = useState<{ nodeId: string; fiberId: string; type: 'in' | 'out' } | null>(null);
    const [draggingNode, setDraggingNode] = useState<{ id: string, offset: { x: number, y: number } } | null>(null);
    const [newCableModalInfo, setNewCableModalInfo] = useState<{type: 'input-cable' | 'output-cable', position: {x: number, y: number}} | null>(null);
    const [splitterModalInfo, setSplitterModalInfo] = useState<{position: {x: number, y: number}} | null>(null);
    const [editingConnection, setEditingConnection] = useState<{ id: string, label: string } | null>(null);
    const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [hoveredConnectionId, setHoveredConnectionId] = useState<string | null>(null);
    
    const panState = useRef<{ isPanning: boolean, startX: number, startY: number, startPanX: number, startPanY: number } | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const fiberElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
    
    useEffect(() => {
        if (!pendingNodeType || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const position = {
            x: rect.width / 2,
            y: rect.height / 2,
        };

        if (pendingNodeType === 'input-cable' || pendingNodeType === 'output-cable') {
            setNewCableModalInfo({ type: pendingNodeType, position });
        } else if (pendingNodeType === 'splitter') {
            setSplitterModalInfo({ position });
        }
        onPendingNodeHandled();
    }, [pendingNodeType, onPendingNodeHandled]);

    // Update fiber handle positions when diagram changes
    useLayoutEffect(() => {
        if (!canvasRef.current) return;
        const newPositions = new Map<string, { x: number; y: number }>();
        const canvasRect = canvasRef.current.getBoundingClientRect();

        fiberElementsRef.current.forEach((el, id) => {
            const rect = el.getBoundingClientRect();
            // Calculate position relative to the transformed canvas, not the viewport
            const elXInCanvas = rect.left - canvasRect.left;
            const elYInCanvas = rect.top - canvasRect.top;

            const transformedX = (elXInCanvas - x) / zoom;
            const transformedY = (elYInCanvas - y) / zoom;
            
            const isOutput = el.getAttribute('data-handle-type') === 'out';
            const handleX = isOutput ? transformedX + (rect.width / zoom) : transformedX;
            const handleY = transformedY + (rect.height / zoom) / 2;

            newPositions.set(id, { x: handleX, y: handleY });
        });
        setElementPositions(newPositions);
    }, [nodes, viewport]);


    const addNode = (node: DiagramNode) => {
        onContentUpdate({ ...content, nodes: [...nodes, node] });
    };

    const handleConfirmAddCable = (label: string, coreCount: number) => {
        if (!newCableModalInfo) return;
        
        const initialX = (newCableModalInfo.position.x - x) / zoom;
        const initialY = (newCableModalInfo.position.y - y) / zoom;

        const newNode: DiagramNode = {
            id: crypto.randomUUID(),
            type: newCableModalInfo.type,
            position: {
                x: Math.round(initialX / GRID_SIZE) * GRID_SIZE,
                y: Math.round(initialY / GRID_SIZE) * GRID_SIZE,
            },
            data: {
                label,
                fibers: Array.from({ length: coreCount }, (_, i) => ({
                    id: crypto.randomUUID(),
                    label: `F${i + 1}`,
                    color: FIBER_COLORS[i % FIBER_COLORS.length],
                })),
            }
        };
        addNode(newNode);
        setNewCableModalInfo(null);
    };

    const handleConfirmAddSplitter = (label: string, outputCount: number) => {
        if (!splitterModalInfo) return;

        const initialX = (splitterModalInfo.position.x - x) / zoom;
        const initialY = (splitterModalInfo.position.y - y) / zoom;

        const newNode: DiagramNode = {
            id: crypto.randomUUID(),
            type: 'splitter',
            position: {
                x: Math.round(initialX / GRID_SIZE) * GRID_SIZE,
                y: Math.round(initialY / GRID_SIZE) * GRID_SIZE,
            },
            data: {
                label,
                input: {
                    id: crypto.randomUUID(),
                    label: 'IN',
                    color: '#94a3b8', // slate-400
                },
                outputs: Array.from({ length: outputCount }, (_, i) => ({
                    id: crypto.randomUUID(),
                    label: `OUT${i + 1}`,
                    color: FIBER_COLORS[i % FIBER_COLORS.length],
                })),
            }
        };
        addNode(newNode);
        setSplitterModalInfo(null);
    };
    
    const handleDeleteNode = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;
        
        const fibersToDelete = new Set<string>();
        if (node.type === 'input-cable' || node.type === 'output-cable') {
            node.data.fibers?.forEach(f => fibersToDelete.add(f.id));
        } else if (node.type === 'splitter') {
            if(node.data.input) fibersToDelete.add(node.data.input.id);
            node.data.outputs?.forEach(f => fibersToDelete.add(f.id));
        }

        const remainingConnections = connections.filter(c => !fibersToDelete.has(c.from) && !fibersToDelete.has(c.to));
        const remainingNodes = nodes.filter(n => n.id !== nodeId);

        onContentUpdate({ nodes: remainingNodes, connections: remainingConnections });
    };
    
    const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
        if (!isEditing) return;
        const node = nodes.find(n => n.id === nodeId);
        if (node) {
            setDraggingNode({
                id: nodeId,
                offset: {
                    x: e.clientX / zoom - node.position.x,
                    y: e.clientY / zoom - node.position.y,
                }
            });
        }
    };
    
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!draggingNode) return;

        const newX = e.clientX / zoom - draggingNode.offset.x;
        const newY = e.clientY / zoom - draggingNode.offset.y;

        const snappedX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
        const snappedY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
        
        onContentUpdate({
            ...content,
            nodes: nodes.map(n => 
                n.id === draggingNode.id ? { ...n, position: { x: snappedX, y: snappedY } } : n
            )
        });
    }, [draggingNode, zoom, onContentUpdate, content, nodes]);

    const handleMouseUp = useCallback(() => {
        setDraggingNode(null);
    }, []);
    
    useEffect(() => {
        if (draggingNode) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingNode, handleMouseMove, handleMouseUp]);
    
    const isFiberConnected = useCallback((fiberId: string) => {
        return connections.some(c => c.from === fiberId || c.to === fiberId);
    }, [connections]);

    const handleFiberClick = (nodeId: string, fiberId: string, type: 'in' | 'out') => {
        if (!isEditing || isFiberConnected(fiberId)) return;
        
        if (!selection) {
            setSelection({ nodeId, fiberId, type });
        } else {
            if (selection.fiberId === fiberId) {
                setSelection(null);
            } else if (selection.type !== type) {
                const newConnection: Connection = {
                    id: crypto.randomUUID(),
                    from: type === 'in' ? selection.fiberId : fiberId,
                    to: type === 'in' ? fiberId : selection.fiberId,
                };
                onContentUpdate({ ...content, connections: [...connections, newConnection] });
                setSelection(null);
            } else {
                setSelection({ nodeId, fiberId, type });
            }
        }
    };

    // --- Pan and Zoom Handlers ---
    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget || !isEditing) return;
        e.preventDefault();
        setSelectedConnectionId(null);
        panState.current = {
            isPanning: true,
            startX: e.clientX,
            startY: e.clientY,
            startPanX: x,
            startPanY: y,
        };
        if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!panState.current?.isPanning || !isEditing) return;
        const dx = e.clientX - panState.current.startX;
        const dy = e.clientY - panState.current.startY;
        onViewportUpdate({
            x: panState.current.startPanX + dx,
            y: panState.current.startPanY + dy,
            zoom,
        });
    };

    const handleCanvasMouseUpOrLeave = () => {
        if (panState.current?.isPanning) {
            panState.current.isPanning = false;
            if (canvasRef.current) canvasRef.current.style.cursor = isEditing ? 'grab' : 'default';
        }
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (!isEditing) return;
        e.preventDefault();
        const zoomFactor = 1.1;
        const newZoom = e.deltaY > 0 ? zoom / zoomFactor : zoom * zoomFactor;
        const clampedZoom = Math.max(0.2, Math.min(2.5, newZoom));

        if (clampedZoom === zoom || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = (mouseX - x) / zoom;
        const worldY = (mouseY - y) / zoom;

        const newX = mouseX - worldX * clampedZoom;
        const newY = mouseY - worldY * clampedZoom;

        onViewportUpdate({ x: newX, y: newY, zoom: clampedZoom });
    };

    const handleZoom = (direction: 'in' | 'out') => {
        const zoomFactor = 1.25;
        const newZoom = direction === 'out' ? zoom / zoomFactor : zoom * zoomFactor;
        const clampedZoom = Math.max(0.2, Math.min(2.5, newZoom));

        if (clampedZoom === zoom || !canvasRef.current) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const worldX = (centerX - x) / zoom;
        const worldY = (centerY - y) / zoom;

        const newX = centerX - worldX * clampedZoom;
        const newY = centerY - worldY * clampedZoom;

        onViewportUpdate({ x: newX, y: newY, zoom: clampedZoom });
    };
    
    // --- Connection Label and Deletion Handlers ---
    const handleDeleteConnection = useCallback((connectionId: string) => {
        if (!isEditing) return;
        const updatedConnections = connections.filter(c => c.id !== connectionId);
        onContentUpdate({ nodes, connections: updatedConnections });
        setSelectedConnectionId(null);
    }, [isEditing, connections, nodes, onContentUpdate]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isEditing || !selectedConnectionId) return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault(); // Prevent browser back navigation on backspace
                handleDeleteConnection(selectedConnectionId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEditing, selectedConnectionId, handleDeleteConnection]);

    const handleConnectionDoubleClick = (e: React.MouseEvent, connection: Connection) => {
        if (!isEditing) return;
        e.stopPropagation();
        setSelectedConnectionId(null); // Deselect when entering label edit mode
        setEditingConnection({ id: connection.id, label: connection.label || '' });
    };
    
    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingConnection) {
            setEditingConnection({ ...editingConnection, label: e.target.value });
        }
    };
    
    const handleLabelSave = () => {
        if (!editingConnection) return;
        onContentUpdate({
            ...content,
            connections: connections.map(c =>
                c.id === editingConnection.id ? { ...c, label: editingConnection.label.trim() } : c
            ),
        });
        setEditingConnection(null);
    };

    return (
        <div 
            ref={canvasRef}
            className="w-full h-full bg-slate-900/70 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px] relative overflow-hidden" 
            onWheel={handleWheel}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUpOrLeave}
            onMouseLeave={handleCanvasMouseUpOrLeave}
            style={{ cursor: isEditing ? (panState.current?.isPanning ? 'grabbing' : 'grab') : 'default' }}
        >
            <div 
                className="w-full h-full"
                style={{ transform: `translate(${x}px, ${y}px) scale(${zoom})`, transformOrigin: '0 0' }}
            >
                {nodes.map(node => (
                    <DiagramNodeComponent 
                        key={node.id} 
                        node={node} 
                        isEditing={isEditing}
                        onMouseDown={(e) => handleNodeDragStart(e, node.id)}
                        onFiberClick={handleFiberClick}
                        onDeleteNode={handleDeleteNode}
                        selection={selection}
                        isFiberConnected={isFiberConnected}
                        fiberElementsRef={fiberElementsRef}
                        hoveredNodeId={hoveredNodeId}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                    />
                ))}
            </div>

            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
                <g style={{ transform: `translate(${x / zoom}px, ${y / zoom}px)` }}>
                    {connections.map(conn => {
                        const fromPos = elementPositions.get(conn.from);
                        const toPos = elementPositions.get(conn.to);
                        
                        const allFibers = nodes.flatMap(n => [...(n.data.fibers || []), n.data.input, ...(n.data.outputs || [])]).filter((f): f is Fiber => !!f);
                        const fromFiber = allFibers.find(f => f?.id === conn.from);

                        if (!fromPos || !toPos || !fromFiber) return null;
                        
                        const isSelected = selectedConnectionId === conn.id;
                        const isHovered = hoveredConnectionId === conn.id;
                        const midX = (fromPos.x + toPos.x) / 2;
                        const midY = (fromPos.y + toPos.y) / 2;
                        
                        return (
                             <g 
                                key={conn.id} 
                                onClick={(e) => {
                                    if (!isEditing) return;
                                    e.stopPropagation();
                                    setSelectedConnectionId(conn.id);
                                }}
                                onDoubleClick={(e) => handleConnectionDoubleClick(e, conn)} 
                                onMouseEnter={() => isEditing && setHoveredConnectionId(conn.id)}
                                onMouseLeave={() => isEditing && setHoveredConnectionId(null)}
                                className="pointer-events-auto cursor-pointer"
                            >
                                <path
                                    d={getCurvePath(fromPos.x, fromPos.y, toPos.x, toPos.y)}
                                    stroke="transparent"
                                    strokeWidth={12}
                                    fill="none"
                                />
                                <path
                                    d={getCurvePath(fromPos.x, fromPos.y, toPos.x, toPos.y)}
                                    stroke={isHovered && isEditing ? '#ef4444' : (isSelected && isEditing ? '#22d3ee' : fromFiber.color)}
                                    strokeWidth={(isHovered || isSelected) && isEditing ? 4 : 2.5}
                                    fill="none"
                                    className="transition-all opacity-80"
                                />
                                {(conn.label || editingConnection?.id === conn.id) && (
                                    <foreignObject x={midX - 75} y={midY - 20} width="150" height="40">
                                        {editingConnection?.id === conn.id ? (
                                            <input
                                                type="text"
                                                value={editingConnection.label}
                                                onChange={handleLabelChange}
                                                onBlur={handleLabelSave}
                                                onKeyDown={e => { if(e.key === 'Enter') handleLabelSave() }}
                                                onClick={e => e.stopPropagation()}
                                                autoFocus
                                                className="w-full bg-slate-900 text-white text-center text-xs p-1 border border-cyan-400 rounded outline-none"
                                            />
                                        ) : (
                                            <div className="text-center text-xs text-yellow-300 bg-slate-900/80 px-2 py-1 rounded select-none">
                                                {conn.label}
                                            </div>
                                        )}
                                    </foreignObject>
                                )}
                                {isSelected && isEditing && (
                                    <foreignObject x={midX - 16} y={midY - 16} width="32" height="32">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteConnection(conn.id);
                                            }}
                                            className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg"
                                            aria-label="Delete connection"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </foreignObject>
                                )}
                            </g>
                        );
                    })}
                </g>
            </svg>
            <DiagramControls
                zoom={zoom}
                onZoomIn={() => handleZoom('in')}
                onZoomOut={() => handleZoom('out')}
                onReset={() => onViewportUpdate({ x: 0, y: 0, zoom: 1 })}
            />
            <AddCableModal 
                isOpen={!!newCableModalInfo}
                onClose={() => setNewCableModalInfo(null)}
                onSubmit={handleConfirmAddCable}
                nodeType={newCableModalInfo?.type ?? 'input-cable'}
            />
            <AddSplitterModal
                isOpen={!!splitterModalInfo}
                onClose={() => setSplitterModalInfo(null)}
                onSubmit={handleConfirmAddSplitter}
            />
        </div>
    );
};

export default SplicingDiagram;