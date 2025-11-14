export interface SpliceBoxTypeDefinition {
  name: string;
  prefix: string;
}

export interface SpliceBoxDetails {
  coreConnections: string;
  powerBalance: string;
  internalConnections: string;
  landmark: string;
  area: string;
  distance: string;
  latitude: string;
  longitude: string;
  splicingDiagram: SplicingDiagramData | OldSplicingDiagramData; // Allow old format for migration
}

export interface HistoryEntry {
  timestamp: string;
  event: 'CREATED' | 'DETAILS_UPDATED' | 'DELETED' | 'REINSTATED' | 'TAGS_UPDATED';
  notes: string;
}

export interface Tag {
  name: string;
  color: string;
}

export interface SpliceBox {
  id: string;
  type: string;
  status: 'ACTIVE' | 'DELETED';
  remark: string;
  isFavorite: boolean;
  tags: string[];
  details: SpliceBoxDetails;
  history: HistoryEntry[];
}

export interface UserProfile {
  displayName: string;
  profilePicture: string | null;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

// Splicing Diagram specific types
export interface Fiber {
  id: string;
  label: string;
  color: string;
}

export interface FiberGroup {
  id: string;
  label: string;
  fibers: Fiber[];
}

export interface Connection {
  id: string;
  from: string; // from fiber id
  to: string;   // to fiber id
  label?: string;
}

// New types for node-based diagram
export type NodeType = 'input-cable' | 'output-cable' | 'splitter';

export interface DiagramNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    // For cables
    fibers?: Fiber[]; 
    // For splitters
    input?: Fiber;
    outputs?: Fiber[];
  };
}

// The old data structure, kept for migration purposes
export interface OldSplicingDiagramData {
  inputs: FiberGroup[];
  outputs: FiberGroup[];
  connections: Connection[];
}

// The new, flexible node-based data structure
export interface SplicingDiagramData {
  nodes: DiagramNode[];
  connections: Connection[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

// Type for diagram content, excluding viewport, for history tracking
export interface DiagramContent {
    nodes: DiagramNode[];
    connections: Connection[];
}