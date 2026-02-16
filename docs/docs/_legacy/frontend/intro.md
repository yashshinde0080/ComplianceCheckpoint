---
sidebar_position: 3
---

# Frontend

The frontend application provides the user interface for **Compliance Checkpoint**, built with React and Vite for a fast and responsive experience.

## Technology Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: TailwindCSS & Custom CSS Variables (Obsidian Deep Dark Theme)
- **Routing**: React Router (implied)

## proper docs Structure

- `src/components`: Reusable UI components.
- `src/pages`: Main application views/pages.
- `src/hooks`: Custom React hooks.
- `src/styles`: Global styles and theme definitions.
- `src/index.css`: Core Tailwind directives and theme variables.

## Theme

The application features a custom **Obsidian Deep Dark Theme**:
- **Primary Color**: Electric Purple (`#8400FF`)
- **Background**: Deep Dark (`#060010`)
- **Glassmorphism**: Extensive use of glass-card effects and gradients.

## Development

### Install Dependencies

```bash
npm install
```

### Start Dev Server

```bash
npm run dev
```

The application will run typically at `http://localhost:5173`.
