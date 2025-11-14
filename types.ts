/**
 * Defines the structure for a type of splice box, like 'Joint Box' (JB).
 */
export interface SpliceBoxTypeDefinition {
  /** The full name of the splice box type (e.g., "Joint Box"). */
  name: string;
  /** A short prefix used in the ID generation (e.g., "JB"). */
  prefix: string;
}

/**
 * Contains the detailed, user-editable information for a splice box.
 */
export interface SpliceBoxDetails {
  /** Notes on core connections. */
  coreConnections: string;
  /** Notes on power balance readings. */
  powerBalance: string;
  /** Notes on internal fiber connections. */
  internalConnections: string;
  /** Nearby landmark for location reference. */
  landmark: string;
  /** The general area or district. */
  area: string;
  /** The distance from a reference point. */
  distance: string;
  /** The geographic latitude. */
  latitude: string;
  /** The geographic longitude. */
  longitude: string;
  /** The data for the splicing diagram, supporting both new and old formats for migration. */
  splicingDiagram: SplicingDiagramData | OldSplicingDiagramData;
}

/**
 * Represents a single event in a splice box's history.
 */
export interface HistoryEntry {
  /** The ISO 8601 timestamp of the event. */
  timestamp: string;
  /** The type of event that occurred. */
  event: 'CREATED' | 'DETAILS_UPDATED' | 'DELETED' | 'REINSTATED' | 'TAGS_UPDATED';
  /** A description of the event. */
  notes: string;
}

/**
 * Represents a tag that can be applied to a splice box.
 */
export interface Tag {
  /** The unique name of the tag. */
  name: string;
  /** The Tailwind CSS color class for the tag. */
  color: string;
}

/**
 * Represents the main data structure for a single splice box.
 */
export interface SpliceBox {
  /** The unique identifier of the splice box (e.g., "JB-001A"). */
  id: string;
  /** The prefix indicating the type of the box (e.g., "JB"). */
  type: string;
  /** The current status of the box. 'DELETED' marks it as inactive but preserved. */
  status: 'ACTIVE' | 'DELETED';
  /** A user-editable note or remark. */
  remark: string;
  /** Flag indicating if the box is marked as a favorite. */
  isFavorite: boolean;
  /** An array of tag names associated with the box. */
  tags: string[];
  /** The detailed information for the box. */
  details: SpliceBoxDetails;
  /** An array of historical events for the box. */
  history: HistoryEntry[];
}

/**
 * Represents the user's profile information.
 */
export interface UserProfile {
  /** The user's display name. */
  displayName: string;
  /** A base64 encoded string of the user's profile picture, or null if not set. */
  profilePicture: string | null;
  /** The user's notification preferences. */
  notifications: {
    email: boolean;
    push: boolean;
  };
}

// --- Splicing Diagram specific types ---

/**
 * Represents a single optical fiber within the splicing diagram.
 */
export interface Fiber {
  /** A unique identifier for the fiber. */
  id: string;
  /** The label for the fiber (e.g., "F1"). */
  label: string;
  /** The color code of the fiber. */
  color: string;
}

/**
 * Represents a group of fibers, used in the old diagram data structure.
 * @deprecated This is part of the old data structure and is used for migration only.
 */
export interface FiberGroup {
  id: string;
  label: string;
  fibers: Fiber[];
}

/**
 * Represents a connection between two fibers in the splicing diagram.
 */
export interface Connection {
  /** A unique identifier for the connection. */
  id: string;
  /** The ID of the fiber the connection originates from. */
  from: string;
  /** The ID of the fiber the connection goes to. */
  to: string;
  /** An optional label for the connection. */
  label?: string;
}

/**
 * The possible types for a node in the splicing diagram.
 */
export type NodeType = 'input-cable' | 'output-cable' | 'splitter';

/**
 * Represents a single node in the node-based splicing diagram.
 */
export interface DiagramNode {
  /** A unique identifier for the node. */
  id: string;
  /** The type of the node. */
  type: NodeType;
  /** The position of the node on the diagram canvas. */
  position: { x: number; y: number };
  /** The data associated with the node, which varies by type. */
  data: {
    label: string;
    fibers?: Fiber[]; // For 'input-cable' and 'output-cable' types
    input?: Fiber;    // For 'splitter' type
    outputs?: Fiber[];// For 'splitter' type
  };
}

/**
 * The old, column-based data structure for a splicing diagram. Kept for migration purposes.
 * @deprecated
 */
export interface OldSplicingDiagramData {
  inputs: FiberGroup[];
  outputs: FiberGroup[];
  connections: Connection[];
}

/**
 * The new, flexible, node-based data structure for a splicing diagram.
 */
export interface SplicingDiagramData {
  /** An array of all nodes in the diagram. */
  nodes: DiagramNode[];
  /** An array of all connections between fibers. */
  connections: Connection[];
  /** The viewport state (pan and zoom) of the diagram. */
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

/**
 * Represents the content of the diagram (nodes and connections) without the viewport.
 * This is used for tracking history for undo/redo functionality.
 */
export interface DiagramContent {
    nodes: DiagramNode[];
    connections: Connection[];
}