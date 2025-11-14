import React from 'react';
import { PlusIcon, MinusIcon, RefreshIcon } from '../Icons';

/**
 * Props for the DiagramControls component.
 */
interface DiagramControlsProps {
    /** The current zoom level of the diagram. */
    zoom: number;
    /** Callback function to handle zooming in. */
    onZoomIn: () => void;
    /** Callback function to handle zooming out. */
    onZoomOut: () => void;
    /** Callback function to reset the diagram's view. */
    onReset: () => void;
}

/**
 * A component that provides UI controls for the splicing diagram.
 * This includes buttons for zooming in, zooming out, and resetting the view.
 *
 * @param {DiagramControlsProps} props - The component props.
 * @returns {JSX.Element} The rendered diagram controls component.
 */
const DiagramControls: React.FC<DiagramControlsProps> = ({ zoom, onZoomIn, onZoomOut, onReset }) => (
    <div className="absolute bottom-4 right-4 z-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-2 rounded-lg shadow-lg flex items-center space-x-2 text-white">
        <button onClick={onZoomOut} className="p-2 hover:bg-slate-700 rounded-md transition-colors" aria-label="Zoom out">
            <MinusIcon />
        </button>
        <span className="font-mono text-sm w-12 text-center" aria-label={`Current zoom level`}>
            {Math.round(zoom * 100)}%
        </span>
        <button onClick={onZoomIn} className="p-2 hover:bg-slate-700 rounded-md transition-colors" aria-label="Zoom in">
            <PlusIcon />
        </button>
        <div className="h-6 w-px bg-slate-600"></div>
        <button onClick={onReset} className="p-2 hover:bg-slate-700 rounded-md transition-colors" aria-label="Reset view">
            <RefreshIcon />
        </button>
    </div>
);

export default DiagramControls;
