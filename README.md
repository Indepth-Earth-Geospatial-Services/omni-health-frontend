# Omni Health Frontend

Omni Health is a web application for exploring and comparing health facilities in Rivers State, Nigeria. It provides a user-friendly interface for users to find and learn about healthcare facilities in their area.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)

## Features

- **Interactive Map:** Explore health facilities on an interactive map powered by Mapbox.
- **Facility Filtering:** Filter facilities by Local Government Area (LGA) and facility category.
- **Detailed Information:** View detailed information about each facility, including address, contact information, services, and ratings.
- **LGA Boundaries:** Visualize LGA boundaries on the map to better understand the geographical distribution of facilities.
- **User Authentication:** User authentication and profile management.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Mapping:** [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js) with [react-map-gl](https://visgl.github.io/react-map-gl/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [React Query](https://tanstack.com/query/v4/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed on your machine.

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/Project-Name.git
    ```
2.  Install NPM packages
    ```sh
    pnpm install
    ```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file. See `.env.example` for a template.

- `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox access token.

## Available Scripts

In the project directory, you can run:

| Script       | Description                           |
| ------------ | ------------------------------------- |
| `pnpm dev`   | Runs the app in the development mode. |
| `pnpm build` | Builds the app for production.        |
| `pnpm start` | Starts a production server.           |
| `pnpm lint`  | Runs the linter.                      |

## Project Structure

The project follows a feature-sliced architecture to keep the codebase organized and maintainable.

```
src
├── app         # Next.js app directory
├── components  # Shared components
├── constants   # Shared constants
├── features    # Feature-based modules
├── hooks       # Shared custom hooks
├── lib         # Shared library functions
├── providers   # React context providers
├── services    # API services
├── store       # Zustand stores
└── types       # TypeScript types
```
