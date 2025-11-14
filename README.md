# Splice Box Manager

Splice Box Manager is a web application for generating, tracking, and managing splice box IDs. It provides a user-friendly interface for handling splice box information, including details, location, and splicing diagrams.

## Features

- **ID Generation**: Sequentially generate unique IDs for different types of splice boxes.
- **Detailed Tracking**: Store and edit details for each splice box, including location, connections, and remarks.
- **Splicing Diagram**: A visual, interactive diagramming tool to map out fiber connections.
- **Search and Filter**: Easily find splice boxes with a powerful search that supports field-specific queries and tag-based filtering.
- **User Profiles**: Manage user information and preferences.

## Tech Stack

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Vite**: A fast build tool and development server for modern web projects.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/splice-box-manager.git
    cd splice-box-manager
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### Running the Development Server

1.  **Start the development server:**

    ```bash
    npm run dev
    ```

2.  Open your browser and navigate to `http://localhost:5173` (or the address shown in your terminal).

## Usage

-   **Generating IDs**: Select a box type from the dropdown and click "Generate New ID".
-   **Editing Details**: Select an ID from the list to view its details. Click "Edit" to modify the information.
-   **Splicing Diagram**: Click "View Splicing Diagram" to open the interactive diagramming tool.
-   **Searching**: Use the search bar to find IDs. You can perform a global search or use keywords like `remark:`, `landmark:`, etc., for more specific queries.
-   **Settings**: Click the gear icon to manage box types and tags.

## Project Structure

```
/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── modals/       # Modal dialog components
│   │   └── splicing/     # Components for the splicing diagram
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main application component
│   ├── constants.ts      # Application-wide constants
│   ├── index.tsx         # Application entry point
│   ├── types.ts          # TypeScript type definitions
│   └── ...
├── .gitignore
├── package.json
├── README.md
└── ...
```
